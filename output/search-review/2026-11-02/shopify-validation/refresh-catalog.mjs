import { writeFile } from 'node:fs/promises';
// Regenerate the small dictionary from full collection facets at validation/deployment time.
// This keeps product lists and extra lookup requests out of the customer's typing path.
const catalog = { profiles: [], rims: [], viscosities: {}, brands: [] };
const evidence = [];
for (const handle of ['neumaticos','lubricantes']) {
  const response = await fetch(`http://127.0.0.1:9297/collections/${handle}`, {signal:AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error(`Collection ${handle}: ${response.status}`);
  const html = await response.text();
  const values = [];
  for (const match of html.matchAll(/<input\b[^>]*name="(filter\.(?:p\.m\.custom\.(?:aspecto|di_metro|marca)|v\.t\.shopify\.viscosity))"[^>]*>/g)) {
    const value = match[0].match(/value="([^"]*)"/)?.[1];
    if (!value) continue;
    const start = html.lastIndexOf('<li',match.index), end = html.indexOf('</li>',match.index);
    const text = html.slice(start,end).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
    const label = text.split(' (')[0];
    if (values.some(item => item.name === match[1] && item.value === value)) continue;
    values.push({name:match[1],value,label});
    if (match[1].endsWith('.aspecto')) catalog.profiles.push(value);
    if (match[1].endsWith('.di_metro')) catalog.rims.push(value);
    if (match[1].endsWith('.marca')) catalog.brands.push(value);
    if (match[1].endsWith('.viscosity')) catalog.viscosities[label.toUpperCase()] = value;
  }
  evidence.push({handle,values});
}
catalog.profiles = [...new Set(catalog.profiles)].sort((a,b)=>Number(a)-Number(b));
catalog.rims = [...new Set(catalog.rims)].sort((a,b)=>Number(a)-Number(b));
catalog.brands = [...new Set(catalog.brands)].sort();
if (!catalog.profiles.length || !catalog.rims.length || !catalog.viscosities['10W-40']) throw new Error('Catalog coverage checks failed');
const data = JSON.stringify(catalog).slice(1,-1).replace(/</g,'\\u003c');
const snippet = `{%- comment -%}Generated from catalog facets by refresh-catalog.mjs. Refresh before deployment.{%- endcomment -%}\n<script id="bikerz-search-catalog" type="application/json">\n{"version":"search-v2-qa-1","searchUrl":{{ routes.search_url | json }},"language":{{ request.locale.iso_code | json }},"country":{{ localization.country.iso_code | json }},"currency":{{ localization.country.currency.iso_code | json }},"theme":{{ theme.id | json }},"viewAllLabel":{{ 'templates.search.view_all_for' | t: terms: '__QUERY__' | json }},"tireUrl":{{ collections['neumaticos'].url | json }},"tireLabel":{{ 'templates.search.tire_finder_for' | t: size: '__SIZE__' | json }},${data}}\n</script>\n`;
await writeFile(new URL('./theme/snippets/search-catalog-config.liquid',import.meta.url),snippet);
await writeFile(new URL('./catalog-source.json',import.meta.url),JSON.stringify({capturedAt:new Date().toISOString(),catalog,evidence},null,2));
console.log(JSON.stringify({profiles:catalog.profiles,rims:catalog.rims,viscosities:catalog.viscosities,brands:catalog.brands.length,bytes:Buffer.byteLength(snippet)}));

