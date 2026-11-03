/* Research-only controller for local browser tests. Not a storefront asset. */
(() => {
  const cache = new Map();
  customElements.whenDefined('predictive-search').then(() => {
    const prototype = customElements.get('predictive-search').prototype;
    const stateFor = element => element.researchState ||= { revision: 0, composing: false, controller: null };
    const invalidate = element => {
      const state = stateFor(element); state.revision++; state.controller?.abort();
      element.close(false); element.predictiveSearchResults.replaceChildren();
      element.input.removeAttribute('aria-activedescendant'); element.removeAttribute('loading');
    };
    document.querySelectorAll('predictive-search').forEach(element => {
      element.input.addEventListener('input', () => invalidate(element));
      element.input.addEventListener('compositionstart', () => { stateFor(element).composing = true; invalidate(element); });
      element.input.addEventListener('compositionend', () => { stateFor(element).composing = false; });
      element.input.form.addEventListener('reset', () => invalidate(element));
      element.input.form.addEventListener('submit', () => {
        const plan = window.researchPlan(element.getQuery());
        element.input.form.querySelectorAll('[data-research-filter]').forEach(node => node.remove());
        if (['ambiguous', 'unsupported'].includes(plan.mode)) return;
        const params = new URLSearchParams(plan.params);
        params.delete('q');
        for (const [key, value] of params) {
          const input = document.createElement('input'); input.type = 'hidden'; input.name = key; input.value = value; input.dataset.researchFilter = '';
          element.input.form.append(input);
        }
        // Keep the visible text. A q override uses formdata without waiting for preview.
        element.input.form.addEventListener('formdata', event => event.formData.set('q', plan.query), { once: true });
      }, true);
    });
    prototype.getSearchResults = async function (raw) {
      const state = stateFor(this);
      if (state.composing) return;
      const revision = state.revision;
      const plan = window.researchPlan(raw);
      if (['empty', 'ambiguous', 'unsupported'].includes(plan.mode)) {
        this.predictiveSearchResults.textContent = plan.mode === 'empty' ? '' : 'La consulta necesita más precisión.';
        return;
      }
      state.controller?.abort();
      const controller = new AbortController(); state.controller = controller;
      this.setLiveRegionLoadingState(); this.predictiveSearchResults.setAttribute('aria-busy', 'true');
      const timeout = setTimeout(() => controller.abort('timeout'), window.researchTimeout || 2000);
      try {
        let html = cache.get(plan.key);
        if (!html) {
          const url = new URL('/search', location.origin); url.search = plan.params; url.searchParams.set('section_id', 'research-compact');
          const response = await fetch(url, { signal: controller.signal, headers: { 'X-Research-Plan': plan.key } });
          if (!response.ok) throw new Error('http_error');
          const document = new DOMParser().parseFromString(await response.text(), 'text/html');
          const section = document.querySelector('#shopify-section-research-compact');
          if (!section || section.dataset.planKey !== plan.key || section.querySelector('script,form')) throw new Error('invalid_response');
          html = section.innerHTML;
          cache.set(plan.key, html); if (cache.size > 50) cache.delete(cache.keys().next().value);
        }
        if (controller.signal.aborted || state.revision !== revision || this.getQuery() !== raw || !this.contains(document.activeElement)) return;
        this.renderSearchResults(html);
        this.statusElement.textContent = this.predictiveSearchResults.querySelector('[data-predictive-search-live-region-count-value]')?.textContent || '';
        this.dataset.researchStatus = 'success';
      } catch (error) {
        if (state.revision !== revision || state.controller !== controller) return;
        if (controller.signal.aborted && controller.signal.reason !== 'timeout') return;
        this.close(false); this.predictiveSearchResults.textContent = 'No pudimos cargar los resultados. Puedes buscar con Enter.';
        this.dataset.researchStatus = controller.signal.reason === 'timeout' ? 'timeout' : error.message;
      } finally {
        clearTimeout(timeout);
        if (state.controller === controller) { this.removeAttribute('loading'); this.predictiveSearchResults.setAttribute('aria-busy', 'false'); }
      }
    };
    window.researchReady = true;
  });
})();
