/* Catalog-aware query planning, QA candidate. */
(() => {
function planSearch(value, catalog = {}, context = {}) {
  const raw = String(value ?? '');
  const cleaned = raw.trim().replace(/\s+/g, ' ');
  const constraints = {};
  const unsupported = [];
  const filters = {};
  let remaining = cleaned;
  let mode = 'text';
  let constructionClause = '';
  const finish = () => {
    const params = new URLSearchParams({ q: remaining || '*', type: 'product', 'options[prefix]': 'last' });
    for (const key of Object.keys(filters).sort()) {
      // Repeated parameters avoid Shopify treating an encoded comma as one numeric value.
      for (const item of String(filters[key]).split(',')) params.append(key, item);
    }
    const key = JSON.stringify({ version: 'search-v2-qa-1', params: params.toString(), language: context.language || 'es', country: context.country || 'CL', currency: context.currency || 'CLP' });
    return { raw, query: remaining || '*', mode, constraints, unsupported, params: params.toString(), key };
  };
  if (!cleaned) { mode = 'empty'; remaining = ''; return finish(); }
  // Respect user-authored query syntax; never reinterpret it as one inferred size.
  if (/[:"()]|\b(?:AND|OR|NOT)\b/.test(cleaned)) return finish();
  const metric = /(?<![\w.,/])(\d{2,3})\s*[/x×]\s*(\d{0,3})(?:\s*(ZR|R|B|-|x|×)\s*(\d{0,2}))?(?![\w.,/\-])/gi;
  const dimensions = [...cleaned.matchAll(metric)].filter(match => Number(match[1]) >= 50 && Number(match[1]) < 400);
  if (dimensions.length > 1) { mode = 'ambiguous'; unsupported.push('multiple_tire_sizes'); return finish(); }
  let size;
  if (dimensions.length === 1) {
    const match = dimensions[0];
    size = { width: Number(match[1]), profile: match[2], rim: match[4], profileComplete: match[3] !== undefined, construction: /^(ZR|R|B)$/i.test(match[3] || '') ? match[3].toUpperCase() : null };
    remaining = (cleaned.slice(0, match.index) + ' ' + cleaned.slice(match.index + match[0].length)).trim();
  } else {
    const inches = cleaned.match(/^(?:([2-4])[.,](\d{1,2})|([2-4])(\d{2}))\s*-\s*(\d{1,2})$/);
    const spaced = cleaned.match(/^(\d{2,3}) (\d{2,3}) (\d{1,2})$/);
    if (inches) { size = { width: Number(`${inches[1] || inches[3]}.${(inches[2] || inches[4]).padEnd(2, '0')}`), profile: null, rim: inches[5], profileComplete: true, construction: null }; remaining = ''; }
    else if (spaced && Number(spaced[1]) >= 50 && Number(spaced[1]) < 400 && Number(spaced[2]) >= 20 && Number(spaced[2]) <= 150) {
      size = { width: Number(spaced[1]), profile: spaced[2], rim: spaced[3], profileComplete: true, construction: null }; remaining = '';
    }
  }
  if (size) {
    mode = 'structured'; constraints.tire = size;
    filters['filter.p.m.custom.ancho'] = Number.isInteger(size.width) ? size.width.toFixed(1) : String(size.width);
    if (size.profile) {
      const profiles = size.profileComplete ? [] : (catalog.profiles || []).map(String).filter(profile => profile.startsWith(size.profile));
      filters['filter.p.m.custom.aspecto'] = (profiles.length ? profiles : [size.profile]).join(',');
    }
    if (size.rim) {
      const rims = (catalog.rims || []).map(String).filter(rim => rim.startsWith(size.rim));
      filters['filter.p.m.custom.di_metro'] = (rims.length ? rims : [size.rim]).join(',');
    }
    if (size.construction) {
      if (!size.rim || !(catalog.rims || []).map(String).includes(size.rim)) unsupported.push('incomplete_tire_construction');
      else constructionClause = `title:"${size.width}/${size.profile}${size.construction}${size.rim}"`;
    }
  }
  const oils = [...remaining.matchAll(/(?<!\w)(\d{1,2})\s*w\s*-?\s*(\d{2})(?!\w)/gi)];
  if (oils.length > 1 || (oils.length && size)) { mode = 'ambiguous'; unsupported.push('multiple_technical_constraints'); return finish(); }
  if (oils.length === 1) {
    const match = oils[0], viscosity = `${match[1]}W-${match[2]}`;
    constraints.viscosity = viscosity;
    if (catalog.viscosities?.[viscosity]) {
      filters['filter.v.t.shopify.viscosity'] = catalog.viscosities[viscosity];
      remaining = (remaining.slice(0, match.index) + ' ' + remaining.slice(match.index + match[0].length)).trim();
      mode = 'structured';
    } else unsupported.push('unknown_viscosity_mapping');
  }
  const brands = (catalog.brands || []).filter(brand => new RegExp(`(?:^|\\s)${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|\\s)`, 'i').test(remaining));
  if (brands.length === 1 && mode === 'structured') {
    constraints.brand = brands[0]; filters['filter.p.m.custom.marca'] = brands[0];
    remaining = remaining.replace(new RegExp(`(?:^|\\s)${brands[0]}(?=$|\\s)`, 'i'), ' ').trim();
  }
  if (brands.length > 1 && mode === 'structured') unsupported.push('multiple_brands');
  remaining = remaining.replace(/\s+/g, ' ').trim();
  if (constructionClause) remaining = [remaining, constructionClause].filter(Boolean).join(' ');
  if (unsupported.length) mode = 'unsupported';
  return finish();
}

const node = document.getElementById('bikerz-search-catalog');
if (!node) return;
let config; try { config = JSON.parse(node.textContent); } catch { return; }
config.brands = [...new Set(config.brands || [])];
const plan = raw => {
  let result = planSearch(raw, config, config);
  if (['ambiguous','unsupported'].includes(result.mode)) {
    const params = new URLSearchParams({q: String(raw).trim(), type:'product', 'options[prefix]':'last'});
    result = {...result, mode:'text', query:String(raw).trim(), params:params.toString(), key:JSON.stringify({params:params.toString(), language:config.language,country:config.country,currency:config.currency,theme:config.theme})};
  }
  return result;
};
window.bikerzSearchV2 = {config, plan, normalize(raw) { const p=plan(raw);return {original:String(raw).trim(),query:p.query,submitQuery:p.query,display:String(raw).trim(),tire:p.mode==='structured'?p.constraints.tire:null,changed:false}; }};
})();
