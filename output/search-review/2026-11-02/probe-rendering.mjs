import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import zlib from 'node:zlib';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const folder = new URL('./performance/', import.meta.url);
const files = (await readdir(folder)).filter(name => name.endsWith('.html'));
if (files.length !== 18) throw new Error(`Expected 18 completed snapshots, found ${files.length}`);
const root = new URL('../../../', import.meta.url);
const css = await Promise.all(['base.css', 'component-predictive-search.css', 'search-modal.css'].map(name => readFile(new URL(`assets/${name}`, root), 'utf8')));
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const rows = [];
try {
  for (const mobile of [false, true]) {
    const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
    await page.route('**/*', route => route.abort());
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: mobile ? 4 : 1 });
    await page.setContent('<div class="header__search"><div class="search-modal"><div class="search-modal__content"><div id="target" data-predictive-search></div></div></div></div>');
    for (const content of css) await page.addStyleTag({ content });
    for (const file of files) {
      const html = await readFile(new URL(file, folder), 'utf8');
      const result = await page.evaluate(({ html, compact }) => {
        const target = document.getElementById('target');
        let source = html;
        if (compact) {
          const document = new DOMParser().parseFromString(html, 'text/html');
          const list = document.createElement('ul');
          list.className = 'predictive-search__compact-list';
          list.style.display = 'block';
          for (const [i, card] of [...document.querySelectorAll('.bikerz-product-card__image-link')].slice(0, 5).entries()) {
            const item = document.createElement('li'); item.id = `prototype-${i}`; item.setAttribute('role', 'option');
            const link = document.createElement('a'); link.className = 'predictive-search__compact-link';
            link.href = card.getAttribute('href'); link.tabIndex = -1;
            const originalImage = card.querySelector('img');
            if (originalImage) { const image = document.createElement('img'); image.src = originalImage.getAttribute('src'); image.width = 56; image.height = 56; image.alt = ''; link.append(image); }
            const title = document.createElement('span'); title.textContent = card.getAttribute('aria-label'); link.append(title); item.append(link); list.append(item);
          }
          source = list.outerHTML;
        }
        const parse = [], insertAndLayout = [];
        let nodes, images, forms, inputs;
        for (let i = 0; i < 8; i++) {
          target.replaceChildren();
          const started = performance.now();
          const doc = new DOMParser().parseFromString(source, 'text/html');
          const parsed = performance.now();
          doc.querySelectorAll('script,link,style').forEach(node => node.remove());
          doc.querySelectorAll('*').forEach(node => { for (const attribute of [...node.attributes]) if (attribute.name.startsWith('on')) node.removeAttribute(attribute.name); });
          const beforeInsert = performance.now();
          target.replaceChildren(...doc.body.childNodes);
          target.getBoundingClientRect();
          if (i > 0) { parse.push(parsed - started); insertAndLayout.push(performance.now() - beforeInsert); }
        }
        nodes = target.querySelectorAll('*').length; images = target.querySelectorAll('img').length;
        forms = target.querySelectorAll('form').length; inputs = target.querySelectorAll('input').length;
        const median = values => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
        return { nodes, images, forms, inputs, parseMedianMs: median(parse), insertLayoutMedianMs: median(insertAndLayout),
          sourceBytes: new TextEncoder().encode(source).length, compactSource: compact ? source : undefined };
      }, { html, compact: file.endsWith('-filtered_section.html') });
      const { compactSource, ...metrics } = result;
      rows.push({ file, environment: mobile ? '390px_CPU4x' : '1280px_CPU1x', mode: compactSource ? 'compact_product_links_prototype' : 'existing_html', ...metrics,
        estimatedGzipBytes: compactSource ? zlib.gzipSync(compactSource).length : null });
    }
    await page.close();
  }
} finally { await browser.close(); }
const report = { limitation: 'Synthetic rendering of captured HTML with images/network blocked. Mobile uses a viewport and CPU throttle, not physical hardware. Compact links omit production price/badge/accessibility details and have no measured Shopify render time.', rows };
await writeFile(new URL('rendering-probe.json', folder), JSON.stringify(report, null, 2));
console.log(JSON.stringify(rows.map(({ file, environment, mode, nodes, sourceBytes, parseMedianMs, insertLayoutMedianMs }) => ({ file, environment, mode, nodes, sourceBytes, parseMedianMs, insertLayoutMedianMs })), null, 2));
