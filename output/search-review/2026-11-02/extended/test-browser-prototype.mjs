import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = new URL('../../../../', import.meta.url);
const escape = text => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const catalog = { profiles: [55, 60, 70, 80, 90, 100], rims: [10, 14, 16, 17, 18, 19, 21], brands: ['MOTUL', 'CEAT'], viscosities: { '10W-40': 'viscosity-10w40' } };
const products = [
  { id: '1', title: 'CEAT 90/100-10', width: '90.0', profile: '100', rim: '10', brand: 'CEAT' },
  { id: '2', title: 'DUNLOP 90/100-14', width: '90.0', profile: '100', rim: '14' },
  { id: '3', title: 'MICHELIN 90/100-16', width: '90.0', profile: '100', rim: '16' },
  { id: '4', title: 'MICHELIN 90/100-21', width: '90.0', profile: '100', rim: '21' },
  { id: '5', title: 'MOTUL 10W-40', brand: 'MOTUL', viscosity: 'viscosity-10w40' },
  { id: '6', title: 'MOTUL 10W-50', brand: 'MOTUL', viscosity: 'viscosity-10w50' },
  { id: '7', title: 'MICHELIN 120/70ZR17', width: '120.0', profile: '70', rim: '17' },
  { id: '8', title: 'CEAT 120/70R17', width: '120.0', profile: '70', rim: '17' },
  { id: '9', title: 'DUNLOP 120/70-17', width: '120.0', profile: '70', rim: '17' },
  ...Array.from({ length: 12 }, (_, i) => ({ id: String(100 + i), title: `CASCO INTEGRAL ${i}` })),
];
let browser, server, origin, realSearch;
const requests = [];
function fixture() {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>body{font:16px Arial;margin:16px}input{font-size:16px}li a{display:block;min-height:44px}li{list-style:none}ul{padding:0}[aria-selected=true]{outline:2px solid #333}[data-predictive-search]{display:block;max-width:100%;overflow-wrap:anywhere}</style>
    <script>window.researchCatalog=${JSON.stringify(catalog)};window.researchContext={};window.routes={predictive_search_url:'/unused'};</script><script defer src="/real-search.js"></script><script type="module" src="/bootstrap.mjs"></script></head><body>
    <header class="section-header"></header><div class="header__search"><predictive-search data-loading-text="Cargando"><form action="/search" role="search"><label for="query">Buscar</label><input id="query" type="search" name="q" role="combobox" aria-controls="results" aria-expanded="false"><button type="submit">Buscar</button><button type="reset">Limpiar</button><div id="results" role="listbox" data-predictive-search></div><span class="predictive-search-status" role="status" aria-live="polite"></span></form></predictive-search><div class="tp-clc-search"></div></div><button id="outside">Fuera</button></body></html>`;
}
function matching(params) {
  const fields = { 'filter.p.m.custom.ancho': 'width', 'filter.p.m.custom.aspecto': 'profile', 'filter.p.m.custom.di_metro': 'rim', 'filter.p.m.custom.marca': 'brand', 'filter.v.t.shopify.viscosity': 'viscosity' };
  return products.filter(product => Object.entries(fields).every(([param, field]) => !params.has(param) || params.getAll(param).includes(product[field])))
    .filter(product => { const query = params.get('q'), phrase = query.match(/^title:"([^"]*)"$/)?.[1]; return phrase ? product.title.includes(phrase) : query === '*' || ['slow', 'timeout'].includes(query) || query.toLowerCase().split(/\s+/).every(word => product.title.toLowerCase().includes(word)); });
}
function compact(params, key) {
  const matches = matching(params), shown = matches.slice(0, 5);
  return `<div id="shopify-section-research-compact" data-plan-key="${escape(key)}"><div data-rendered-query="${escape(params.get('q'))}" data-total="${matches.length}"><button type="submit" role="option" aria-selected="false" id="view-all"><span data-predictive-search-search-for-text>Ver todos</span></button><ul role="group">${shown.map(product => `<li id="product-${product.id}" role="option" aria-selected="false"><a href="/products/${product.id}" tabindex="-1">${escape(product.title)}</a></li>`).join('')}</ul>${shown.length ? '' : '<p data-empty>Sin coincidencias</p>'}<span hidden data-predictive-search-live-region-count-value>${matches.length} productos</span></div></div>`;
}
before(async () => {
  const source = await readFile(new URL('assets/global.js', root), 'utf8');
  const helpersEnd = source.indexOf('({init:'), start = source.indexOf('var I=function(e)'), endToken = 'customElements.define("main-search",R)', end = source.indexOf(endToken);
  assert.ok(helpersEnd > 0 && start > helpersEnd && end > start);
  realSearch = source.slice(0, helpersEnd) + 'window.debounce=(fn,ms)=>{let id;return (...args)=>{clearTimeout(id);id=setTimeout(()=>fn(...args),ms)}};' + source.slice(start, end + endToken.length) + ';})();';
  server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/real-search.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(realSearch); return; }
    if (url.pathname === '/query-policy.mjs') { res.setHeader('Content-Type', 'text/javascript'); res.end(await readFile(new URL('./query-policy-prototype.mjs', import.meta.url))); return; }
    if (url.pathname === '/controller.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(await readFile(new URL('./preview-controller-prototype.js', import.meta.url))); return; }
    if (url.pathname === '/bootstrap.mjs') { res.setHeader('Content-Type', 'text/javascript'); res.end(`import {planSearch} from '/query-policy.mjs';window.researchPlan=raw=>planSearch(raw,window.researchCatalog,window.researchContext);await import('/controller.js');`); return; }
    if (url.pathname === '/search' && url.searchParams.has('section_id')) {
      requests.push({ query: url.searchParams.get('q'), params: url.searchParams.toString(), time: Date.now() });
      const q = url.searchParams.get('q');
      if (q === 'slow' || q === 'timeout') await new Promise(resolve => setTimeout(resolve, q === 'slow' ? 900 : 1200));
      if (q === 'error') { res.writeHead(503); res.end(); return; }
      res.setHeader('Content-Type', 'text/html'); res.end(q === 'invalid' ? '<div>Invalid</div>' : compact(url.searchParams, req.headers['x-research-plan'])); return;
    }
    res.setHeader('Content-Type', 'text/html'); res.end(fixture());
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
});
after(async () => { await browser?.close(); if (server) await new Promise(resolve => server.close(resolve)); });
async function pageFor(t, mobile = false) {
  const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
  page.setDefaultTimeout(4000);
  page.on('pageerror', error => console.log(`BROWSER ERROR: ${error.message}`));
  t.after(() => page.close()); await page.goto(origin); await page.waitForFunction(() => window.researchReady); return page;
}
async function fill(page, raw) { await page.locator('input[name=q]').fill(raw); }
async function waitResult(page) {
  try { await page.waitForFunction(() => document.querySelector('predictive-search').isOpen && document.querySelector('[data-rendered-query]')); }
  catch (error) {
    console.log('PROTOTYPE STATE ' + JSON.stringify(await page.evaluate(() => {
      const element = document.querySelector('predictive-search');
      return { value: element.input.value, status: element.dataset.researchStatus, open: element.isOpen, composing: element.researchState?.composing, focused: document.activeElement?.outerHTML, content: element.predictiveSearchResults.innerHTML.slice(0, 300), plan: window.researchPlan(element.input.value) };
    })));
    throw error;
  }
}
for (const mobile of [false, true]) {
  const suffix = mobile ? 'mobile' : 'desktop';
  test(`exact attributes, unchanged visible input and compact cap (${suffix})`, async t => {
    const page = await pageFor(t, mobile); await fill(page, '90/100-10'); await waitResult(page);
    assert.equal(await page.locator('input[name=q]').inputValue(), '90/100-10');
    assert.equal(await page.locator('[role=option] a').count(), 1); assert.equal(await page.locator('[role=option] a').textContent(), 'CEAT 90/100-10');
    await fill(page, 'casco'); await waitResult(page); assert.equal(await page.locator('[role=option] a').count(), 5); assert.equal(await page.locator('[data-total]').getAttribute('data-total'), '12');
    assert.equal(await page.locator('[data-predictive-search] form').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  });
  test(`keyboard options have unique visible IDs and Enter opens selected product (${suffix})`, async t => {
    const page = await pageFor(t, mobile); await fill(page, '90/100-10'); await waitResult(page);
    assert.match(await page.locator('[role=status]').textContent(), /1 productos/);
    const input = page.locator('input[name=q]'); await input.press('ArrowDown'); assert.equal(await input.getAttribute('aria-activedescendant'), 'view-all');
    await input.press('ArrowDown'); assert.equal(await input.getAttribute('aria-activedescendant'), 'product-1');
    assert.equal(await input.getAttribute('aria-expanded'), 'true');
    assert.equal(await page.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(node => node.id); return ids.length === new Set(ids).size; }), true);
    await input.press('Enter'); await page.waitForURL('**/products/1');
  });
  test(`Enter before preview sends the same attribute plan immediately (${suffix})`, async t => {
    const page = await pageFor(t, mobile); const before = requests.length; await fill(page, '90/100-10'); await page.locator('input[name=q]').press('Enter'); await page.waitForURL('**/search?**');
    const url = new URL(page.url()); assert.equal(url.searchParams.get('q'), '*'); assert.equal(url.searchParams.get('filter.p.m.custom.di_metro'), '10'); assert.equal(requests.length, before);
  });
  test(`changing text removes the previous product selection before Enter (${suffix})`, async t => {
    const page = await pageFor(t, mobile); await fill(page, '90/100-10'); await waitResult(page); const input = page.locator('input[name=q]'); await input.press('ArrowDown'); await input.press('ArrowDown');
    await fill(page, 'casco'); assert.equal(await input.getAttribute('aria-activedescendant'), null); await input.press('Enter'); await page.waitForURL('**/search?**'); assert.equal(new URL(page.url()).searchParams.get('q'), 'casco');
  });
  test(`rapid writing makes one settled request (${suffix})`, async t => {
    const page = await pageFor(t, mobile); const before = requests.length; await page.locator('input[name=q]').pressSequentially('casco', { delay: 35 }); await waitResult(page); assert.equal(requests.length - before, 1);
  });
  test(`cached queries do not make another request (${suffix})`, async t => {
    const page = await pageFor(t, mobile); await fill(page, 'casco'); await waitResult(page); await fill(page, '90/100-10'); await waitResult(page); const before = requests.length;
    await fill(page, 'casco'); await waitResult(page); assert.equal(requests.length, before);
  });
  test(`late responses cannot replace a newer query (${suffix})`, async t => {
    const page = await pageFor(t, mobile); await fill(page, 'slow'); await page.waitForFunction(() => document.querySelector('predictive-search').hasAttribute('loading')); await fill(page, '90/100-10'); await waitResult(page); await page.waitForTimeout(1000);
    assert.equal(await page.locator('[role=option] a').count(), 1); assert.equal(await page.locator('[role=option] a').textContent(), 'CEAT 90/100-10');
  });
  test(`reset aborts a pending query and never reopens results (${suffix})`, async t => {
    const page = await pageFor(t, mobile); await fill(page, 'slow'); await page.waitForFunction(() => document.querySelector('predictive-search').hasAttribute('loading')); await page.locator('button[type=reset]').click(); await page.waitForTimeout(1000);
    assert.equal(await page.locator('input[name=q]').inputValue(), ''); assert.equal(await page.locator('[data-rendered-query]').count(), 0);
  });
}
test('composition input does not send intermediate IME queries', async t => {
  const page = await pageFor(t); const before = requests.length;
  await page.locator('input[name=q]').focus(); await page.evaluate(() => { const input = document.querySelector('input[name=q]'); input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true })); input.value = 'cas'; input.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true })); });
  await page.waitForTimeout(400); assert.equal(requests.length, before);
  await page.evaluate(() => { const input = document.querySelector('input[name=q]'); input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true })); input.value = 'casco'; input.dispatchEvent(new InputEvent('input', { bubbles: true })); }); await waitResult(page); assert.equal(requests.length - before, 1);
});
for (const query of ['error', 'invalid', 'timeout']) test(`technical failure remains distinct from zero matches: ${query}`, async t => {
  const page = await pageFor(t); if (query === 'timeout') await page.evaluate(() => window.researchTimeout = 100);
  await fill(page, query); await page.waitForFunction(() => ['http_error', 'invalid_response', 'timeout'].includes(document.querySelector('predictive-search').dataset.researchStatus));
  assert.equal(await page.locator('[data-empty]').count(), 0); assert.equal(await page.locator('predictive-search').getAttribute('loading'), null); assert.match(await page.locator('[data-predictive-search]').textContent(), /Enter/);
  await page.locator('input[name=q]').press('Enter'); await page.waitForURL('**/search?**');
});
test('zero results have a real empty state and working search action', async t => {
  const page = await pageFor(t); await fill(page, '90/100-99'); await waitResult(page); assert.equal(await page.locator('[data-empty]').count(), 1); assert.equal(await page.locator('[data-total]').getAttribute('data-total'), '0');
});
test('locale and currency changes never reuse formatted cache from another context', async t => {
  const page = await pageFor(t); await fill(page, 'casco'); await waitResult(page); const before = requests.length;
  await page.evaluate(() => window.researchContext = { country: 'AR', currency: 'USD' }); await page.evaluate(() => { const el = document.querySelector('predictive-search'); return el.getSearchResults(el.getQuery()); }); assert.equal(requests.length, before + 1);
});
test('ambiguous or unsupported specifications are not silently relaxed', async t => {
  const page = await pageFor(t); const before = requests.length; await fill(page, '5w30'); await page.waitForTimeout(400); assert.equal(requests.length, before); assert.equal(await page.locator('input[name=q]').inputValue(), '5w30'); assert.match(await page.locator('[data-predictive-search]').textContent(), /precisión/);
});
test('explicit construction does not become another technical code', async t => {
  const page = await pageFor(t); await fill(page, '120/70ZR17'); await waitResult(page); assert.deepEqual(await page.locator('[role=option] a').allTextContents(), ['MICHELIN 120/70ZR17']); assert.equal(await page.locator('input[name=q]').inputValue(), '120/70ZR17');
});
test('partial rims use repeated values and do not include a different prefix', async t => {
  const page = await pageFor(t); await fill(page, '90/100-1'); await waitResult(page);
  const titles = await page.locator('[role=option] a').allTextContents(); assert.equal(titles.length, 3); assert.ok(titles.every(title => !title.includes('-21')));
  const request = new URLSearchParams(requests.at(-1).params); assert.deepEqual(request.getAll('filter.p.m.custom.di_metro'), ['10', '14', '16', '17', '18', '19']);
});
test('blurred pending queries never reopen the preview', async t => {
  const page = await pageFor(t); await fill(page, 'slow'); await page.waitForFunction(() => document.querySelector('predictive-search').hasAttribute('loading')); await page.locator('#outside').focus(); await page.waitForTimeout(1000);
  assert.equal(await page.locator('[data-rendered-query]').count(), 0); assert.equal(await page.locator('predictive-search').getAttribute('open'), null);
});
test('slow mobile simulation retains one request and immediate typing feedback', async t => {
  const page = await pageFor(t, true), cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 100000, connectionType: 'cellular4g' });
  await page.evaluate(() => { window.inputFrames = []; document.querySelector('input[name=q]').addEventListener('input', () => { const start = performance.now(); requestAnimationFrame(() => window.inputFrames.push(performance.now() - start)); }); });
  const before = requests.length, started = performance.now(); await page.locator('input[name=q]').pressSequentially('casco', { delay: 40 }); await waitResult(page);
  const metrics = await page.evaluate(() => ({ inputFrames: window.inputFrames, visibleOptions: document.querySelectorAll('[role=option] a').length }));
  metrics.elapsedMs = performance.now() - started; metrics.requests = requests.length - before;
  metrics.limitation = 'Synthetic fixture, 150ms simulated network latency and CPU4x. Excludes actual Shopify server work, production pricing/images and physical mobile keyboard.';
  await writeFile(new URL('./simulated-mobile-metrics.json', import.meta.url), JSON.stringify(metrics, null, 2));
  assert.equal(metrics.requests, 1); assert.equal(metrics.visibleOptions, 5); assert.equal(await page.locator('input[name=q]').inputValue(), 'casco');
});
