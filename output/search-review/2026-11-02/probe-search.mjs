import { readFile, writeFile, mkdir } from 'node:fs/promises';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// Read-only comparison of public storefront endpoints. Does not modify Shopify.
const root = new URL('../../../', import.meta.url);
const context = {
  window: { addEventListener() {} },
  document: { addEventListener() {}, querySelectorAll() { return []; } },
  MutationObserver: class { observe() {} },
};
vm.createContext(context);
vm.runInContext(await readFile(new URL('assets/search-normalize.js', root), 'utf8'), context);
const normalize = context.window.bikerzSearch.normalize;
const queries = [
  '90/100-10', '90/100', '90/100-1', '120/70ZR17', '140/70-17',
  '100/90B19', '2,50-17', '3.00-10', 'ceat 90/100-10',
  '10w40', 'motul 10w40', '10w', 'casco integral', 'integral casco',
  'ngk cr8e', 'SR999', '428-120', 'honda cb 190',
];
const variants = ['current', 'product_only', 'grouped', 'whole_phrase', 'enter'];
const jobs = queries.flatMap(raw => variants.map(variant => ({ raw, variant })));
const results = [];
let cursor = 0;

async function probe({ raw, variant }) {
  const normalized = normalize(raw);
  const query = variant === 'grouped' ? `(${normalized.query})`
    : variant === 'whole_phrase' ? `"${normalized.submitQuery}"`
      : variant === 'enter' ? normalized.submitQuery : normalized.query;
  const url = new URL(variant === 'enter' ? '/search' : '/search/suggest.json', 'https://bikerz.cl');
  url.searchParams.set('q', query);
  if (variant === 'product_only') url.searchParams.set('resources[type]', 'product');
  if (variant === 'enter') url.searchParams.set('options[prefix]', 'last');
  const started = performance.now();
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (variant === 'enter') {
      const html = await response.text();
      const metadata = html.match(/data-search-results-metadata[\s\S]*?>/)?.[0] || '';
      const products = [...html.matchAll(/class="bikerz-product-card__image-link"\s+href="([^"]*)"\s+aria-label="([^"]*)"/g)]
        .map(match => ({ url: match[1], title: match[2].replace(/&amp;/g, '&').replace(/&quot;/g, '"') }));
      return { raw, variant, query, url: url.href, total: Number(metadata.match(/data-total="(\d+)"/)?.[1] ?? NaN),
        ids: metadata.match(/data-product-ids="([^"]*)"/)?.[1].split(',').filter(Boolean), products,
        ms: Math.round(performance.now() - started) };
    }
    const data = await response.json();
    const resources = data.resources?.results || {};
    return { raw, variant, query, url: url.href,
      products: (resources.products || []).map(({ id, title, available, url, variants }) => ({ id: String(id), title, available, url, variants })),
      suggestions: (resources.queries || []).map(({ text }) => text), ms: Math.round(performance.now() - started) };
  } catch (error) { return { raw, variant, query, url: url.href, error: error.message }; }
}

await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < jobs.length) {
    const job = jobs[cursor++];
    results.push(await probe(job));
  }
}));
results.sort((a, b) => queries.indexOf(a.raw) - queries.indexOf(b.raw) || variants.indexOf(a.variant) - variants.indexOf(b.variant));
const destination = new URL('./endpoint-comparison.json', import.meta.url);
await mkdir(new URL('./', destination), { recursive: true });
await writeFile(destination, JSON.stringify({ capturedAt: new Date().toISOString(), queries, results }, null, 2));
console.log(`Saved ${results.length} comparisons to ${fileURLToPath(destination)}`);
for (const raw of queries) {
  console.log(JSON.stringify({ raw, results: results.filter(row => row.raw === raw).map(row => ({
    variant: row.variant, count: row.total ?? row.products?.length, first: row.products?.slice(0, 3).map(p => p.title),
    suggestions: row.suggestions?.slice(0, 2), error: row.error,
  })) }));
}
