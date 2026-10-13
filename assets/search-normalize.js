/*
  Search query normalization for bikerz.cl.

  Customers type tire sizes and oil viscosities in many ways, while product
  titles use one or two spellings. Before a query reaches Shopify we rewrite:
    - metric tire sizes:   140-60r, 140x60x17, 140 60 17, 140/60zr17 -> 140/60(-17)
    - inch tire sizes:     2,50-17, 250-17                          -> 2.50-17
    - oil viscosities:     10w40, 10w-40, 10w 40                    -> (10W40 OR 10W-40)
                           in suggestions, 10W-40 on full searches
  Everything else is left untouched. Exposed as window.bikerzSearch.
*/
(() => {
  if (window.bikerzSearch) return;

  // A query this script already rewrote; collapsed first so normalizing twice is a no-op.
  const OIL_GROUP = /\((\d{1,2})W(\d{2}) OR \1W-\2\)/gi;
  // Oil viscosity: one or two digits, "w", two digits. Titles mix 10W-40 and 10W40.
  const OIL = /(^|[^\w])(\d{1,2})\s*w\s*-?\s*(\d{2})(?!\w)/gi;
  // Inch sizes have two parts (width-rim): 2.50-17, 2,50-17, 250-17, 2.75-18.
  const INCH = /(^|[^\d.,/-])([2-4])(?:[.,](\d{1,2})|(\d{2}))\s*[-/ ]\s*(1\d|2[0-3])(?![\d.,/-])/g;
  // Metric sizes have width/profile and an optional rim: 140/60, 140/60-17, 140x60x17.
  const METRIC = /(^|[^\d.,/-])([5-9]\d|[1-3]\d{2})\s*[-/x× ]\s*(\d{2,3})(?:\s*z?r?\s*[-/x× ]?\s*(1\d|2[0-3]))?\s*(?:z?r)?(?![\w/.,-])/gi;

  const tidy = (value) => String(value || '').replace(/\s+/g, ' ').trim();

  function normalize(raw) {
    const original = tidy(raw).replace(OIL_GROUP, '$1W-$2');
    let query = original;
    let display = original;
    let tire = null;

    query = query.replace(OIL, (match, before, cold, hot) => `${before}(${cold}W${hot} OR ${cold}W-${hot})`);
    display = display.replace(OIL, (match, before, cold, hot) => `${before}${cold}W-${hot}`);

    const inch = (match, before, whole, decimals, twoDigits, rim) => {
      const fraction = (decimals || twoDigits || '0').padEnd(2, '0');
      if (!tire) tire = { width: Number(`${whole}.${fraction}`), profile: null, rim };
      return `${before}${whole}.${fraction}-${rim}`;
    };
    query = query.replace(INCH, inch);
    display = display.replace(INCH, inch);

    const metric = (match, before, width, profile, rim) => {
      if (!tire) tire = { width: Number(width), profile, rim: rim || null };
      return `${before}${width}/${profile}${rim ? `-${rim}` : ''}`;
    };
    query = query.replace(METRIC, metric);
    display = display.replace(METRIC, metric);

    query = tidy(query);
    display = tidy(display);
    // Full search pages treat OR loosely (hundreds of unrelated hits), so submits use
    // the catalogue's main spelling (10W-40); OR stays for predictive suggestions only.
    const submitQuery = query.replace(OIL_GROUP, '$1W-$2');
    return { original, query, submitQuery, display, tire, changed: display.toLowerCase() !== original.toLowerCase() };
  }

  // Filter values used by the tire landing: width keeps one decimal (2.5, 3.0, 140.0).
  function tireUrl(tire, base) {
    const params = new URLSearchParams();
    const width = Number.isInteger(tire.width) ? tire.width.toFixed(1) : String(tire.width);
    params.set('filter.p.m.custom.ancho', width);
    if (tire.profile) params.set('filter.p.m.custom.aspecto', String(Number(tire.profile)));
    if (tire.rim) params.set('filter.p.m.custom.di_metro', String(Number(tire.rim)));
    return `${base || '/collections/neumaticos'}?${params.toString()}`;
  }

  function sizeLabel(tire) {
    if (tire.profile) return `${tire.width}/${tire.profile}${tire.rim ? `-${tire.rim}` : ''}`;
    return `${tire.width.toFixed(2)}-${tire.rim}`;
  }

  window.bikerzSearch = { normalize, tireUrl, sizeLabel };

  // Full searches: rewrite the query of any storefront search form just before it submits.
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !/\/search\/?$/.test(new URL(form.action, location.href).pathname)) return;
    const input = form.querySelector('input[name="q"]');
    if (!input) return;
    const { submitQuery } = normalize(input.value);
    if (submitQuery && submitQuery !== input.value) input.value = submitQuery;
  }, true);

  // Predictive results: explain the rewrite and offer the tire finder for sizes.
  function enhance(container) {
    if (container.querySelector('[data-search-assist]')) return;
    const root = container.closest('predictive-search');
    const input = root && root.querySelector('input[name="q"]');
    if (!input || !input.value.trim()) return;
    const result = normalize(input.value);

    const viewAll = container.querySelector('.predictive-search__view-all');
    if (viewAll && result.changed) {
      const note = document.createElement('p');
      note.className = 'predictive-search__normalized';
      note.dataset.searchAssist = '';
      const term = document.createElement('strong');
      term.textContent = result.display;
      note.append(`${viewAll.dataset.labelNormalized || 'Mostrando resultados para'} `, term);
      viewAll.before(note);
    }

    if (!result.tire) return;
    const href = tireUrl(result.tire, viewAll && viewAll.dataset.tireBase);
    if (viewAll) {
      const link = document.createElement('a');
      link.className = 'predictive-search__assist-link';
      link.dataset.searchAssist = '';
      link.href = href;
      const text = document.createElement('span');
      text.className = 'predictive-search__view-all-text';
      text.textContent = (viewAll.dataset.labelTire || 'Neumáticos __SIZE__ en el buscador de medidas').replace('__SIZE__', sizeLabel(result.tire));
      const arrow = viewAll.querySelector('svg:last-of-type');
      link.append(text);
      if (arrow) link.append(arrow.cloneNode(true));
      viewAll.after(link);
    }
    const emptyLink = container.querySelector('[data-search-tire-link]');
    if (emptyLink) {
      emptyLink.href = href;
      emptyLink.dataset.searchAssist = '';
    }
  }

  function watch() {
    document.querySelectorAll('[data-predictive-search]').forEach((container) => {
      new MutationObserver(() => enhance(container)).observe(container, { childList: true });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch, { once: true });
  else watch();
})();
