/* Optional production-only observations. Reuses the existing tag; no tag/config,
   cookies, storage, cart requests, QA sender, ecommerce or purchase events. */
(() => {
  if (window.BikerzMvpMeasurement) return;
  window.BikerzMvpMeasurement = Object.freeze({version:1});
  const selector = '[data-recommendation-surface]';
  const roots = new Map(), seen = new Set();
  const id = value => typeof value === 'string' && /^[1-9]\d{0,23}$/.test(value);
  function environment(root) {
    return root.dataset.ga4Mode === 'live' && root.dataset.recommendationMode === 'staged' &&
      String(window.Shopify?.theme?.id) === '189814309085' && window.Shopify?.theme?.role === 'main' &&
      window.Shopify?.designMode !== true &&
      !new URLSearchParams(window.location.search).has('preview_theme_id');
  }
  function ready(root) {
    try { return environment(root) && window.Shopify?.customerPrivacy?.analyticsProcessingAllowed() === true &&
      typeof window.gtag === 'function'; } catch { return false; }
  }
  function emit(root,card,action,extra={}) {
    if (!ready(root)) return false;
    const surface = root.dataset.recommendationSurface;
    const alternative = surface === 'alternative';
    const kind = alternative ? 'alternative' : card.dataset.kind;
    const cards = [...root.querySelectorAll('.bikerz-mvp-card')];
    const position = cards.indexOf(card) + 1;
    if (!['alternative','complementary'].includes(surface) || !['viewed','clicked','added'].includes(action) ||
        !id(root.dataset.sourceProductId) || !id(card.dataset.productId) ||
        root.dataset.sourceProductId === card.dataset.productId || root.dataset.currency !== 'CLP' ||
        (!alternative && !['tire','helmet'].includes(kind)) || position < 1 || position > (alternative ? 4 : 5) ||
        (action === 'clicked' && !alternative) || (action === 'added' && alternative)) return false;
    const params = {send_to:'G-PSM69XC45C',schema_version:1,pilot:'tires-20-v1',
      source_product_id:root.dataset.sourceProductId,recommended_product_id:card.dataset.productId,
      recommendation_surface:surface,recommendation_kind:kind,recommendation_position:position,currency:'CLP'};
    if (action === 'added') {
      if (!id(extra.variant_id)) return false;
      params.recommended_variant_id = extra.variant_id;
      params.quantity = 1;
      if (Number.isSafeInteger(extra.unit_price_cents) && extra.unit_price_cents > 0) {
        params.recommended_unit_price_cents = extra.unit_price_cents;
      }
    }
    const key = [root.dataset.sourceProductId,surface,card.dataset.productId,action].join(':');
    if (seen.has(key)) return false;
    // Mark before dispatch. A thrown tag call has an uncertain outcome: never retry.
    seen.add(key);
    try {
      window.gtag('event','bikerz_recommendation_' + action,params);
      root.dataset.measurementStatus = 'dispatched_not_receipt_verified';
      return true;
    } catch { root.dataset.measurementStatus = 'uncertain_not_retried'; return false; }
  }
  function attach(root) {
    if (roots.has(root) || !environment(root)) return;
    const cards = [...root.querySelectorAll('.bikerz-mvp-card')];
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      if (document.visibilityState !== 'visible') return;
      for (const entry of entries) if (entry.isIntersecting && entry.intersectionRatio >= 0.5 &&
          emit(root,entry.target,'viewed')) observer.unobserve(entry.target);
    },{threshold:[0.5]}) : null;
    const click = event => {
      const link = event.target.closest('[data-alternative-link]');
      const card = link?.closest('.bikerz-mvp-card');
      if (card && root.contains(card) && !event.defaultPrevented &&
          (event.button === undefined || event.button === 0)) emit(root,card,'clicked');
    };
    const added = event => {
      if (event.target !== root || root.dataset.recommendationSurface !== 'complementary') return;
      for (const item of (Array.isArray(event.detail?.items) ? event.detail.items.slice(0,2) : [])) {
        const card = cards.find(candidate => candidate.dataset.productId === String(item.product_id));
        if (!card?.querySelector('[data-include]')?.checked) continue;
        const size = card.querySelector('[data-size]');
        const variant = size ? size.value : card.dataset.variantId;
        if (String(variant) === item.variant_id) emit(root,card,'added',item);
      }
    };
    root.addEventListener('click',click);
    root.addEventListener('bikerz:mvp:cart-added',added);
    roots.set(root,{observer,cards,click,added});
    cards.forEach(card => observer?.observe(card));
  }
  function scan(scope=document) {
    if (scope.matches?.(selector)) attach(scope);
    scope.querySelectorAll(selector).forEach(attach);
  }
  function refreshViews() {
    for (const {observer,cards} of roots.values()) cards.forEach(card => {
      observer?.unobserve(card);observer?.observe(card);
    });
  }
  function start() {
    scan();
    if (roots.size && !window.Shopify?.customerPrivacy) {
      try { window.Shopify?.loadFeatures?.([{name:'consent-tracking-api',version:'0.2'}],error => {
        if (!error) refreshViews();
      }); } catch { /* Missing API always fails closed. Never set consent. */ }
    }
  }
  document.addEventListener('visitorConsentCollected',refreshViews);
  document.addEventListener('visibilitychange',refreshViews);
  document.addEventListener('shopify:section:load',event => scan(event.target));
  document.addEventListener('shopify:section:unload',event => {
    for (const [root,state] of roots) if (event.target.contains(root)) {
      state.observer?.disconnect();
      root.removeEventListener('click',state.click);
      root.removeEventListener('bikerz:mvp:cart-added',state.added);
      roots.delete(root);
    }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
