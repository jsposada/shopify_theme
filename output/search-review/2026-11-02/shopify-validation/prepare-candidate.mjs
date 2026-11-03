import { readFile, writeFile, copyFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const base = new URL('./theme/', import.meta.url), backups = new URL('./baseline/', import.meta.url);
const modified = ['snippets/scripts-tag.liquid', 'assets/search-normalize.js', 'assets/search-analytics.js', 'snippets/search-display-term.liquid', 'snippets/search-results-metadata.liquid', 'sections/main-search.liquid'];
const manifest = {};
for (const path of modified) {
  const backup = new URL(path, backups); await mkdir(new URL('./', backup), { recursive: true });
  try { await access(backup); } catch { await copyFile(new URL(path, base), backup); }
  manifest[path] = createHash('sha256').update(await readFile(backup)).digest('hex');
}
const source = path => readFile(new URL(path, backups), 'utf8');
const output = (path, text) => writeFile(new URL(path, base), text);
let policy = await readFile(new URL('../extended/query-policy-prototype.mjs', import.meta.url), 'utf8');
policy = policy.replace('// Isolated research prototype. Not loaded by the storefront.\n', '').replace('export function planSearch', 'function planSearch');
policy = policy.replace('research-1', 'search-v2-qa-1');
await output('assets/search-policy.js', `/* Catalog-aware query planning, QA candidate. */\n(() => {\n${policy}\nconst node = document.getElementById('bikerz-search-catalog');\nif (!node) return;\nlet config; try { config = JSON.parse(node.textContent); } catch { return; }\nconfig.brands = [...new Set(config.brands || [])];\nconst plan = raw => {\n  let result = planSearch(raw, config, config);\n  if (['ambiguous','unsupported'].includes(result.mode)) {\n    const params = new URLSearchParams({q: String(raw).trim(), type:'product', 'options[prefix]':'last'});\n    result = {...result, mode:'text', query:String(raw).trim(), params:params.toString(), key:JSON.stringify({params:params.toString(), language:config.language,country:config.country,currency:config.currency,theme:config.theme})};\n  }\n  return result;\n};\nwindow.bikerzSearchV2 = {config, plan, normalize(raw) { const p=plan(raw);return {original:String(raw).trim(),query:p.query,submitQuery:p.query,display:String(raw).trim(),tire:p.mode==='structured'?p.constraints.tire:null,changed:false}; }};\n})();\n`);
let scripts = await source('snippets/scripts-tag.liquid');
scripts = scripts.replace('{% if settings.search_analytics_enabled %}', `{% render 'search-catalog-config' %}\n<script src="{{ 'search-policy.js' | asset_url }}" defer="defer"></script>\n<script src="{{ 'search-preview.js' | asset_url }}" defer="defer"></script>\n{{ 'search-preview.css' | asset_url | stylesheet_tag }}\n{% if settings.search_analytics_enabled %}`);
await output('snippets/scripts-tag.liquid', scripts);
let normalize = await source('assets/search-normalize.js');
normalize = normalize.replace('    const { submitQuery } = normalize(input.value);\n    if (submitQuery && submitQuery !== input.value) input.value = submitQuery;', '    if (!window.bikerzSearchV2) {\n      const { submitQuery } = normalize(input.value);\n      if (submitQuery && submitQuery !== input.value) input.value = submitQuery;\n    }');
normalize = normalize.replace('function enhance(container) {', 'function enhance(container) {\n    if (window.bikerzSearchV2) return;');
await output('assets/search-normalize.js', normalize);
let analytics = await source('assets/search-analytics.js');
analytics = analytics.replace('const normalize = (raw) => window.bikerzSearch ?', 'const normalize = (raw) => window.bikerzSearchV2 ? window.bikerzSearchV2.normalize(raw) : window.bikerzSearch ?');
analytics = analytics.replace("normalization_version: '1', theme_version: 'search-analytics-1'", "normalization_version: window.bikerzSearchV2 ? '2' : '1', theme_version: window.bikerzSearchV2 ? 'search-v2-qa-1' : 'search-analytics-1'");
analytics = analytics.replace("resource_types: ['store_settings']", "resource_types: window.bikerzSearchV2 ? ['product'] : ['store_settings']");
analytics = analytics.replace("error_code: null, http_status: null, search_options: [],", "error_code: null, http_status: null, search_options: [],\n      ...(window.bikerzSearchV2 ? contract.options(new URLSearchParams(window.bikerzSearchV2.plan(raw).params).entries()) : {}),");
analytics = analytics.replace('page, page_size: 24,', 'page, page_size: number(metadata.dataset.pageSize) || 24,');
analytics = analytics.replace("  customElements.whenDefined('predictive-search').then(() => {", "  if (!window.bikerzSearchV2) customElements.whenDefined('predictive-search').then(() => {");
const marker = "  document.addEventListener('input', (event) => {";
if (!analytics.includes(marker)) throw new Error('Analytics input marker missing');
analytics = analytics.replace(marker, `  document.addEventListener('bikerz:search-preview-v2', event => {\n    const {element,raw,requestId,source,started}=event.detail;\n    const state=stateFor(element.input.form,raw);\n    observePreview(element,state,raw,requestId,source,started);\n  });\n  document.addEventListener('bikerz:search-preview-v2-error', event => {\n    const {element,raw,requestId,code,httpStatus}=event.detail;\n    previewError(element,stateFor(element.input.form,raw),raw,requestId,code,httpStatus);\n  });\n\n${marker}`);
await output('assets/search-analytics.js', analytics);
let metadata = await source('snippets/search-results-metadata.liquid');
metadata = metadata.replace('data-page="{{ search_paginate.current_page }}"', 'data-page="{{ search_paginate.current_page }}"\n  data-page-size="{{ search_paginate.page_size }}"');
await output('snippets/search-results-metadata.liquid', metadata);
let main = await source('sections/main-search.liquid');
if (!main.includes('{% paginate search.results by 24 %}')) throw new Error('Expected pagination marker missing');
main = main.replace('{% paginate search.results by 24 %}', '{% assign search_page_size = sst.products_per_page | default: 16 %}\n    {% paginate search.results by search_page_size %}');
await output('sections/main-search.liquid', main);
await output('snippets/search-display-term.liquid', `{%- liquid
  assign display_term = terms | default: ''
  if display_term == '*'
    assign width = ''
    assign profile = ''
    assign rim = ''
    assign viscosity = ''
    assign brand = ''
    for filter in search.filters
      if filter.active_values.size == 1
        assign active = filter.active_values.first
        case filter.param_name
          when 'filter.p.m.custom.ancho'
            assign width = active.label | plus: 0
          when 'filter.p.m.custom.aspecto'
            assign profile = active.label
          when 'filter.p.m.custom.di_metro'
            assign rim = active.label
          when 'filter.v.t.shopify.viscosity'
            assign viscosity = active.label
          when 'filter.p.m.custom.marca'
            assign brand = active.label
        endcase
      endif
    endfor
    assign display_term = ''
    if width != ''
      if width < 20
        assign inch_parts = width | append: '' | split: '.'
        assign inch_fraction = inch_parts[1] | default: '00'
        if inch_fraction.size == 1
          assign inch_fraction = inch_fraction | append: '0'
        endif
        assign width = inch_parts[0] | append: '.' | append: inch_fraction
      else
        assign width = width | round: 0
      endif
      assign display_term = width
      if profile != ''
        assign display_term = display_term | append: '/' | append: profile
      endif
      if rim != ''
        assign display_term = display_term | append: '-' | append: rim
      endif
    elsif viscosity != ''
      assign display_term = viscosity
    endif
    if brand != ''
      assign display_term = brand | append: ' ' | append: display_term
    endif
    if display_term == ''
      assign display_term = terms
    endif
  elsif display_term contains 'title:"'
    assign display_term = display_term | replace: 'title:"', '' | remove: '"'
  elsif display_term contains ' OR '
    assign display_parts = display_term | split: ' OR '
    assign display_before = display_parts[0] | split: '(' | first
    assign display_after = display_parts[1] | remove: ')'
    assign display_term = display_before | append: display_after
  endif
  echo display_term | strip
-%}\n`);
await writeFile(new URL('./baseline-hashes.json', import.meta.url), JSON.stringify(manifest, null, 2));
console.log('Candidate prepared in the isolated theme directory.');
