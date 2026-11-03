import { readFile, writeFile, mkdir } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:9297';
const folder=new URL('./results/',import.meta.url);await mkdir(folder,{recursive:true});
const home=await(await fetch(base)).text();
const config=JSON.parse(home.match(/<script id="bikerz-search-catalog"[^>]*>([\s\S]*?)<\/script>/)[1]);
assert.equal(config.theme,190293868765);assert.ok(config.profiles.length&&config.rims.length&&config.viscosities['10W-40']);
const context={window:{},document:{getElementById:()=>({textContent:JSON.stringify(config)})},URLSearchParams};vm.createContext(context);vm.runInContext(await readFile(new URL('./theme/assets/search-policy.js',import.meta.url),'utf8'),context);
const plan=raw=>context.window.bikerzSearchV2.plan(raw);
const decode=value=>value.replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
function products(html){return [...html.matchAll(/<li\b[^>]*data-search-product-id="(\d+)"[^>]*>([\s\S]*?)<\/li>/g)].map(m=>{
 const tag=m[0].slice(0,m[0].indexOf('>')+1),body=m[2],attr=name=>tag.match(new RegExp(`data-${name}="([^"]*)"`))?.[1];
 return{id:m[1],variant:attr('variant-id'),price:Number(attr('price')),compare:Number(attr('compare-price')),available:attr('available')==='true',title:decode(body.match(/class="predictive-search__compact-title">([^<]*)/)?.[1]||''),url:decode(body.match(/<a href="([^"]*)"/)?.[1]||''),image:decode(body.match(/src="([^"]*)"/)?.[1]||''),badge:body.match(/class="predictive-search__compact-badge">([^<]*)/)?.[1],soldout:body.includes('predictive-search__compact-soldout')};});}
async function section(raw){const p=plan(raw),url=new URL('/search',base);url.search=p.params;url.searchParams.set('section_id','search-preview');const started=performance.now(),r=await fetch(url,{signal:AbortSignal.timeout(30000)}),html=await r.text();assert.equal(r.status,200);assert.ok(!html.includes('Liquid error'));return{raw,plan:p,html,ms:performance.now()-started,products:products(html),total:Number(html.match(/data-search-total="(\d+)"/)?.[1]??NaN)};}
const validation=[];
for(const raw of ['90/100-10','90 100 10','120/70ZR17','motul 10w40','90/100-1','casco nolan','title:"DUNLOP SPORTMAX Q5A 120/70ZR17"','title:"MICHELIN PILOT ROAD 5 180/55ZR17"','90/100-99']){
 const row=await section(raw);assert.ok(row.products.length<=5);assert.ok(!/<script\b/.test(row.html));
 assert.equal((row.html.match(/id="predictive-search-option-product-\d+"/g)||[]).length,row.products.length);
 assert.equal((row.html.match(/class="tp-prd-item /g)||[]).length,row.products.length);
 const checks=[];
 for(const product of row.products){const url=new URL(product.url,base);const apiUrl=new URL(url.pathname+'.js',base);const response=await fetch(apiUrl,{signal:AbortSignal.timeout(20000)});const json=await response.json();const variant=json.variants.find(v=>String(v.id)===product.variant);assert.ok(variant,`Variant exists: ${product.title}`);assert.equal(product.price,variant.price);assert.equal(product.compare,variant.compare_at_price||0);assert.equal(product.available,variant.available);assert.equal(product.soldout,!variant.available);assert.equal(product.title,json.title);assert.ok(product.image);
  if(product.compare>product.price)assert.equal(product.badge,`-${Math.round((product.compare-product.price)*100/product.compare)}%`);else assert.equal(product.badge,undefined);
  checks.push({id:product.id,title:product.title,price:product.price,available:product.available,sale:product.compare>product.price,variantMatches:true});
 }
 if(raw==='90/100-10'||raw==='90 100 10'){assert.equal(row.total,1);assert.equal(row.products[0].id,'9592944885981');}
 if(raw==='90/100-99')assert.equal(row.total,0);
 if(raw==='motul 10w40')assert.ok(row.products.every(p=>/MOTUL/.test(p.title)&&/10W-?40/.test(p.title)));
 if(raw==='120/70ZR17')assert.ok(row.products.every(p=>p.title.includes('120/70ZR17')));
 if(raw==='90/100-1')assert.ok(row.products.every(p=>/90\/100-1\d/.test(p.title)));
 await writeFile(new URL(`restored-case-${validation.length+1}.html`,folder),row.html);
 validation.push({raw,total:row.total,shown:row.products.length,bytes:Buffer.byteLength(row.html),checks});console.log(JSON.stringify({raw,total:row.total,checked:checks.length}));
 await new Promise(r=>setTimeout(r,300));
}
const pages=[];for(const page of[1,2,3]){const url=new URL('/search',base);url.search=plan('120/70-17').params;url.searchParams.set('page',String(page));const html=await(await fetch(url)).text();const meta=html.match(/data-search-results-metadata[\s\S]*?>/)?.[0]||'';pages.push({page,total:Number(meta.match(/data-total="(\d+)"/)?.[1]),ids:meta.match(/data-product-ids="([^"]*)"/)?.[1].split(',').filter(Boolean)||[],positions:[...html.matchAll(/class="bikerz-product-card__image-link"\s+href="([^"]*)"/g)].map(m=>Number(m[1].match(/[?&]_pos=(\d+)/)?.[1]))});}
assert.equal(new Set(pages.flatMap(p=>p.ids)).size,pages[0].total);assert.deepEqual(pages.flatMap(p=>p.positions),Array.from({length:pages[0].total},(_,i)=>i+1));
await writeFile(new URL('restored-render-validation.json',folder),JSON.stringify({capturedAt:new Date().toISOString(),config,validation,pagination:pages,pass:true},null,2));
const rows=[],queries=['90/100-10','120/70-17','90/100','motul 10w40','casco integral','honda cb 190'];
for(let round=-1;round<4;round++){
 for(const raw of queries){for(const mode of round%2===0?['legacy','preserved']:['preserved','legacy']){
  let url;if(mode==='preserved'){url=new URL('/search',base);url.search=plan(raw).params;url.searchParams.set('section_id','search-preview');}else{url=new URL('/search/suggest',base);url.searchParams.set('q',raw==='motul 10w40'?'motul (10W40 OR 10W-40)':raw);url.searchParams.set('section_id','predictive-search');}
  const started=performance.now();
  const queryUrl=new URL('/search/suggest',base);queryUrl.search=new URLSearchParams({q:raw,'resources[type]':'query','resources[limit]':'3',section_id:'search-query-suggestions'});
  const queryResponse=mode==='preserved'?fetch(queryUrl,{signal:AbortSignal.timeout(20000)}).then(async r=>{assert.equal(r.status,200);const html=await r.text();return{ms:Math.round(performance.now()-started),bytes:Buffer.byteLength(html)};}):Promise.resolve(null);
  const r=await fetch(url,{signal:AbortSignal.timeout(20000)}),html=await r.text();assert.equal(r.status,200);const ms=Math.round(performance.now()-started),suggestions=await queryResponse;
  rows.push({round,raw,mode,ms,allContentMs:Math.max(ms,suggestions?.ms||0),bytes:Buffer.byteLength(html)+(suggestions?.bytes||0),suggestions});await new Promise(r=>setTimeout(r,200));
 }}console.log(`Performance ${round<0?'warmup':round+1}/4`);
}
const percentile=(values,p)=>values.sort((a,b)=>a-b)[Math.ceil(values.length*p)-1];
const summary=Object.fromEntries(['legacy','preserved'].map(mode=>{const data=rows.filter(r=>r.round>=0&&r.mode===mode);return[mode,{samples:data.length,medianMs:percentile(data.map(r=>r.ms),.5),p90Ms:percentile(data.map(r=>r.ms),.9),medianAllContentMs:percentile(data.map(r=>r.allContentMs),.5),p90AllContentMs:percentile(data.map(r=>r.allContentMs),.9),medianKB:Math.round(percentile(data.map(r=>r.bytes),.5)/102.4)/10}]}));
await writeFile(new URL('restored-section-performance.json',folder),JSON.stringify({method:'Original cards retained. Actual Shopify via the same CLI development proxy, four rounds after warmup. Candidate includes an optional query-only request in parallel, included in total bytes and all-content timing. Product rendering never waits for it. Cold client cache; no production guarantees.',summary,rows},null,2));console.log(JSON.stringify({pass:true,summary,pagination:pages.map(({page,total,ids})=>({page,total,shown:ids.length}))}));
