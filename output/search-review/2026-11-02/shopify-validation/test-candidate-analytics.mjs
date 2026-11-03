import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';
const require=createRequire(import.meta.url);
const contract=require('./theme/assets/search-analytics-contract.js');
const source=await readFile(new URL('./theme/assets/search-analytics.js',import.meta.url),'utf8');
const uuid='a47f2bf6-4314-4041-a33e-870718cae6c1';
function fixture({consent=true,enabled=true,results=false}={}) {
 const events=[],listeners=new Map(),storage=new Map();
 const node={textContent:JSON.stringify({enabled,language:'es',country:'CL'}),dataset:{}};
 const root={dataset:{query:'*',productsReturned:'1'},querySelectorAll(selector){return selector==='[data-search-product-id]'?[{dataset:{searchProductId:'101'},getClientRects:()=>[{}]}]:[]}};
 const metadata=results?{dataset:{query:'*',total:'33',resourceTypes:'product',page:'2',pageSize:'16',displayLimit:'16',productIds:'101,'}}:null;
 const form={closest:selector=>selector==='.header__search'?{}:null};
 const element={input:{form},isOpen:true,getQuery:()=> '90/100-10',getClientRects:()=>[{}],predictiveSearchResults:{querySelector:()=>root}};
 const api={plan:()=>({params:'q=*&type=product&filter.p.m.custom.ancho=90.0&filter.p.m.custom.aspecto=100&filter.p.m.custom.di_metro=10'}),normalize:()=>({query:'*',submitQuery:'*'})};
 const context={window:{crypto:webcrypto,BikerzSearchContract:contract,bikerzSearchV2:api,Shopify:{customerPrivacy:{analyticsProcessingAllowed:()=>consent},analytics:{publish:(name,data)=>{events.push({name,data});return true;}}},addEventListener(){}},
  document:{readyState:'complete',getElementById:()=>node,querySelector:selector=>selector==='[data-search-results-metadata]'?metadata:null,addEventListener:(name,fn)=>{if(!listeners.has(name))listeners.set(name,[]);listeners.get(name).push(fn);}},
  location:{href:'https://test.invalid/search?q=*',origin:'https://test.invalid',search:'?q=*'},
  sessionStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
  customElements:{whenDefined(){throw new Error('New retrieval must not be replaced by analytics');}},
  requestAnimationFrame:callback=>callback(),performance:{now:()=>100},URL,URLSearchParams,setTimeout:()=>{},queueMicrotask,
 };
 vm.createContext(context);vm.runInContext(source,context);
 const emit=(name,detail)=>{for(const fn of listeners.get(name)||[])fn({detail});};
 const detail={element,raw:'90/100-10',requestId:uuid,source:'network',started:80};
 return{events,emit,detail,storage,api,context};
}
test('candidate preview keeps original text and exact filters in the analytics contract',()=>{
 const f=fixture();f.emit('bikerz:search-preview-v2',f.detail);assert.equal(f.events.length,1);const data=f.events[0].data;
 assert.equal(data.query_text,'90/100-10');assert.equal(data.predictive_query,'*');assert.equal(data.products_shown,1);assert.equal(data.normalization_version,'2');assert.ok(data.search_options.some(p=>p.name==='filter.p.m.custom.di_metro'&&p.value==='10'));assert.ok(contract.project(f.events[0].name,data));
});
test('candidate does not replace retrieval when analytics is disabled',()=>{const f=fixture({enabled:false});assert.equal(f.context.window.bikerzSearchAnalytics,undefined);assert.equal(f.context.window.bikerzSearchV2,f.api);});
test('consent denial publishes and stores nothing',()=>{const f=fixture({consent:false});f.emit('bikerz:search-preview-v2',f.detail);assert.equal(f.events.length,0);assert.equal(f.storage.size,0);});
test('preview observation remains deduplicated',()=>{const f=fixture();f.emit('bikerz:search-preview-v2',f.detail);f.emit('bikerz:search-preview-v2',{...f.detail,source:'cache'});assert.equal(f.events.length,1);});
test('candidate HTTP errors remain errors rather than zero-product previews',()=>{const f=fixture();f.emit('bikerz:search-preview-v2-error',{...f.detail,code:'http_error',httpStatus:503});assert.equal(f.events.length,1);assert.equal(f.events[0].name,'bikerz:search_preview_error');assert.equal(f.events[0].data.products_returned,null);assert.ok(contract.project(f.events[0].name,f.events[0].data));});
test('result observations use the actual 16-product page size after the pagination fix',()=>{const f=fixture({results:true});assert.equal(f.events.length,1);assert.equal(f.events[0].data.page_size,16);assert.equal(f.events[0].data.page,2);assert.equal(f.events[0].data.result_count,33);assert.ok(contract.project(f.events[0].name,f.events[0].data));});
