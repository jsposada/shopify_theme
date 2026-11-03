import { mkdir, writeFile } from 'node:fs/promises';

// Bounded read-only benchmark. Compressed bytes exclude HTTP/TLS overhead.
const directory = new URL('./performance/', import.meta.url);
await mkdir(directory, { recursive: true });
const section = 'template--28186840760541__main';
const cases = [
  { name: 'exact_tire', raw: '90/100-10', filters: { 'filter.p.m.custom.ancho': '90.0', 'filter.p.m.custom.aspecto': '100', 'filter.p.m.custom.di_metro': '10' } },
  { name: 'common_tire', raw: '120/70-17', filters: { 'filter.p.m.custom.ancho': '120.0', 'filter.p.m.custom.aspecto': '70', 'filter.p.m.custom.di_metro': '17' } },
  { name: 'partial_tire', raw: '90/100', filters: { 'filter.p.m.custom.ancho': '90.0', 'filter.p.m.custom.aspecto': '100' } },
  { name: 'oil_brand', raw: 'motul 10W-40', predictive: 'motul (10W40 OR 10W-40)', filters: { 'filter.v.t.shopify.viscosity': 'gid://shopify/TaxonomyValue/16685', 'filter.p.m.custom.marca': 'MOTUL' } },
  { name: 'free_text', raw: 'casco integral', filters: {} },
  { name: 'model', raw: 'honda cb 190', filters: {} },
];
const modes = ['current_predictive', 'normal_section', 'filtered_section'];
const rows = [];

async function get(url) {
  const started = performance.now();
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const headerMs = performance.now() - started;
  const html = await response.text();
  return { html, status: response.status, headerMs: Math.round(headerMs), totalMs: Math.round(performance.now() - started),
    compressedBytes: response.headers.has('content-length') ? Number(response.headers.get('content-length')) : null,
    htmlBytes: Buffer.byteLength(html), encoding: response.headers.get('content-encoding') || 'identity',
    cache: response.headers.get('cf-cache-status'), retryAfter: response.headers.get('retry-after') };
}

try {
  for (let round = -1; round < 4; round++) {
    // Rotate modes to reduce systematic ordering effects.
    for (const item of cases) {
      const rotation = ((round + 1) + cases.indexOf(item)) % modes.length;
      const order = [...modes.slice(rotation), ...modes.slice(0, rotation)];
      for (const mode of order) {
        const url = new URL(mode === 'current_predictive' ? '/search/suggest' : '/search', 'https://www.bikerz.cl');
        url.searchParams.set('q', mode === 'current_predictive' ? item.predictive || item.raw : item.raw);
        url.searchParams.set('section_id', mode === 'current_predictive' ? 'predictive-search' : section);
        if (mode !== 'current_predictive') {
          url.searchParams.set('type', 'product');
          url.searchParams.set('options[prefix]', 'last');
        }
        if (mode === 'filtered_section') for (const [key, value] of Object.entries(item.filters)) url.searchParams.set(key, value);
        try {
          const { html, ...metrics } = await get(url);
          if (metrics.status === 429) throw new Error(`Rate limit; retry-after=${metrics.retryAfter || 'unspecified'}`);
          if (metrics.status !== 200) throw new Error(`HTTP ${metrics.status}`);
          rows.push({ round, case: item.name, mode, url: url.href, ...metrics,
            productCards: [...html.matchAll(/class="bikerz-product-card__image-link"/g)].length,
            previewRows: [...html.matchAll(/class="predictive-search__compact-link"/g)].length,
            inputElements: [...html.matchAll(/<input\b/g)].length });
          if (round === 0) await writeFile(new URL(`${item.name}-${mode}.html`, directory), html);
        } catch (error) {
          rows.push({ round, case: item.name, mode, error: error.message });
          if (error.message.startsWith('Rate limit')) throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    console.log(`Completed ${round < 0 ? 'connection warmup' : `measurement round ${round + 1}/4`}`);
  }
} catch (error) { console.log(`Stopped benchmark: ${error.message}`); }

const percentile = (values, p) => [...values].sort((a, b) => a - b)[Math.ceil(values.length * p) - 1];
const summarize = sample => ({ samples: sample.length, errors: sample.filter(r => r.error).length,
  medianMs: percentile(sample.filter(r => !r.error).map(r => r.totalMs), 0.5),
  p90Ms: percentile(sample.filter(r => !r.error).map(r => r.totalMs), 0.9),
  medianCompressedKB: Math.round(percentile(sample.filter(r => !r.error && r.compressedBytes !== null).map(r => r.compressedBytes / 1024), 0.5) * 10) / 10,
  medianHtmlKB: Math.round(percentile(sample.filter(r => !r.error).map(r => r.htmlBytes / 1024), 0.5) * 10) / 10 });
const measured = rows.filter(r => r.round >= 0);
const report = { capturedAt: new Date().toISOString(), methodology: { rounds: 4, warmupRounds: 1, concurrentRequests: 1,
  compression: 'fetch negotiation; content-length reports compressed body', connection: 'Node fetch connection pool; canonical hostname; first warmup excluded', inputDebounceMs: 300,
  limitation: 'Existing normal-results section is a heavy proxy, not the proposed compact preview. No production traffic data or real mobile connection.' },
  overall: Object.fromEntries(modes.map(mode => [mode, summarize(measured.filter(r => r.mode === mode))])),
  byCase: Object.fromEntries(cases.map(item => [item.name, Object.fromEntries(modes.map(mode => [mode, summarize(measured.filter(r => r.case === item.name && r.mode === mode))]))])), rows };
await writeFile(new URL('endpoint-benchmark.json', directory), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ overall: report.overall, byCase: report.byCase }, null, 2));
