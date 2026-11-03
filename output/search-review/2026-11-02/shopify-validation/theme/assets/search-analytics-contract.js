/* Shared by the theme, offline tests and the app-pixel adapter. No browser APIs. */
(function (root, factory) {
  const contract = factory();
  if (typeof module === 'object' && module.exports) module.exports = contract;
  else root.BikerzSearchContract = contract;
})(typeof self !== 'undefined' ? self : this, function () {
  const EVENTS = ['bikerz:search_preview_viewed', 'bikerz:search_submit', 'bikerz:search_results_viewed', 'bikerz:search_preview_error'];
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const PERSONAL = /@|https?:\/\/|www\.|\b(?:correo|email|tel[eé]fono|direcci[oó]n|mi nombre|me llamo)\b|\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b|\b\d{7,8}-[\dkK]\b/i;
  const KEYS = [
    'schema_version', 'search_id', 'query_revision', 'request_id', 'preview_request_id', 'surface',
    'query_text', 'predictive_query', 'submitted_query', 'text_redacted', 'context_redacted',
    'normalization_version', 'theme_version', 'language', 'country', 'submission_method',
    'correlation_status', 'status', 'product_ids', 'products_returned', 'products_shown',
    'suggestions_shown', 'result_count', 'result_scope', 'resource_types', 'page', 'page_size',
    'display_limit', 'duration_ms', 'source', 'error_code', 'http_status', 'search_options',
  ];
  const ENUMS = {
    surface: ['header', 'results', 'general'],
    submission_method: ['enter', 'button', 'suggestion', 'link', 'unknown'],
    correlation_status: ['interaction', 'matched', 'unmatched', 'changed_query', 'missing_preview'],
    status: ['success', 'no_products', 'error'],
    result_scope: ['product', 'mixed', 'unknown'],
    source: ['network', 'cache', 'page'],
    error_code: ['http_error', 'network_error', 'invalid_response', 'stale_response', 'render_error'],
  };
  const NUMBERS = ['products_returned', 'products_shown', 'suggestions_shown', 'result_count', 'page', 'page_size', 'display_limit', 'duration_ms', 'http_status'];

  function safeText(value, limit = 200) {
    if (typeof value !== 'string') return null;
    const text = value.replace(/\s+/g, ' ').trim();
    const phone = [...text.matchAll(/\+?\d[\d ().-]{7,}\d/g)].some((match) => match[0].replace(/\D/g, '').length >= 9);
    if (!text || text.length > limit || /[\u0000-\u001f\u007f<>]/.test(value) || PERSONAL.test(text) || phone) return null;
    return text;
  }

  function queries(raw, predictive, submitted) {
    const originals = [raw, predictive, submitted];
    const clean = originals.map((v) => v == null ? null : safeText(v));
    const redacted = originals.some((v, i) => v != null && String(v).trim() !== '' && clean[i] === null);
    return {
      query_text: redacted ? null : clean[0], predictive_query: redacted ? null : clean[1],
      submitted_query: redacted ? null : clean[2], text_redacted: redacted,
    };
  }

  function options(entries) {
    const result = [];
    let redacted = false;
    for (const [name, value] of entries) {
      if (!/^(?:type|sort_by|options\[(?:prefix|unavailable_products)\]|filter\.[a-zA-Z0-9_.-]{1,90})$/.test(name)) continue;
      const clean = safeText(value);
      if (clean === null || result.length >= 20) { redacted = true; continue; }
      result.push({ name, value: clean });
    }
    result.sort((a, b) => a.name.localeCompare(b.name) || a.value.localeCompare(b.value));
    return { search_options: result, context_redacted: redacted };
  }

  function project(eventName, input) {
    if (!EVENTS.includes(eventName) || !input || typeof input !== 'object' || Array.isArray(input)) return null;
    if (Object.keys(input).length !== KEYS.length || Object.keys(input).some((key) => !KEYS.includes(key))) return null;
    if (input.schema_version !== 1 || !UUID.test(input.search_id) || !Number.isSafeInteger(input.query_revision) || input.query_revision < 1) return null;
    if (typeof input.text_redacted !== 'boolean' || typeof input.context_redacted !== 'boolean') return null;
    for (const key of ['request_id', 'preview_request_id']) if (input[key] != null && !UUID.test(input[key])) return null;
    for (const [key, allowed] of Object.entries(ENUMS)) if (input[key] != null && !allowed.includes(input[key])) return null;
    for (const key of NUMBERS) if (input[key] != null && (!Number.isSafeInteger(input[key]) || input[key] < 0 || input[key] > 1e9)) return null;
    if (input.page != null && input.page < 1) return null;
    for (const key of ['query_text', 'predictive_query', 'submitted_query']) {
      if (input[key] != null && (input.text_redacted || safeText(input[key]) !== input[key])) return null;
    }
    for (const key of ['normalization_version', 'theme_version', 'language', 'country']) {
      if (typeof input[key] !== 'string' || !/^[a-zA-Z0-9_.-]{1,64}$/.test(input[key])) return null;
    }
    if (!Array.isArray(input.product_ids) || input.product_ids.length > 24 || input.product_ids.some((id) => typeof id !== 'string' || !/^[1-9]\d{0,23}$/.test(id))) return null;
    if (new Set(input.product_ids).size !== input.product_ids.length) return null;
    if (!Array.isArray(input.resource_types) || input.resource_types.some((type) => !['product', 'query', 'page', 'article', 'collection', 'store_settings'].includes(type))) return null;
    if (!Array.isArray(input.search_options) || input.search_options.length > 20) return null;
    for (const entry of input.search_options) {
      if (!entry || Object.keys(entry).sort().join(',') !== 'name,value') return null;
      const cleaned = options([[entry.name, entry.value]]);
      if (cleaned.context_redacted || cleaned.search_options.length !== 1 || cleaned.search_options[0].value !== entry.value) return null;
    }
    if (eventName === EVENTS[0] && (!UUID.test(input.request_id) || !['success', 'no_products'].includes(input.status) || input.products_returned == null || input.products_shown == null)) return null;
    if (eventName === EVENTS[2] && (input.result_count == null || input.page == null || input.page_size == null || input.source !== 'page')) return null;
    if (eventName === EVENTS[3] && (input.status !== 'error' || !ENUMS.error_code.includes(input.error_code))) return null;
    const result = {};
    for (const key of KEYS) if (Object.prototype.hasOwnProperty.call(input, key)) result[key] = input[key];
    // JSON clone prevents later mutation of arrays queued for delivery.
    return JSON.parse(JSON.stringify(result));
  }

  return { EVENTS, safeText, queries, options, project };
});
