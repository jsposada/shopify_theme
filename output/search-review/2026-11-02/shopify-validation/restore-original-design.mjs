import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('./theme/', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const write = (path, text) => writeFile(new URL(path, root), text);
let original = await read('sections/predictive-search.liquid');
const queryStart = original.indexOf('    {%- assign shown_queries = 0 -%}');
const queryEnd = original.indexOf('    {%- if first_column_results_size > 0 or', queryStart);
assert.ok(queryStart > 0 && queryEnd > queryStart);
const queryMarkup = original.slice(queryStart, queryEnd);
await write('sections/search-query-suggestions.liquid', `{%- if predictive_search.performed -%}\n<div data-search-query-suggestions-response data-query="{{ predictive_search.terms | escape }}">\n${queryMarkup}</div>\n{%- endif -%}\n{% schema %}{"name":"Search query suggestions","settings":[]}{% endschema %}\n`);
original = original.slice(0, queryStart) + '    <div data-search-query-suggestions></div>\n' + original.slice(queryEnd);
original = original.replace(/\{% assign first_column_results_size =[\s\S]*?%\}/, '{% assign first_column_results_size = 0 %}');
original = original.replace(/predictive_search\.resources\.products/g, 'search.results').replace(/predictive_search\.terms/g, 'search.terms').replace(/predictive_search\.performed/g, 'search.performed');
original = original.replace(/predictive_search\.resources\.(queries|collections|pages|articles)\.size/g, '0');
const metadataStart = original.indexOf('    {% if settings.search_analytics_enabled %}');
const metadataEnd = original.indexOf('  >', metadataStart);
assert.ok(metadataStart > 0 && metadataEnd > metadataStart);
original = original.slice(0, metadataStart) + `    class="search-preview-v2"
    data-search-preview-metadata
    data-query="{{ search.terms | escape }}"
    data-search-filters="{{ active_filters | strip_newlines | escape }}"
    data-products-returned="{{ search.results.size }}"
    data-search-total="{{ search.results_count }}"
` + original.slice(metadataEnd);
original = original.replace(/data-search-product-id="\{\{ product.id \}\}"/g, `data-search-product-id="{{ product.id }}" data-variant-id="{{ product.selected_or_first_available_variant.id }}" data-price="{{ product.selected_or_first_available_variant.price }}" data-compare-price="{{ product.selected_or_first_available_variant.compare_at_price | default: 0 }}" data-available="{{ product.selected_or_first_available_variant.available }}"`);
original = original.replace('class="predictive-search__empty-title"', 'class="predictive-search__empty-title" data-search-empty');
const filters = `{%- capture active_filters -%}[
  {%- assign pair_count = 0 -%}
  {%- for filter in search.filters -%}
    {%- for value in filter.active_values -%}
      {% if pair_count > 0 %},{% endif %}{"name":{{ filter.param_name | json }},"value":{{ value.value | json }}}
      {%- assign pair_count = pair_count | plus: 1 -%}
    {%- endfor -%}
  {%- endfor -%}
]{%- endcapture -%}
`;
await write('sections/search-preview.liquid', filters + '{%- paginate search.results by 5 -%}\n' + original + '\n{%- endpaginate -%}\n{% schema %}{"name":"Search preview","settings":[]}{% endschema %}\n');
// All existing card, button, suggestion and mobile styles remain authoritative.
await write('assets/search-preview.css', '.search-preview-message { max-width: 740px; margin: 8px auto; padding: 16px; color: #1c1c1c; }\n');
let normalizer = await read('assets/search-normalize.js');
normalizer = normalizer.replace("    if (window.bikerzSearchV2) return;\n    const form = event.target;", "    const form = event.target;");
normalizer = normalizer.replace('    const { submitQuery } = normalize(input.value);\n    if (submitQuery && submitQuery !== input.value) input.value = submitQuery;', '    if (!window.bikerzSearchV2) {\n      const { submitQuery } = normalize(input.value);\n      if (submitQuery && submitQuery !== input.value) input.value = submitQuery;\n    }');
await write('assets/search-normalize.js', normalizer);
let config = await read('snippets/search-catalog-config.liquid');
config = config.replace('"tireLabel":{{ \'templates.search.empty_tire\' | t | json }}', '"tireLabel":{{ \'templates.search.tire_finder_for\' | t: size: \'__SIZE__\' | json }}');
await write('snippets/search-catalog-config.liquid', config);
console.log('Original desktop cards, mobile rows, actions and suggestion markup restored in development copy.');
