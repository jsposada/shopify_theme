import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = new URL('./theme/',import.meta.url);
const config = {theme:190293868765,searchUrl:'/search',language:'es',country:'CL',currency:'CLP',profiles:['70','90','100'],rims:['10','14','16','17','19'],brands:['MOTUL','CEAT'],viscosities:{'10W-40':'oil-40'},tireLabel:'Neumáticos __SIZE__ en el buscador de medidas'};
const escape = text => String(text).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
let browser,server,origin,realSearch;
const requests=[];
function fixture(){return `<!doctype html><html><head><style>.compact{display:none}@media(max-width:600px){.desktop{display:none}.compact{display:block}}input{font-size:16px}[aria-selected=true]{outline:1px solid}li a{display:block;min-height:44px}</style>
<script id="bikerz-search-catalog" type="application/json">${JSON.stringify(config)}</script><script defer src="/assets/search-policy.js"></script><script defer src="/assets/search-normalize.js"></script><script defer src="/assets/search-preview.js"></script><script defer src="/global-search.js"></script></head><body><div class="section-header"></div><predictive-search data-loading-text="Cargando"><form action="/search"><input id="query" type="search" name="q"><input type="hidden" name="keep" value="yes"><button type="submit">Buscar</button><button type="reset">Limpiar</button><div data-predictive-search></div><span class="predictive-search-status" role="status"></span></form></predictive-search><div class="tp-clc-search"></div><button id="outside">Fuera</button></body></html>`;}
function result(params){
 const q=params.get('q'),empty=params.get('filter.p.m.custom.di_metro')==='99',exact=params.get('filter.p.m.custom.di_metro')==='10';
 const ids=empty?[]:exact?['CEAT']:['A','B','C','D','E'];
 const pairs=[...params].filter(([name])=>name.startsWith('filter.')).map(([name,value])=>({name,value}));
 if(q==='bad-filter')pairs.push({name:'filter.p.m.custom.ancho',value:'999'});
 const products=kind=>ids.map((id,i)=>`<${kind==='desktop'?'div':'li'} role="option" id="${kind}-${i}" aria-selected="false" data-search-product-id="${i+1}"><a href="/products/${id}">${id}</a>${kind==='desktop'?'<form action="/cart/add"><input name="id" value="111"><input name="form_type" value="product"><input name="product-id" value="99"></form>':''}</${kind==='desktop'?'div':'li'}>`).join('');
 return `<div id="shopify-section-search-preview"><div class="search-preview-v2" data-search-preview-metadata data-query="${escape(q)}" data-search-total="${ids.length}" data-products-returned="${ids.length}" data-search-filters="${escape(JSON.stringify(pairs))}"><button id="view-all" type="submit" role="option" aria-selected="false" class="predictive-search__view-all"><span data-predictive-search-search-for-text>Ver todos</span></button><div data-search-query-suggestions></div><div class="desktop">${products('desktop')}</div><ul class="compact">${products('compact')}</ul>${empty?'<p data-search-empty>Sin resultados</p>':''}<span hidden data-predictive-search-live-region-count-value>${ids.length} productos</span></div></div>`;
}
before(async()=>{
 const source=await readFile(new URL('assets/global.js',root),'utf8');
 const helpersEnd=source.indexOf('({init:'),start=source.indexOf('var I=function(e)'),endToken='customElements.define("main-search",R)',end=source.indexOf(endToken);
 assert.ok(helpersEnd>0&&end>start);
 realSearch=source.slice(0,helpersEnd)+'window.debounce=(fn,ms)=>{let id;return(...args)=>{clearTimeout(id);id=setTimeout(()=>fn(...args),ms)}};'+source.slice(start,end+endToken.length)+';})();';
 server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/assets/')){res.setHeader('Content-Type','text/javascript');res.end(await readFile(new URL(url.pathname.slice(1),root)));return;}
  if(url.pathname==='/global-search.js'){res.setHeader('Content-Type','text/javascript');res.end(realSearch);return;}
  if(url.searchParams.has('section_id')){
   const q=url.searchParams.get('q'),queryOnly=url.pathname==='/search/suggest';requests.push({q,queryOnly,params:url.searchParams.toString()});
   if(q==='slow'||queryOnly&&q==='casco')await new Promise(resolve=>setTimeout(resolve,1100));
   if(!queryOnly&&q==='error'){res.writeHead(503);res.end('Error');return;}
   res.setHeader('Content-Type','text/html');
   if(queryOnly){
    const related=q==='90/100-10'?'CEAT 90/100-10':'related';
    const unsafe=q==='90/100-10'?'<li id="wrong-size" role="option"><a class="predictive-search__suggestion" href="/search?q=100+90+19">100 90 19</a></li><li id="same-size" role="option"><a class="predictive-search__suggestion" href="/search?q=90+100+10">90 100 10</a></li>':'';
    res.end(`<div id="shopify-section-search-query-suggestions"><div data-search-query-suggestions-response data-query="${escape(q)}"><ul class="predictive-search__suggestions"><li id="suggestion" role="option" aria-selected="false"><a class="predictive-search__suggestion" href="/search?q=${encodeURIComponent(related)}">Relacionado ${escape(q)}</a></li>${unsafe}</ul></div></div>`);
   }
   else res.end(q==='invalid'?'<div>Invalid</div>':result(url.searchParams));return;
  }
  res.setHeader('Content-Type','text/html');res.end(fixture());
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({headless:true,channel:'chrome'});
});
after(async()=>{await browser?.close();server?.closeAllConnections();if(server)await new Promise(resolve=>server.close(resolve));});
async function pageFor(t,mobile=false){const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:900}});t.after(()=>page.close());await page.goto(origin);await page.waitForFunction(()=>customElements.get('predictive-search')?.prototype.getSearchResults.toString().includes('querySuggestions'));return page;}
const input=page=>page.locator('#query');
async function fillResult(page,text){await input(page).fill(text);await page.waitForFunction(()=>document.querySelector('predictive-search').dataset.searchPreviewStatus==='success'&&document.querySelector('.search-preview-v2'));}
for(const mobile of[false,true]){
 test(`exact product, preserved separate layouts and visible keyboard navigation (${mobile?'mobile':'desktop'})`,async t=>{
  const page=await pageFor(t,mobile);await fillResult(page,'90/100-10');
  assert.equal(await input(page).inputValue(),'90/100-10');
  assert.equal(await page.locator(`[id^=${mobile?'compact':'desktop'}-]`).count(),1);
  await page.locator('.predictive-search__suggestion').waitFor();
  await input(page).press('ArrowDown');assert.equal(await input(page).getAttribute('aria-activedescendant'),'view-all');
  await input(page).press('ArrowDown');assert.equal(await input(page).getAttribute('aria-activedescendant'),'suggestion');
  await input(page).press('ArrowDown');assert.equal(await input(page).getAttribute('aria-activedescendant'),`${mobile?'compact':'desktop'}-0`);
  await input(page).press('Enter');await page.waitForURL('**/products/CEAT');
 });
 test(`Enter after rendering excludes embedded purchase fields (${mobile?'mobile':'desktop'})`,async t=>{
  const page=await pageFor(t,mobile);await fillResult(page,'90/100-10');
  const data=await page.evaluate(()=>[...new FormData(document.querySelector('#query').form)]);
  assert.ok(data.some(([key])=>key==='keep'));assert.ok(!data.some(([key])=>['id','form_type','product-id'].includes(key)));
  await input(page).press('Enter');await page.waitForURL('**/search?**');const params=new URL(page.url()).searchParams;
  assert.equal(params.get('q'),'*');assert.equal(params.get('filter.p.m.custom.ancho'),'90.0');assert.equal(params.get('filter.p.m.custom.di_metro'),'10');assert.equal(params.get('keep'),'yes');assert.ok(!params.has('product-id')&&!params.has('id')&&!params.has('form_type'));
 });
}
test('optional slow suggestions do not delay products or change an active keyboard selection',async t=>{
 const page=await pageFor(t);const start=performance.now();await fillResult(page,'casco');assert.ok(performance.now()-start<1000);
 assert.equal(await page.locator('.predictive-search__suggestion').count(),0);await input(page).press('ArrowDown');await page.waitForTimeout(1200);
 assert.equal(await input(page).getAttribute('aria-activedescendant'),'view-all');assert.equal(await page.locator('.predictive-search__suggestion').count(),0);
});
test('product and suggestion caches avoid repeated requests without stale labels',async t=>{
 const page=await pageFor(t);await fillResult(page,'90/100-10');await page.locator('.predictive-search__suggestion').waitFor();await fillResult(page,'motul 10w40');await page.locator('.predictive-search__suggestion').waitFor();const before=requests.length;
 await fillResult(page,'90/100-10');await page.locator('.predictive-search__suggestion').waitFor();assert.equal(requests.length,before);assert.match(await page.locator('.predictive-search__view-all').textContent(),/90\/100-10/);
});
test('old products and suggestions cannot overwrite a newer query; reset clears both',async t=>{
 const page=await pageFor(t);await input(page).fill('slow');await page.waitForTimeout(350);await fillResult(page,'90/100-10');await page.waitForTimeout(1200);assert.equal(await page.locator('.search-preview-v2').getAttribute('data-search-total'),'1');assert.match(await page.locator('.predictive-search__suggestion').textContent(),/90\/100-10/);
 await page.getByRole('button',{name:'Limpiar'}).click();assert.equal(await input(page).inputValue(),'');assert.equal(await page.locator('.search-preview-v2').count(),0);
});
test('HTTP error, malformed response, mismatched filters and true zero stay distinct; Enter remains usable',async t=>{
 const page=await pageFor(t);
 for(const q of['error','invalid','bad-filter']){await input(page).fill(q);await page.locator('.search-preview-message').waitFor();assert.equal(await page.locator('[data-search-empty]').count(),0);assert.equal(await input(page).inputValue(),q);}
 await fillResult(page,'90/100-99');assert.equal(await page.locator('[data-search-empty]').count(),1);assert.equal(await page.locator('.search-preview-message').count(),0);
 await input(page).fill('90/100-10');await input(page).press('Enter');await page.waitForURL('**/search?**');assert.equal(new URL(page.url()).searchParams.get('filter.p.m.custom.di_metro'),'10');
});
