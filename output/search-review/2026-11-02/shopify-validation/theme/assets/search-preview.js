/* Product retrieval independent from optional analytics. Uses the normal search context. */
(() => {
  const api = window.bikerzSearchV2;
  if (!api) return;
  const cached = new Map();
  const queryCache = new Map();
  const states = new WeakMap();
  const stateFor = element => { if (!states.has(element)) states.set(element, {revision:0,composing:false,controller:null}); return states.get(element); };
  const searchInput = form => form instanceof HTMLFormElement && form.querySelector('input[type="search"][name="q"]');
  document.addEventListener('formdata', event => {
    const input = searchInput(event.target);
    if (!input || !/\/search\/?$/.test(new URL(event.target.action, location.href).pathname)) return;
    const plan = api.plan(input.value);
    if (plan.mode === 'empty') return;
    // Original product cards contain purchase fields. They belong to the card,
    // and must never become parameters of a search (including analytics FormData).
    for (const field of event.target.querySelectorAll('[data-predictive-search] [name]')) {
      if (field.form === event.target) event.formData.delete(field.name);
    }
    const params = new URLSearchParams(plan.params);
    for (const key of new Set(params.keys())) event.formData.delete(key);
    for (const [key, value] of params) event.formData.append(key, value);
  });
  const pairs = params => [...params].filter(([key]) => key.startsWith('filter.')).map(([key,value]) => `${key}=${/custom\.(ancho|aspecto|di_metro)$/.test(key) ? Number(value) : value}`).sort();
  const remember = (cache, key, value) => { cache.set(key,value); if (cache.size > 50) cache.delete(cache.keys().next().value); };
  // Suggestions are optional, parallel and isolated: they can never rewrite the
  // product request or hold up results. Failures leave the product results usable.
  async function querySuggestions(raw, signal) {
    const key = JSON.stringify([api.config.language,api.config.country,api.config.currency,api.config.theme,raw]);
    if (queryCache.has(key)) return queryCache.get(key);
    const url = new URL(api.config.searchUrl.replace(/\/$/,'') + '/suggest',location.origin);
    url.searchParams.set('q',raw);
    url.searchParams.set('resources[type]','query');
    url.searchParams.set('resources[limit]','3');
    url.searchParams.set('section_id','search-query-suggestions');
    const previewTheme = new URLSearchParams(location.search).get('preview_theme_id');
    if (previewTheme) url.searchParams.set('preview_theme_id',previewTheme);
    const response = await fetch(url,{signal});
    if (!response.ok) return '';
    const doc = new DOMParser().parseFromString(await response.text(),'text/html');
    const section = doc.querySelector('#shopify-section-search-query-suggestions [data-search-query-suggestions-response]');
    if (!section || section.dataset.query !== raw || section.querySelector('script,form')) return '';
    const list = section.querySelector('.predictive-search__suggestions');
    const plan = api.plan(raw), expected = new URLSearchParams(plan.params);
    if (plan.mode === 'structured' && list) {
      for (const item of list.querySelectorAll('[role="option"]')) {
        const href = item.querySelector('a')?.getAttribute('href');
        const proposed = api.plan(href ? new URL(href,location.origin).searchParams.get('q') || item.textContent : item.textContent);
        const actual = new URLSearchParams(proposed.params);
        const compatible = [...new Set([...expected.keys()].filter(key => key.startsWith('filter.')))].every(key => {
          const values = pairs([...expected].filter(([name]) => name === key));
          return pairs([...actual].filter(([name]) => name === key)).some(value => values.includes(value));
        });
        const samePlan = proposed.query === plan.query && JSON.stringify(pairs(actual)) === JSON.stringify(pairs(expected));
        const constructionMatches = !plan.constraints.tire?.construction || proposed.constraints.tire?.construction === plan.constraints.tire.construction;
        if (!compatible || samePlan || !constructionMatches) item.remove();
      }
    }
    const html = list?.querySelector('[role="option"]') ? list.outerHTML : '';
    remember(queryCache,key,html);
    return html;
  }
  customElements.whenDefined('predictive-search').then(() => {
    const prototype = customElements.get('predictive-search').prototype;
    const invalidate = element => {
      const state = stateFor(element); state.revision++; state.controller?.abort(); state.queryController?.abort();
      element.close(false); element.predictiveSearchResults.replaceChildren();
      element.input.removeAttribute('aria-activedescendant'); element.removeAttribute('loading');
      element.predictiveSearchResults.setAttribute('aria-busy','false');
    };
    document.querySelectorAll('predictive-search').forEach(element => {
      element.predictiveSearchResults.setAttribute('role','listbox');
      element.input.addEventListener('input', () => invalidate(element));
      element.input.addEventListener('compositionstart', () => { stateFor(element).composing = true; invalidate(element); });
      element.input.addEventListener('compositionend', () => { stateFor(element).composing = false; });
      element.input.form.addEventListener('reset', () => invalidate(element));
    });
    prototype.getSearchResults = async function (raw) {
      const state = stateFor(this);
      if (state.composing || !raw.trim()) return;
      const revision = state.revision, plan = api.plan(raw);
      const key = `${api.config.theme}:${plan.key}`;
      const requestId = crypto.randomUUID(), started = performance.now();
      state.controller?.abort();
      state.queryController?.abort();
      const controller = new AbortController(); state.controller = controller;
      const queryController = new AbortController(); state.queryController = queryController;
      const queryTimeout = setTimeout(() => queryController.abort(),8000);
      const suggestions = querySuggestions(raw,queryController.signal).catch(() => '').finally(() => clearTimeout(queryTimeout));
      this.setLiveRegionLoadingState(); this.predictiveSearchResults.setAttribute('aria-busy','true');
      const timeout = setTimeout(() => controller.abort('timeout'), 8000);
      let source = 'cache';
      try {
        let html = cached.get(key);
        if (!html) {
          source = 'network';
          const url = new URL(api.config.searchUrl, location.origin);
          url.search = plan.params; url.searchParams.set('section_id','search-preview');
          const previewTheme = new URLSearchParams(location.search).get('preview_theme_id');
          if (previewTheme) url.searchParams.set('preview_theme_id',previewTheme);
          const response = await fetch(url,{signal:controller.signal});
          if (!response.ok) { const error = new Error('http_error'); error.httpStatus = response.status; throw error; }
          const doc = new DOMParser().parseFromString(await response.text(),'text/html');
          const section = doc.querySelector('#shopify-section-search-preview');
          const metadata = section?.querySelector('[data-search-preview-metadata]');
          let actualFilters;
          try { actualFilters = pairs(JSON.parse(metadata?.dataset.searchFilters || '[]').map(pair => [pair.name,String(pair.value)])); } catch { throw new Error('invalid_response'); }
          const empty = metadata?.dataset.searchTotal === '0';
          if (!section || !metadata || metadata.dataset.query !== plan.query || (!empty && JSON.stringify(actualFilters) !== JSON.stringify(pairs(new URLSearchParams(plan.params)))) || [...section.querySelectorAll('script')].some(script => !['application/json','application/ld+json'].includes(script.type))) throw new Error('invalid_response');
          html = section.innerHTML; remember(cached,key,html);
        }
        if (controller.signal.aborted || state.revision !== revision || this.getQuery() !== raw || !this.contains(document.activeElement)) return;
        this.renderSearchResults(html);
        const label = this.predictiveSearchResults.querySelector('[data-predictive-search-search-for-text]');
        if (label) label.textContent = (api.config.viewAllLabel || 'Ver todos los resultados para “__QUERY__”').replace('__QUERY__',raw);
        if (plan.mode === 'structured' && plan.constraints.tire) {
          const link = document.createElement('a'); link.className = 'predictive-search__assist-link';
          const url = new URL(api.config.tireUrl || '/collections/neumaticos',location.origin);
          for (const [name,value] of new URLSearchParams(plan.params)) if (name.startsWith('filter.')) url.searchParams.append(name,value);
          link.href = url.href;
          const tire = plan.constraints.tire;
          const size = tire.profile ? `${tire.width}/${tire.profile}${tire.rim ? `-${tire.rim}` : ''}` : `${Number(tire.width).toFixed(2)}-${tire.rim}`;
          const text = document.createElement('span'); text.className = 'predictive-search__view-all-text';
          text.textContent = (api.config.tireLabel || 'Neumáticos __SIZE__ en el buscador de medidas').replace('__SIZE__',size);
          link.append(text);
          const arrow = this.predictiveSearchResults.querySelector('.predictive-search__view-all svg:last-of-type');
          if (arrow) link.append(arrow.cloneNode(true));
          this.predictiveSearchResults.querySelector('.predictive-search__view-all')?.after(link);
          const emptyLink = this.predictiveSearchResults.querySelector('[data-search-tire-link]');
          if (emptyLink) emptyLink.href = url.href;
        }
        const emptyMessage = this.predictiveSearchResults.querySelector('[data-search-empty]');
        if (emptyMessage) emptyMessage.textContent = `No encontramos resultados para “${raw}”.`;
        this.dataset.searchPreviewStatus = 'success';
        this.dispatchEvent(new CustomEvent('bikerz:search-preview-v2',{bubbles:true,detail:{element:this,raw,requestId,source,started}}));
        void suggestions.then(markup => {
          // Keep the current keyboard selection stable if suggestions arrive late.
          if (!markup || queryController.signal.aborted || state.queryController !== queryController || state.revision !== revision || this.getQuery() !== raw || !this.isOpen || !this.contains(document.activeElement) || this.input.hasAttribute('aria-activedescendant')) return;
          const slot = this.predictiveSearchResults.querySelector('[data-search-query-suggestions]');
          if (slot) {
            slot.innerHTML = markup;
            this.predictiveSearchResults.querySelector('.predictive-search__results-groups-wrapper')?.classList.remove('predictive-search__results-groups-wrapper--no-suggestions');
          }
        });
      } catch (error) {
        if (state.revision !== revision || state.controller !== controller || (controller.signal.aborted && controller.signal.reason !== 'timeout')) return;
        queryController.abort();
        this.close(false);
        const message = document.createElement('p'); message.className = 'search-preview-message';
        message.textContent = 'No pudimos cargar los resultados. Puedes buscar con Enter.';
        if (this.statusElement) this.statusElement.textContent = message.textContent;
        this.predictiveSearchResults.replaceChildren(message); this.predictiveSearchResults.style.display = 'block';
        this.dataset.searchPreviewStatus = error.message || 'network_error';
        this.dispatchEvent(new CustomEvent('bikerz:search-preview-v2-error',{bubbles:true,detail:{element:this,raw,requestId,code:['http_error','invalid_response'].includes(error.message)?error.message:'network_error',httpStatus:error.httpStatus || null}}));
      } finally {
        clearTimeout(timeout);
        if (state.controller === controller) { this.removeAttribute('loading'); this.predictiveSearchResults.setAttribute('aria-busy','false'); }
      }
    };
  });
})();
