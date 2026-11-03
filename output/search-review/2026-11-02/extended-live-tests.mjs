import { mkdir, writeFile } from 'node:fs/promises';
const folder = new URL('./extended/', import.meta.url);
await mkdir(folder, { recursive: true });
const cases = [
  [80, 100, 21], [100, 80, 17], [110, 80, 19], [130, 80, 17],
  [150, 70, 17], [170, 60, 17], [180, 55, 17], [190, 55, 17],
  [2.75, null, 17], [3.5, null, 18], [90, 100, 10], [120, 70, 99],
];
const rows = [];
const pause = () => new Promise(resolve => setTimeout(resolve, 350));
async function request(label, query, filters = {}, page = 1) {
  const url = new URL('/search', 'https://www.bikerz.cl');
  for (const [key, value] of Object.entries({ q: query, type: 'product', page, ...filters })) url.searchParams.set(key, value);
  const started = performance.now();
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const html = await response.text();
  if (response.status === 429) throw new Error(`Rate limited; retry-after=${response.headers.get('retry-after')}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const metadata = html.match(/data-search-results-metadata[\s\S]*?>/)?.[0] || '';
  const products = [...html.matchAll(/class="bikerz-product-card__image-link"\s+href="([^"]*)"\s+aria-label="([^"]*)"/g)]
    .map(match => ({ title: match[2].replace(/&amp;/g, '&'), url: match[1], position: Number(match[1].match(/[?&]_pos=(\d+)/)?.[1] ?? NaN) }));
  const row = { label, url: url.href, total: Number(metadata.match(/data-total="(\d+)"/)?.[1] ?? NaN),
    displayLimit: Number(metadata.match(/data-display-limit="(\d+)"/)?.[1] ?? NaN),
    ids: metadata.match(/data-product-ids="([^"]*)"/)?.[1].split(',').filter(Boolean) || [], products,
    pageLinks: [...new Set([...html.matchAll(/[?&](?:amp;)?page=(\d+)/g)].map(match => Number(match[1])))],
    elapsedMs: Math.round(performance.now() - started) };
  rows.push(row); await pause(); return row;
}
let stopped;
try {
  for (const [width, profile, rim] of cases) {
    const label = profile === null ? `${width.toFixed(2)}-${rim}` : `${width}/${profile}-${rim}`;
    const filters = { 'filter.p.m.custom.ancho': Number.isInteger(width) ? width.toFixed(1) : String(width), 'filter.p.m.custom.di_metro': String(rim) };
    if (profile !== null) filters['filter.p.m.custom.aspecto'] = String(profile);
    const all = await request(`${label}:attributes`, '*', filters);
    const text = await request(`${label}:with-text`, label, filters);
    console.log(JSON.stringify({ label, attributes: all.total, withText: text.total, sameTotal: all.total === text.total }));
  }
  const filters = { 'filter.p.m.custom.ancho': '90.0', 'filter.p.m.custom.aspecto': '100', 'filter.p.m.custom.di_metro': '10,14,16,17,18,19' };
  await request('90/100-1:rim-prefix', '*', filters);
  const paginated = [];
  for (const page of [1, 2, 3]) paginated.push(await request(`pagination:${page}`, '*', {
    'filter.p.m.custom.ancho': '120.0', 'filter.p.m.custom.aspecto': '70', 'filter.p.m.custom.di_metro': '17',
  }, page));
  console.log(JSON.stringify({ pagination: paginated.map(({ total, ids, pageLinks, products }) => ({ total, rendered: ids.length, positions: products.map(p => p.position), pageLinks })), uniqueShown: new Set(paginated.flatMap(row => row.ids)).size }));
} catch (error) { stopped = error.message; console.log(`Stopped: ${stopped}`); }
await writeFile(new URL('live-catalog-tests.json', folder), JSON.stringify({ capturedAt: new Date().toISOString(), stopped, rows }, null, 2));
