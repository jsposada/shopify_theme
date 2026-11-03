// The same component fixture as the automated suite, usable through the connected
// browser when Playwright is not installed in the local Node environment.
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('./test-preserved-controller.mjs',import.meta.url),'utf8');
const end = source.indexOf('after(async()=>');
let fixture = source.slice(0,end)
  .replace("import { before, after, test } from 'node:test';",'')
  .replace("const { chromium } = createRequire(import.meta.url)('playwright');",'')
  .replace('before(async()=>{','const start = async()=>{')
  .replace(" browser=await chromium.launch({headless:true,channel:'chrome'});", " console.log(JSON.stringify({fixtureUrl:origin}));")
  .replace(/\}\);\s*$/, '}; await start();');
await import('data:text/javascript;base64,' + Buffer.from(fixture.replaceAll("new URL('./theme/',import.meta.url)",JSON.stringify(new URL('./theme/',import.meta.url).href))).toString('base64'));
