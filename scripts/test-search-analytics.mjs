import { test, after, before } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import contract from '../assets/search-analytics-contract.js';
import { toSearchRow, subscribeSearchEvents } from '../integrations/search-analytics/pixel-search.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ID = 'a47f2bf6-4314-4041-a33e-870718cae6c1';
const payload = () => ({
  schema_version: 1, search_id: ID, query_revision: 1, request_id: ID,
  preview_request_id: null, surface: 'header', ...contract.queries('10w40', '(10W40 OR 10W-40)', null),
  context_redacted: false, normalization_version: '1', theme_version: 'search-analytics-1',
  language: 'es', country: 'CL', submission_method: 'unknown', correlation_status: 'interaction',
  status: 'success', product_ids: ['101', '102'], products_returned: 8, products_shown: 2,
  suggestions_shown: 0, result_count: null, result_scope: 'unknown', resource_types: ['store_settings'],
  page: null, page_size: null, display_limit: 5, duration_ms: 10, source: 'network',
  error_code: null, http_status: null, search_options: [],
});
const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const productIds = ['101', '102', '103', '104', '105'];

function preview(query) {
  const count = query === 'empty' ? 0 : 8;
  const products = count ? productIds.map((id) => `<li data-search-product-id="${id}"><a href="/products/${id}">${id}</a></li>`).join('') : '';
  return `<div id="shopify-section-predictive-search"><div data-search-preview-metadata data-query="${escape(query)}" data-products-returned="${count}">
    <ul class="desktop">${products}</ul><ul class="mobile">${products}</ul>
    <a class="predictive-search__suggestion" href="/search?q=other&type=product">other</a>
    ${count ? '' : '<p>Sin productos</p>'}</div><span hidden data-predictive-search-live-region-count-value>${count}</span></div>`;
}
function fixture(url) {
  const query = url.searchParams.get('q') || '';
  const final = url.pathname === '/search';
  const total = query === 'empty-final' ? 0 : 20;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
    <style>.mobile{display:none}@media(max-width:600px){.mobile{display:block}.desktop{display:none}}</style>
    <script>window.events=[];window.searchFetches=0;window.consent=${url.searchParams.get('consent') !== '0'};
      window.Shopify={customerPrivacy:{analyticsProcessingAllowed:()=>window.consent},analytics:{publish:(name,data)=>{window.events.push({name,data:JSON.parse(JSON.stringify(data))});return Promise.resolve(true)}}};
      ${url.searchParams.get('delayed_publisher') === '1' ? 'const installPublisher=window.Shopify.analytics; delete window.Shopify.analytics; setTimeout(()=>{window.Shopify.analytics=installPublisher},350);' : ''}
      window.routes={predictive_search_url:'/search/suggest'};</script>
    <script id="bikerz-search-analytics-config" type="application/json">{"enabled":${url.searchParams.get('enabled') !== '0'},"language":"es","country":"CL"}</script>
    <script defer src="/assets/search-analytics-contract.js"></script><script defer src="/assets/search-analytics.js"></script>
    <script defer src="/fixture-search.js?real=${url.searchParams.get('real') === '1' ? '1' : '0'}"></script><script defer src="/assets/search-normalize.js"></script>
    </head><body><header class="section-header"></header><div class="header__search"><predictive-search data-loading-text="Cargando">
    <form action="/search" role="search"><input name="q" type="search"><input type="hidden" name="type" value="product"><button type="submit">Buscar</button><button type="reset">Limpiar</button><div data-predictive-search></div><span class="predictive-search-status"></span></form>
    </predictive-search><div class="tp-clc-search"></div></div><main>${final ? `<span hidden data-search-results-metadata data-query="${escape(query)}" data-total="${total}" data-resource-types="${url.searchParams.get('type') === 'mixed' ? 'product,page' : 'product'}" data-page="1" data-display-limit="24" data-product-ids="${total ? productIds.join(',') : ''}"></span>` : ''}</main></body></html>`;
}
const fixtureSearch = `customElements.define('predictive-search',class extends HTMLElement{
  constructor(){super();this.input=this.querySelector('input');this.predictiveSearchResults=this.querySelector('[data-predictive-search]');this.abortController=new AbortController();this.isOpen=false;
    this.input.addEventListener('input',()=>{clearTimeout(this.timer);this.timer=setTimeout(()=>{if(this.getQuery())this.getSearchResults(this.getQuery());else this.close();},30)});
    this.input.form.addEventListener('submit',e=>{if(window.cancelSearch)e.preventDefault()});}
  getQuery(){return this.input.value.trim()} setLiveRegionLoadingState(){this.setAttribute('loading','true')}
  renderSearchResults(html){this.predictiveSearchResults.innerHTML=html;this.isOpen=true;this.setAttribute('open','true')}
  close(){this.isOpen=false;this.removeAttribute('open')}
});`;

let browser, server, origin;
before(async () => {
  const themeSource = await readFile(new URL('../assets/global.js', import.meta.url), 'utf8');
  const helpersEnd = themeSource.indexOf('({init:');
  const searchStart = themeSource.indexOf('var I=function(e)');
  const searchEndToken = 'customElements.define("main-search",R)';
  const searchEnd = themeSource.indexOf(searchEndToken);
  assert.ok(helpersEnd > 0 && searchStart > helpersEnd && searchEnd > searchStart, 'Locate actual compiled search classes in the current theme');
  const realSearch = themeSource.slice(0, helpersEnd) + 'window.debounce=(fn,ms)=>{let id;return (...args)=>{clearTimeout(id);id=setTimeout(()=>fn(...args),ms)}};' + themeSource.slice(searchStart, searchEnd + searchEndToken.length) + ';})();';
  server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      if (url.pathname.startsWith('/assets/') && ['search-analytics.js', 'search-analytics-contract.js', 'search-normalize.js'].includes(url.pathname.split('/').pop())) {
        res.setHeader('Content-Type', 'text/javascript');
        res.end(await readFile(new URL(`..${url.pathname}`, import.meta.url))); return;
      }
      if (url.pathname === '/fixture-search.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(url.searchParams.get('real') === '1' ? realSearch : fixtureSearch); return; }
      if (url.pathname === '/search/suggest') {
        const query = url.searchParams.get('q');
        if (query === 'error') { res.writeHead(503); res.end('unavailable'); return; }
        if (query === 'invalid') { res.setHeader('Content-Type', 'text/html'); res.end('<div>Invalid response</div>'); return; }
        if (query === 'slow') await new Promise((resolve) => setTimeout(resolve, 250));
        res.setHeader('Content-Type', 'text/html'); res.end(preview(query)); return;
      }
      res.setHeader('Content-Type', 'text/html'); res.end(fixture(url));
    } catch (_) { res.writeHead(500); res.end(); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, channel: process.env.BIKERZ_BROWSER_CHANNEL || 'chrome' });
});
after(async () => { await browser?.close(); if (server) await new Promise((resolve) => server.close(resolve)); });

async function pageFor(t, suffix = '/', mobile = false) {
  const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
  t.after(() => page.close());
  await page.goto(origin + suffix);
  await page.waitForFunction(() => !!window.bikerzSearchAnalytics);
  return page;
}
async function type(page, value) { await page.locator('input[name="q"]').fill(value); }
async function waitPreview(page, query) {
  await page.waitForFunction((q) => window.events.some((e) => e.name === 'bikerz:search_preview_viewed' && e.data.query_text === q), query);
}

test('contract suppresses personal text and preserves tire and oil queries', () => {
  for (const value of ['persona@example.com', '+56 9 1234 5678', '12.345.678-9', 'mi nombre es Juan', '<script>alert(1)</script>', 'a'.repeat(201)]) {
    const result = contract.queries(value, value, value);
    assert.equal(result.text_redacted, true);
    assert.equal(result.query_text, null); assert.equal(result.predictive_query, null); assert.equal(result.submitted_query, null);
  }
  for (const value of ['140 70 17', '140/70-17', '2.50-17', '10w40', '(10W40 OR 10W-40)']) assert.equal(contract.queries(value, value, value).text_redacted, false, value);
  assert.equal(contract.project(contract.EVENTS[0], { ...payload(), email: 'a@b.cl' }), null);
  assert.equal(contract.project(contract.EVENTS[0], { ...payload(), query_text: 'a@b.cl' }), null);
  assert.equal(contract.project(contract.EVENTS[0], { ...payload(), product_ids: ['101', '101'] }), null);
  assert.equal(contract.project(contract.EVENTS[0], { ...payload(), products_shown: -1 }), null);
});

test('pixel adapter projects only search fields and honors consent changes', async () => {
  const event = { name: contract.EVENTS[0], id: 'shopify-event-1', timestamp: '2026-10-22T15:00:00Z', seq: 3, customData: payload(), context: { email: 'ignored@example.com' } };
  const row = toSearchRow(event, 'bikerz.myshopify.com');
  assert.equal(row.search_data.query_text, '10w40'); assert.equal(row.product_id, null); assert.ok(!JSON.stringify(row).includes('ignored@'));
  assert.equal(toSearchRow({ ...event, customData: { ...payload(), query_text: 'a@b.cl' } }, 'bikerz.myshopify.com'), null);
  const subscriptions = new Map(); let consentChanged; const sent = [];
  subscribeSearchEvents({ init: { customerPrivacy: { analyticsProcessingAllowed: false } }, customerPrivacy: { subscribe: (_, fn) => { consentChanged = fn; } }, analytics: { subscribe: (name, fn) => subscriptions.set(name, fn) } }, 'bikerz.myshopify.com', (rows) => sent.push(...rows));
  assert.equal(subscriptions.size, 4); subscriptions.get(event.name)(event); assert.equal(sent.length, 0);
  consentChanged({ customerPrivacy: { analyticsProcessingAllowed: true } }); subscriptions.get(event.name)(event); assert.equal(sent.length, 1);
  consentChanged({ customerPrivacy: { analyticsProcessingAllowed: false } }); subscriptions.get(event.name)(event); assert.equal(sent.length, 1);
});

for (const mobile of [false, true]) test(`preview records zero products without Enter and deduplicates visible IDs (${mobile ? 'mobile' : 'desktop'})`, async (t) => {
  const page = await pageFor(t, '/', mobile);
  await type(page, 'empty'); await waitPreview(page, 'empty');
  let events = await page.evaluate(() => window.events);
  assert.equal(events.length, 1); assert.equal(events[0].data.status, 'no_products'); assert.equal(events[0].data.products_returned, 0);
  await type(page, 'casco'); await waitPreview(page, 'casco');
  events = await page.evaluate(() => window.events);
  assert.deepEqual(events.at(-1).data.product_ids, productIds); assert.equal(events.at(-1).data.products_shown, 5); assert.equal(events.at(-1).data.products_returned, 8);
});

test('oil query keeps original, predictive and submitted text and hands over search ID', async (t) => {
  const page = await pageFor(t);
  await type(page, '10w40'); await waitPreview(page, '10w40');
  const previewEvent = await page.evaluate(() => window.events.at(-1));
  assert.equal(previewEvent.data.predictive_query, '(10W40 OR 10W-40)');
  await page.locator('button[type="submit"]').click(); await page.waitForURL('**/search?**');
  await page.waitForFunction(() => window.events.some((e) => e.name === 'bikerz:search_results_viewed'));
  const result = await page.evaluate(() => window.events.find((e) => e.name === 'bikerz:search_results_viewed').data);
  assert.equal(result.search_id, previewEvent.data.search_id); assert.equal(result.preview_request_id, previewEvent.data.request_id);
  assert.equal(result.query_text, '10w40'); assert.equal(result.submitted_query, '10W-40'); assert.equal(result.result_count, 20); assert.equal(result.correlation_status, 'matched');
});

test('cache is observed and reopening identical results does not duplicate', async (t) => {
  const page = await pageFor(t);
  await type(page, 'casco'); await waitPreview(page, 'casco');
  await page.evaluate(() => { const el = document.querySelector('predictive-search'); return el.getSearchResults(el.getQuery()); });
  await page.waitForTimeout(80); assert.equal(await page.evaluate(() => window.events.length), 1);
  await type(page, 'guante'); await waitPreview(page, 'guante');
  await type(page, 'casco'); await page.waitForFunction(() => window.events.filter((e) => e.data.query_text === 'casco').length === 2);
  assert.equal(await page.evaluate(() => window.events.at(-1).data.source), 'cache');
});

test('late responses and HTTP errors never become false zero-product previews', async (t) => {
  const page = await pageFor(t);
  await type(page, 'slow'); await page.waitForTimeout(70); await type(page, 'casco'); await waitPreview(page, 'casco'); await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => window.events.filter((e) => e.data.query_text === 'slow').length), 0);
  await type(page, 'error'); await page.waitForFunction(() => window.events.some((e) => e.name === 'bikerz:search_preview_error'));
  const event = await page.evaluate(() => window.events.at(-1));
  assert.equal(event.data.error_code, 'http_error'); assert.equal(event.data.http_status, 503); assert.equal(event.data.products_returned, null);
});

test('consent denial emits and stores nothing; revocation clears the handoff', async (t) => {
  const page = await pageFor(t, '/?consent=0'); await type(page, 'casco'); await page.waitForTimeout(160);
  assert.equal(await page.evaluate(() => window.events.length), 0); assert.equal(await page.evaluate(() => sessionStorage.length), 0);
  await page.evaluate(() => { window.consent = true; document.dispatchEvent(new CustomEvent('visitorConsentCollected')); });
  await type(page, 'guante'); await waitPreview(page, 'guante');
  await page.evaluate(() => { sessionStorage.setItem('bikerz.search.analytics.v1', '{}'); window.consent = false; document.dispatchEvent(new CustomEvent('visitorConsentCollected')); });
  assert.equal(await page.evaluate(() => sessionStorage.length), 0);
});

test('a selected suggestion retains the interaction but flags the changed query', async (t) => {
  const page = await pageFor(t); await type(page, 'casco'); await waitPreview(page, 'casco');
  const id = await page.evaluate(() => window.events.at(-1).data.search_id);
  await page.locator('.predictive-search__suggestion').click(); await page.waitForURL('**/search?**');
  await page.waitForFunction(() => window.events.some((e) => e.name === 'bikerz:search_results_viewed'));
  const result = await page.evaluate(() => window.events.at(-1).data);
  assert.equal(result.search_id, id); assert.equal(result.correlation_status, 'changed_query'); assert.equal(result.submitted_query, 'other');
});

test('submit before a preview and cancelled submits do not invent previews', async (t) => {
  const page = await pageFor(t);
  await page.evaluate(() => { window.cancelSearch = true; const input = document.querySelector('input[name="q"]'); input.value = 'casco'; input.form.requestSubmit(); });
  assert.equal(await page.evaluate(() => window.events.length), 0);
  await page.evaluate(() => { window.cancelSearch = false; const input = document.querySelector('input[name="q"]'); input.value = 'slow'; input.form.requestSubmit(); });
  await page.waitForURL('**/search?**'); await page.waitForFunction(() => window.events.some((e) => e.name === 'bikerz:search_results_viewed'));
  const result = await page.evaluate(() => window.events.at(-1).data);
  assert.equal(result.correlation_status, 'missing_preview'); assert.equal(result.preview_request_id, null);
});

test('direct zero-result pages and AJAX replacements retain totals without extra submits', async (t) => {
  const page = await pageFor(t, '/search?q=empty-final&type=product');
  await page.waitForFunction(() => window.events.length === 1);
  assert.equal(await page.evaluate(() => window.events[0].data.result_count), 0);
  await page.evaluate(() => { const marker = document.querySelector('[data-search-results-metadata]'); const next = marker.cloneNode(); next.dataset.page = '2'; next.dataset.total = '15'; next.dataset.productIds = '201,202'; marker.replaceWith(next); history.pushState({}, '', '/search?q=empty-final&type=product&page=2'); });
  await page.waitForFunction(() => window.events.length === 2);
  const events = await page.evaluate(() => window.events);
  assert.equal(events[0].data.search_id, events[1].data.search_id); assert.equal(events[1].data.page, 2); assert.equal(events[1].data.result_count, 15);
  assert.ok(events.every((e) => e.name === 'bikerz:search_results_viewed'));
});

test('delayed Shopify publisher still observes initial results once', async (t) => {
  const page = await pageFor(t, '/search?q=empty-final&type=product&delayed_publisher=1');
  await page.waitForFunction(() => window.events.some((e) => e.name === 'bikerz:search_results_viewed'), null, {timeout: 2500});
  assert.equal(await page.evaluate(() => window.events.length), 1);
  assert.equal(await page.evaluate(() => window.events[0].data.result_count), 0);
});

test('personal queries are omitted before publish and never saved to the handoff', async (t) => {
  const page = await pageFor(t);
  await type(page, 'persona@example.com'); await page.waitForFunction(() => window.events.length === 1);
  const event = await page.evaluate(() => window.events[0]);
  assert.equal(event.data.text_redacted, true); assert.ok(!JSON.stringify(event).includes('persona@'));
  await page.locator('button[type="submit"]').click(); await page.waitForURL('**/search?**');
  await page.waitForFunction(() => window.events.some((e) => e.name === 'bikerz:search_results_viewed'));
  assert.equal(await page.evaluate(() => sessionStorage.length), 0);
  assert.ok(!(await page.evaluate(() => JSON.stringify(window.events))).includes('persona@'));
});

test('actual theme classes retain keyboard Enter, normalization and navigation', async (t) => {
  const page = await pageFor(t, '/?real=1'); const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await type(page, '10w40'); await waitPreview(page, '10w40');
  const id = await page.evaluate(() => window.events.at(-1).data.search_id);
  await page.locator('input[name="q"]').press('Enter'); await page.waitForURL('**/search?**');
  await page.waitForFunction(() => window.events.some((e) => e.name === 'bikerz:search_results_viewed'));
  assert.equal(await page.evaluate(() => window.events.at(-1).data.search_id), id);
  assert.equal(await page.evaluate(() => window.events.at(-1).data.submitted_query), '10W-40');
  assert.equal(await page.evaluate(() => window.events.at(-1).data.submission_method), 'enter'); assert.deepEqual(errors, []);
});

test('actual theme reset starts a new interaction for the same text', async (t) => {
  const page = await pageFor(t, '/?real=1'); await type(page, 'casco'); await waitPreview(page, 'casco');
  const id = await page.evaluate(() => window.events.at(-1).data.search_id);
  await page.locator('button[type="reset"]').click(); assert.equal(await page.locator('input[name="q"]').inputValue(), '');
  await type(page, 'casco'); await page.waitForFunction(() => window.events.filter((e) => e.name === 'bikerz:search_preview_viewed').length === 2);
  assert.notEqual(await page.evaluate(() => window.events.at(-1).data.search_id), id);
  assert.equal(await page.evaluate(() => window.events.at(-1).data.source), 'cache');
});

test('feature disabled leaves the original predictive fetch method intact', async (t) => {
  const page = await browser.newPage(); t.after(() => page.close()); await page.goto(origin + '/?enabled=0&real=1');
  await page.waitForFunction(() => !!customElements.get('predictive-search'));
  assert.equal(await page.evaluate(() => window.bikerzSearchAnalytics), undefined);
  assert.equal(await page.evaluate(() => customElements.get('predictive-search').prototype.getSearchResults.toString().includes('cachedResults')), true);
  await type(page, 'casco'); await page.waitForFunction(() => document.querySelector('predictive-search').isOpen);
  assert.equal(await page.evaluate(() => window.events.length), 0);
});

test('unavailable session storage degrades to unmatched results without blocking navigation', async (t) => {
  const page = await pageFor(t); await type(page, 'casco'); await waitPreview(page, 'casco');
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('disabled'); }; });
  await page.locator('button[type="submit"]').click(); await page.waitForURL('**/search?**');
  await page.waitForFunction(() => window.events.some((e) => e.name === 'bikerz:search_results_viewed'));
  assert.equal(await page.evaluate(() => window.events.at(-1).data.correlation_status), 'unmatched');
});

test('malformed responses are technical errors with unknown product counts', async (t) => {
  const page = await pageFor(t); await type(page, 'invalid');
  await page.waitForFunction(() => window.events.some((e) => e.name === 'bikerz:search_preview_error'));
  const events = await page.evaluate(() => window.events);
  assert.equal(events.length, 1); assert.equal(events[0].data.error_code, 'invalid_response'); assert.equal(events[0].data.products_returned, null);
});

test('mixed result totals stay mixed and a restored page does not emit the same view twice', async (t) => {
  const page = await pageFor(t, '/search?q=casco&type=mixed'); await page.waitForFunction(() => window.events.length === 1);
  const result = await page.evaluate(() => window.events[0].data);
  assert.equal(result.result_scope, 'mixed'); assert.equal(result.result_count, 20); assert.equal(result.products_shown, 5);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await page.waitForTimeout(80); assert.equal(await page.evaluate(() => window.events.length), 1);
});
