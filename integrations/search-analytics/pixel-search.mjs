// Adapter for the existing app extension. No credentials or browser dependencies.
// Its receiver must support search_data before this subscription is deployed.
import contract from '../../assets/search-analytics-contract.js';

export function toSearchRow(event, shopDomain) {
  const data = contract.project(event?.name, event?.customData);
  if (!data || typeof event.id !== 'string' || !/^[a-zA-Z0-9_.:-]{1,128}$/.test(event.id)) return null;
  if (typeof event.timestamp !== 'string' || !Number.isFinite(Date.parse(event.timestamp))) return null;
  if (typeof shopDomain !== 'string' || !/^[a-z0-9][a-z0-9.-]{0,251}[a-z0-9]$/.test(shopDomain)) return null;
  return {
    schema_version: 1, event_id: event.id, event_name: event.name,
    occurred_at: event.timestamp,
    sequence: Number.isSafeInteger(event.seq) && event.seq >= 0 ? event.seq : null,
    shop_domain: shopDomain, item_index: 0,
    page_type: event.name === 'bikerz:search_results_viewed' ? 'search' : null,
    page_path: event.name === 'bikerz:search_results_viewed' ? '/search' : null,
    product_id: null, variant_id: null, sku: null, quantity: null, currency: null, amount: null,
    search_data: data,
  };
}

// sendRows reuses the app's transport, endpoint and installation key. Keep the
// five standard-event subscriptions intact; add these four subscriptions.
export function subscribeSearchEvents(api, shopDomain, sendRows) {
  let consent = api.init.customerPrivacy.analyticsProcessingAllowed === true;
  api.customerPrivacy.subscribe('visitorConsentCollected', (event) => {
    consent = event.customerPrivacy.analyticsProcessingAllowed === true;
  });
  for (const name of contract.EVENTS) {
    api.analytics.subscribe(name, (event) => {
      if (!consent) return;
      const row = toSearchRow(event, shopDomain);
      if (!row) return;
      try { Promise.resolve(sendRows([row])).catch(() => {}); } catch (_) { /* No production payload logs. */ }
    });
  }
}
