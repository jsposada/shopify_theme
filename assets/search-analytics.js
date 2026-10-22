/* Search observations only. Shopify owns consent and pixel delivery. */
(() => {
  const configNode = document.getElementById('bikerz-search-analytics-config');
  if (!configNode || window.bikerzSearchAnalytics) return;
  let config;
  try { config = JSON.parse(configNode.textContent); } catch (_) { return; }
  const contract = window.BikerzSearchContract;
  if (!config.enabled || !contract || typeof window.crypto?.randomUUID !== 'function') return;

  const STORAGE = 'bikerz.search.analytics.v1';
  const TTL = 30 * 60 * 1000;
  const PENDING_TTL = 2 * 60 * 1000;
  let states = new WeakMap();
  const cached = new Map();
  const submitted = new WeakMap();
  const triggers = new WeakMap();
  const resultViews = new Set();
  const resultStates = new WeakMap();
  const uuid = () => window.crypto.randomUUID();
  const normalize = (raw) => window.bikerzSearch ? window.bikerzSearch.normalize(raw) : { query: raw, submitQuery: raw };
  const keyFor = (raw) => normalize(raw).submitQuery.trim().toLowerCase();
  const allowed = () => {
    try { return window.Shopify?.customerPrivacy?.analyticsProcessingAllowed() === true; } catch (_) { return false; }
  };
  function clearHandoff() { try { sessionStorage.removeItem(STORAGE); } catch (_) { /* Storage can be disabled. */ } }
  function readHandoff() {
    if (!allowed()) return null;
    try {
      const value = JSON.parse(sessionStorage.getItem(STORAGE));
      if (value && Number.isFinite(value.saved_at) && Date.now() - value.saved_at >= 0 && Date.now() - value.saved_at < TTL) return value;
    } catch (_) { /* Ignore unavailable or malformed storage. */ }
    clearHandoff();
    return null;
  }
  function saveHandoff(value) {
    if (!allowed() || value.payload.text_redacted) return;
    try { sessionStorage.setItem(STORAGE, JSON.stringify({ ...value, saved_at: Date.now() })); } catch (_) { /* Keep navigation working. */ }
  }
  function publish(name, data) {
    if (!allowed()) return false;
    const payload = contract.project(name, data);
    const resultEvent = name === 'bikerz:search_results_viewed';
    if (!payload) {
      if (resultEvent) configNode.dataset.resultsStatus = 'invalid_contract';
      return false;
    }
    if (typeof window.Shopify?.analytics?.publish !== 'function') {
      if (resultEvent) configNode.dataset.resultsStatus = 'waiting_for_publisher';
      return false;
    }
    try {
      const delivery = window.Shopify.analytics.publish(name, payload);
      if (delivery === false) return false;
      if (resultEvent) configNode.dataset.resultsStatus = 'dispatching';
      Promise.resolve(delivery).then((accepted) => {
        if (resultEvent) configNode.dataset.resultsStatus = accepted === false ? 'publish_rejected' : 'dispatched';
      }).catch(() => { if (resultEvent) configNode.dataset.resultsStatus = 'publish_rejected'; });
      return true;
    } catch (_) { return false; }
  }
  function stateFor(form, raw) {
    let state = states.get(form);
    if (!state || (!state.raw && raw)) {
      state = { id: uuid(), revision: 0, raw: '', preview: null, seen: new Set() };
      states.set(form, state);
    }
    if (state.raw !== raw) { state.raw = raw; state.revision += 1; state.preview = null; }
    if (!state.revision) state.revision = 1;
    return state;
  }
  function base(state, form, raw, submittedQuery = null) {
    const normalized = normalize(raw);
    return {
      schema_version: 1, search_id: state.id, query_revision: state.revision,
      request_id: null, preview_request_id: state.preview?.request_id || null,
      surface: form?.closest('main-search') ? 'results' : form?.closest('.header__search') ? 'header' : 'general',
      ...contract.queries(raw, normalized.query, submittedQuery), context_redacted: false,
      normalization_version: '1', theme_version: 'search-analytics-1',
      language: config.language || 'unknown', country: config.country || 'unknown',
      submission_method: 'unknown', correlation_status: 'interaction', status: 'success',
      product_ids: [], products_returned: null, products_shown: null, suggestions_shown: null,
      result_count: null, result_scope: 'unknown', resource_types: ['store_settings'],
      page: null, page_size: null, display_limit: null, duration_ms: null, source: null,
      error_code: null, http_status: null, search_options: [],
    };
  }
  function ids(value) { return [...new Set((value || '').split(',').filter((id) => /^[1-9]\d{0,23}$/.test(id)))].slice(0, 24); }
  function number(value) { const n = Number(value); return value !== '' && Number.isSafeInteger(n) && n >= 0 ? n : null; }
  function searchURL(value) {
    try { const url = new URL(value, location.href); return url.origin === location.origin && /\/search\/?$/.test(url.pathname) ? url : null; } catch (_) { return null; }
  }
  function previewError(element, state, raw, requestId, code, httpStatus = null) {
    publish('bikerz:search_preview_error', {
      ...base(state, element.input.form, raw), request_id: requestId, status: 'error',
      error_code: code, http_status: httpStatus, source: 'network',
    });
  }
  function observePreview(element, state, raw, requestId, source, started) {
    requestAnimationFrame(() => {
      if (element.getQuery() !== raw || !element.isOpen || !element.getClientRects().length) return;
      const root = element.predictiveSearchResults.querySelector('[data-search-preview-metadata]');
      if (!root || root.dataset.query !== normalize(raw).query) return;
      const shown = [...root.querySelectorAll('[data-search-product-id]')]
        .filter((node) => node.getClientRects().length).map((node) => node.dataset.searchProductId);
      const productIds = [...new Set(shown)].slice(0, 24);
      const returned = number(root.dataset.productsReturned);
      if (returned === null) return;
      const snapshot = `${state.revision}:${root.dataset.query}:${productIds.join(',')}:${returned}`;
      if (state.seen.has(snapshot)) return;
      const payload = {
        ...base(state, element.input.form, raw), request_id: requestId, source,
        product_ids: productIds, products_returned: returned, products_shown: productIds.length,
        suggestions_shown: root.querySelectorAll('.predictive-search__suggestion').length,
        display_limit: 5, duration_ms: Math.max(0, Math.round(performance.now() - started)),
        status: returned === 0 ? 'no_products' : 'success',
      };
      if (publish('bikerz:search_preview_viewed', payload)) {
        state.seen.add(snapshot);
        state.preview = payload;
      }
    });
  }

  // Replace only the predictive fetch method: keep the theme's keyboard, focus,
  // rendering and reset methods. Own request provenance instead of scraping text.
  customElements.whenDefined('predictive-search').then(() => {
    const prototype = customElements.get('predictive-search').prototype;
    prototype.getSearchResults = async function (raw) {
      const state = stateFor(this.input.form, raw);
      const requestId = uuid();
      const revision = state.revision;
      const query = normalize(raw).query;
      const cacheKey = `${config.language}:${config.country}:${query}`;
      const started = performance.now();
      this.abortController.abort();
      const controller = new AbortController();
      this.abortController = controller;
      this.setLiveRegionLoadingState();
      let source = 'cache';
      let html = cached.get(cacheKey);
      try {
        if (!html) {
          source = 'network';
          const url = new URL(window.routes.predictive_search_url, location.origin);
          url.searchParams.set('q', query);
          url.searchParams.set('section_id', 'predictive-search');
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) {
            previewError(this, state, raw, requestId, 'http_error', response.status);
            if (this.abortController === controller) this.close();
            return;
          }
          const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
          const section = doc.querySelector('#shopify-section-predictive-search');
          const metadata = section?.querySelector('[data-search-preview-metadata]');
          if (!section || !metadata || metadata.dataset.query !== query) {
            previewError(this, state, raw, requestId, 'invalid_response');
            if (this.abortController === controller) this.close();
            return;
          }
          html = section.innerHTML;
          cached.set(cacheKey, html);
          if (cached.size > 50) cached.delete(cached.keys().next().value);
        }
        if (controller.signal.aborted || this.abortController !== controller || state.revision !== revision || this.getQuery() !== raw || !this.contains(document.activeElement)) return;
        this.renderSearchResults(html);
        observePreview(this, state, raw, requestId, source, started);
      } catch (error) {
        if (!controller.signal.aborted) {
          previewError(this, state, raw, requestId, html ? 'render_error' : 'network_error');
          if (this.abortController === controller) this.close();
        }
      } finally {
        if (this.abortController === controller) this.removeAttribute('loading');
      }
    };
  }).catch(() => {});

  document.addEventListener('input', (event) => {
    const input = event.target;
    if (input.matches('input[name="q"]') && input.form && searchURL(input.form.action)) stateFor(input.form, input.value.trim());
  }, true);
  document.addEventListener('reset', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !searchURL(form.action)) return;
    // The theme handles reset itself; inspect the value after its listener runs.
    queueMicrotask(() => { if (!form.querySelector('input[name="q"]')?.value.trim()) states.delete(form); });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.matches('input[name="q"]') && event.target.form) triggers.set(event.target.form, { method: 'enter', at: performance.now() });
  }, true);
  document.addEventListener('pointerdown', (event) => {
    const button = event.target.closest('button[type="submit"], input[type="submit"]');
    if (button?.form) triggers.set(button.form, { method: 'button', at: performance.now() });
  }, true);
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !searchURL(form.action)) return;
    const input = form.querySelector('input[name="q"]');
    if (input) submitted.set(event, { raw: input.value.trim(), state: stateFor(form, input.value.trim()) });
  }, true);
  document.addEventListener('submit', (event) => {
    const capture = submitted.get(event);
    if (!capture || event.defaultPrevented || !capture.raw) return;
    const form = event.target;
    const data = new FormData(form);
    const query = data.get('q');
    if (typeof query !== 'string' || !query.trim()) return;
    const trigger = triggers.get(form);
    const method = trigger && performance.now() - trigger.at < 2000 ? trigger.method : event.submitter ? 'button' : 'unknown';
    triggers.delete(form);
    const payload = {
      ...base(capture.state, form, capture.raw, query.trim()), ...contract.options(data.entries()),
      submission_method: method,
      correlation_status: capture.state.preview ? 'matched' : 'missing_preview',
    };
    if (publish('bikerz:search_submit', payload)) saveHandoff({ kind: 'pending', payload });
  });
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    const url = link && searchURL(link.href);
    if (!url || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const form = link.closest('form[role="search"]');
    const raw = form?.querySelector('input[name="q"]')?.value.trim() || url.searchParams.get('q') || '';
    const query = url.searchParams.get('q');
    if (!query) return;
    const state = stateFor(form || link, raw);
    const changed = keyFor(raw) !== keyFor(query);
    const payload = {
      ...base(state, form, raw, query), ...contract.options(url.searchParams.entries()),
      submission_method: link.matches('.predictive-search__suggestion') ? 'suggestion' : 'link',
      correlation_status: changed ? 'changed_query' : state.preview ? 'matched' : 'missing_preview',
    };
    if (publish('bikerz:search_submit', payload)) saveHandoff({ kind: 'pending', payload });
  });

  function observeResults() {
    const metadata = document.querySelector('[data-search-results-metadata]');
    if (!metadata) return true;
    if (!allowed()) { configNode.dataset.resultsStatus = 'waiting_for_consent'; return false; }
    const query = metadata.dataset.query;
    const handoff = readHandoff();
    const matching = handoff && handoff.payload?.submitted_query === query && (handoff.kind === 'active' || Date.now() - handoff.saved_at < PENDING_TTL);
    let state = resultStates.get(metadata);
    if (!state) { state = { id: uuid(), revision: 1, preview: null }; resultStates.set(metadata, state); }
    const initial = matching ? handoff.payload : base(state, null, query, query);
    const types = (metadata.dataset.resourceTypes || '').split(',').filter(Boolean);
    const count = number(metadata.dataset.total);
    const page = number(metadata.dataset.page);
    if (count === null || !page) return true;
    const productIds = ids(metadata.dataset.productIds);
    const params = new URLSearchParams(location.search);
    const payload = {
      ...initial, ...contract.options(params.entries()), surface: 'results',
      // A pending record explicitly hands over the ID; query equality only verifies it.
      correlation_status: matching ? initial.correlation_status : 'unmatched',
      request_id: null, product_ids: productIds, products_returned: null,
      products_shown: productIds.length, suggestions_shown: null, result_count: count,
      result_scope: types.length === 1 && types[0] === 'product' ? 'product' : 'mixed',
      resource_types: types.length ? types : ['store_settings'], page, page_size: 24,
      display_limit: number(metadata.dataset.displayLimit), duration_ms: null, source: 'page',
      status: count === 0 ? 'no_products' : 'success',
    };
    const snapshot = JSON.stringify([payload.search_id, query, page, productIds, count, payload.search_options]);
    if (resultViews.has(snapshot)) return true;
    if (publish('bikerz:search_results_viewed', payload)) {
      resultViews.add(snapshot);
      if (resultViews.size > 100) resultViews.delete(resultViews.values().next().value);
      saveHandoff({ kind: 'active', payload });
      return true;
    }
    return false;
  }
  function ready() {
    // Shopify's consent API and publisher may appear after DOMContentLoaded.
    // Retry only initial result metadata, for at most ten seconds; never queue
    // observations without consent or keep a background polling loop alive.
    function initialResults(attempt = 0) {
      if (!observeResults() && attempt < 40) setTimeout(() => initialResults(attempt + 1), 250);
    }
    initialResults();
    const main = document.querySelector('main');
    if (main) new MutationObserver((mutations) => {
      if (mutations.some((mutation) => [...mutation.addedNodes].some((node) => node.nodeType === 1 && (node.matches('[data-search-results-metadata]') || node.querySelector('[data-search-results-metadata]'))))) requestAnimationFrame(observeResults);
    }).observe(main, { childList: true, subtree: true });
    try {
      if (!window.Shopify?.customerPrivacy && window.Shopify?.loadFeatures) window.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.2' }], (error) => { if (!error) observeResults(); });
    } catch (_) { /* Missing privacy API means no analytics. */ }
  }
  document.addEventListener('visitorConsentCollected', () => {
    if (!allowed()) { clearHandoff(); states = new WeakMap(); resultViews.clear(); }
    else observeResults();
  });
  window.addEventListener('pageshow', (event) => { if (event.persisted) observeResults(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
  window.bikerzSearchAnalytics = { version: 1 };
})();
