/* Partial collection navigation shared by the tire and parts landings. */
(() => {
  function init() {
    const catalog = document.querySelector('.seo-results-catalog--neumaticos, .seo-results-catalog--repuestos');
    const isParts = catalog?.classList.contains('seo-results-catalog--repuestos');
    const finder = document.querySelector(isParts ? '[data-parts-finder]' : '[data-tire-finder]');
    const eventPrefix = isParts ? 'bikerz:parts-results-' : 'bikerz:tire-results-';
    const catalogStatus = catalog?.querySelector('[data-parts-catalog-status]');
    const grid = catalog?.querySelector('#ProductGridContainer');
    const Facets = customElements.get('facet-filters-form');
    if (!finder || !grid || !Facets || catalog.dataset.tireResultsReady) return;
    catalog.dataset.tireResultsReady = 'true';

    let controller;
    let sequence = 0;
    let committedParams = location.search.slice(1);
    let committedHTML = catalog.outerHTML;

    function notify(name, detail = {}) {
      finder.dispatchEvent(new CustomEvent(`${eventPrefix}${name}`, { detail }));
      if (!catalogStatus) return;
      catalogStatus.replaceChildren();
      if (name === 'loading') catalogStatus.textContent = 'Actualizando repuestos…';
      if (name === 'updated') catalogStatus.textContent = `${detail.count} ${detail.count === 1 ? 'resultado encontrado' : 'resultados encontrados'}.`;
      if (name === 'error') {
        const link = document.createElement('a');
        link.href = detail.url;
        link.textContent = 'Ver resultados';
        catalogStatus.append('No pudimos actualizar los resultados. Intenta nuevamente o abre la página de resultados. ', link);
      }
    }

    function normalize(params) {
      const input = new URLSearchParams(params);
      const result = new URLSearchParams();
      for (const [key, value] of input) {
        if (key === 'section_id' || key === 'sections') continue;
        if (isParts && key.startsWith('ymm_')) continue;
        if (!result.getAll(key).includes(value)) result.append(key, value);
      }
      for (const key of ['preview_theme_id', 'view']) {
        const value = new URLSearchParams(location.search).get(key);
        if (value && !result.has(key)) result.set(key, value);
      }
      return result.toString();
    }

    function setBusy(busy) {
      grid.setAttribute('aria-busy', String(busy));
      grid.querySelector('.collection')?.classList.toggle('loading', busy);
      document.getElementById('ProductCountDesktop')?.classList.toggle('loading', busy);
    }

    function syncCheckboxes(source) {
      const inputs = [...source.querySelectorAll('facet-filters-form input[type="checkbox"]')];
      for (const input of catalog.querySelectorAll('facet-filters-form input[type="checkbox"]')) {
        const match = inputs.find(other => other.name === input.name && other.value === input.value);
        if (match) input.checked = match.checked;
      }
    }

    async function render(params, event, updateHistory = true, scroll = false) {
      // The motorcycle finder restores its own API results when navigating history.
      if (isParts && !updateHistory && new URLSearchParams(params).has('ymm_model')) {
        sequence += 1;
        controller?.abort();
        setBusy(false);
        Facets.searchParamsPrev = params;
        return;
      }
      const query = normalize(params);
      const url = new URL(location.pathname, location.origin);
      url.search = query;
      if (scroll || location.hash === '#ProductGridContainer') url.hash = 'ProductGridContainer';
      const requestId = ++sequence;
      controller?.abort();
      controller = new AbortController();
      const requestController = controller;
      const signal = requestController.signal;
      const timeout = setTimeout(() => requestController.abort(), 15000);
      Facets.searchParamsPrev = query;
      setBusy(true);
      notify('loading');
      let committed = false;

      try {
        const sectionId = grid.querySelector('#product-grid')?.dataset.id;
        if (!sectionId) throw new Error('Missing collection section');
        const requestURL = new URL(url);
        requestURL.hash = '';
        requestURL.searchParams.set('section_id', sectionId);
        const response = await fetch(requestURL, { signal, credentials: 'same-origin' });
        if (!response.ok) throw new Error(`Collection request failed (${response.status})`);
        const html = await response.text();
        if (requestId !== sequence) return;
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const nextGrid = parsed.getElementById('ProductGridContainer');
        const countNode = nextGrid?.querySelector('[data-tire-results-count], [data-parts-results-count]');
        const count = Number(isParts ? countNode?.dataset.partsResultsCount : countNode?.dataset.tireResultsCount);
        if (!nextGrid?.querySelector('#product-grid') || !countNode || !Number.isFinite(count)) {
          throw new Error('Incomplete collection response');
        }

        const oldProductGrid = grid.querySelector('.tp-grid.product-grid');
        const viewClass = oldProductGrid?.className;
        const activeView = grid.querySelector('.action-col-prd.active')?.dataset.view;
        // New custom elements read the URL while connecting (including price-range).
        if (updateHistory && query !== committedParams) {
          history.pushState({ searchParams: query }, '', url);
        } else if (updateHistory && scroll) {
          history.replaceState({ ...history.state, searchParams: query }, '', url);
        }
        committed = true;
        Facets.renderFilters(html, event?.target?.isConnected ? event : null);
        Facets.renderProductGridContainer(html);
        syncCheckboxes(parsed);
        if (viewClass && oldProductGrid && grid.querySelector('.tp-grid.product-grid')) {
          grid.querySelector('.tp-grid.product-grid').className = viewClass;
          if (activeView) grid.querySelectorAll('.action-col-prd').forEach(button => {
            button.classList.toggle('active', button.dataset.view === activeView);
          });
        }
        Facets.renderAsideShowContent();
        committedParams = query;
        committedHTML = html;
        notify('updated', { count });
        for (const initialize of [
          () => window.tpCountdownTimer?.init(),
          () => window.tpColorSwatchesShopify?.init(),
          () => window.initializeAnimationSummaries?.()
        ]) {
          try { initialize(); } catch (error) { console.debug('[Tire results] Product initializer:', error); }
        }
        if (scroll) {
          const heading = grid.querySelector('h2') || grid;
          heading.setAttribute('tabindex', '-1');
          heading.focus({ preventScroll: true });
          grid.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        }
      } catch (error) {
        if (requestId !== sequence) return;
        if (committed) {
          // Recover with the normal collection page if DOM rendering fails after committing.
          location.assign(url);
          return;
        }
        Facets.searchParamsPrev = committedParams;
        try { Facets.renderFilters(committedHTML, null); } catch (_) { /* Keep the existing catalog usable. */ }
        url.hash = 'ProductGridContainer';
        notify('error', { url: url.href });
        console.debug('[Tire results] Collection could not be updated:', error);
      } finally {
        clearTimeout(timeout);
        if (requestId === sequence) setBusy(false);
      }
    }

    // Native filters, sorting, active filter removal and popstate use this entry point.
    Facets.renderPage = (params, event, updateHistory = true) => render(params, event, updateHistory);

    finder.addEventListener(`${eventPrefix}search`, event => {
      const url = new URL(event.detail.url, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      event.preventDefault();
      render(url.search.slice(1), null, true, true);
    });

    if (isParts) finder.addEventListener('bikerz:ymm-search-start', () => {
      sequence += 1;
      controller?.abort();
      setBusy(false);
      if (catalogStatus) catalogStatus.replaceChildren();
    });

    // Keep duplicated desktop/mobile controls consistent before the native debounce runs.
    catalog.addEventListener('input', event => {
      const input = event.target;
      if (!input.matches('facet-filters-form input[type="checkbox"]')) return;
      for (const other of catalog.querySelectorAll('facet-filters-form input[type="checkbox"]')) {
        if (other.name === input.name && other.value === input.value) other.checked = input.checked;
      }
    }, true);

    catalog.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('.pagination a[href], .seo-results-filter-header a[href], .collection--empty a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      event.preventDefault();
      render(url.search.slice(1), null, true, true);
    });
  }

  function ready() {
    // Deferred scripts can run while readyState is interactive, before facets.js.
    customElements.whenDefined('facet-filters-form').then(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
