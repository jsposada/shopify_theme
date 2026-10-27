import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const script = await readFile(new URL('../assets/cart-discount.js', import.meta.url), 'utf8');
function node(extra = {}) {
  return { value: '', disabled: false, inert: false, dataset: {}, attributes: {},
    classList: { add() {}, remove() {} },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    focus() {}, querySelectorAll() { return []; }, ...extra };
}

function fixture({ codes = [], accepted = true, failRead = false, failWrite = false, missingSection = false } = {}) {
  const input = node({ value: ' BONOK60ERROR ' });
  const status = node();
  const button = node();
  const checkout = node();
  const items = node({ dataset: { id: 'template__cart-items' }, innerHTML: 'original prices' });
  const footer = node({ innerHTML: 'original total' });
  const note = node({ value: 'Conservar instrucciones' });
  const spinner = node();
  const label = node();
  const selectors = { input, '[data-discount-status]': status, '[data-discount-spinner]': spinner, '[data-discount-label]': label };
  class HTMLElement {
    constructor() { Object.assign(this, node({ dataset: { context: 'page', updateUrl: '/es/cart/update.js' } })); }
    querySelector(selector) { return selectors[selector]; }
    closest() { return null; }
    addEventListener() {}
  }
  const registry = new Map();
  const requests = [];
  let reloads = 0;
  let component;
  const document = {
    getElementById(id) { return id === 'main-cart-items' ? items : null; },
    querySelector(selector) {
      if (selector.startsWith('cart-discount[')) return component;
      return { '#main-cart-items .js-contents': items, '#main-cart-footer': footer, 'cart-note textarea': note }[selector] || null;
    },
    querySelectorAll(selector) { return selector.includes('cart-discount button') ? [button, checkout] : [items]; }
  };
  const context = {
    HTMLElement, document,
    customElements: { get: (name) => registry.get(name), define: (name, value) => registry.set(name, value) },
    DOMParser: class {
      parseFromString(html) { return { querySelector: () => node({ innerHTML: html }) }; }
    },
    window: { Shopify: { routes: { root: '/es/' } }, location: { pathname: '/es/cart', reload() { reloads++; } } },
    async fetch(url, options) {
      requests.push({ url, options });
      assert.equal(checkout.disabled, true, 'Checkout waits for authoritative totals');
      assert.equal(items.inert, true, 'Quantities cannot change during discount update');
      if (url.endsWith('cart.js')) {
        if (failRead) throw new Error('Offline');
        return { ok: true, json: async () => ({ discount_codes: codes }) };
      }
      if (failWrite) throw new Error('Connection lost after request');
      return { ok: true, json: async () => ({
        discount_codes: [{ code: 'BONOK60ERROR', applicable: accepted }],
        sections: { template__cart_items: '', 'template__cart-items': missingSection ? null : 'Shopify item prices', 'main-cart-footer': 'Shopify discounted total' }
      }) };
    }
  };
  vm.runInNewContext(script, context);
  component = new (registry.get('cart-discount'))();
  return { component, input, status, checkout, items, footer, requests, reloads: () => reloads,
    body: () => JSON.parse(requests.at(-1).options.body) };
}

test('applies code using localized API and server-rendered prices, preserving notes', async () => {
  const f = fixture();
  await f.component.updateDiscount();
  assert.equal(f.requests[0].url, '/es/cart.js');
  assert.equal(f.requests[1].url, '/es/cart/update.js');
  assert.equal(f.body().discount, 'BONOK60ERROR');
  assert.equal(f.body().note, 'Conservar instrucciones');
  assert.equal(f.body().sections_url, '/es/cart');
  assert.equal(f.footer.innerHTML, 'Shopify discounted total');
  assert.equal(f.status.textContent, 'Código de descuento aplicado.');
  assert.equal(f.checkout.disabled, false);
  assert.equal(f.items.inert, false);
});

test('does not report success for HTTP 200 with an inapplicable code', async () => {
  const f = fixture({ accepted: false });
  await f.component.updateDiscount();
  assert.match(f.status.textContent, /no es válido/);
  assert.equal(f.input.attributes['aria-invalid'], 'true');
});

test('preserves existing applicable codes and excludes invalid codes', async () => {
  const f = fixture({ codes: [{ code: 'OTHER', applicable: true }, { code: 'INVALID', applicable: false }] });
  await f.component.updateDiscount();
  assert.equal(f.body().discount, 'OTHER,BONOK60ERROR');
});

test('removes only the selected code', async () => {
  const f = fixture({ codes: [{ code: 'OTHER', applicable: true }, { code: 'BONOK60ERROR', applicable: true }] });
  await f.component.updateDiscount('bonok60error');
  assert.equal(f.body().discount, 'OTHER');
  assert.equal(f.status.textContent, 'Código quitado.');
});

test('blocks an empty code without making a request', async () => {
  const f = fixture();
  f.input.value = '  ';
  await f.component.updateDiscount();
  assert.equal(f.requests.length, 0);
  assert.match(f.status.textContent, /Ingresa/);
});

test('read failure displays a retry message and restores checkout', async () => {
  const f = fixture({ failRead: true });
  await f.component.updateDiscount();
  assert.match(f.status.textContent, /Inténtalo nuevamente/);
  assert.equal(f.reloads(), 0);
  assert.equal(f.checkout.disabled, false);
});

test('uncertain write reloads authoritative prices instead of leaving a stale total', async () => {
  const f = fixture({ failWrite: true });
  await f.component.updateDiscount();
  assert.equal(f.reloads(), 1);
});

test('failed section rendering does not partially update prices and reloads the cart', async () => {
  const f = fixture({ missingSection: true });
  await f.component.updateDiscount();
  assert.equal(f.reloads(), 1);
  assert.equal(f.items.innerHTML, 'original prices');
  assert.equal(f.footer.innerHTML, 'original total');
});

test('repeated submissions continue to work after an update', async () => {
  const f = fixture();
  await f.component.updateDiscount();
  await f.component.updateDiscount();
  assert.equal(f.requests.length, 4);
  assert.equal(f.status.textContent, 'Código de descuento aplicado.');
});
