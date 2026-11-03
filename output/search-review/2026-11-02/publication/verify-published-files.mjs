import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../../../../',import.meta.url);
const hash=async path=>createHash('sha256').update(await readFile(new URL(path,root))).digest('hex');
const manifest=JSON.parse(await readFile(new URL('../shopify-validation/validation-summary.json',import.meta.url),'utf8'));
assert.equal(manifest.files.length,12);
const publishedFiles=[];
for(const file of manifest.files){
 const sha256=await hash('.tmp/search-publish-20261102-after/'+file.path);
 assert.equal(sha256,file.sha256,'Published file must match validated candidate: '+file.path);
 assert.equal(await hash(file.path),sha256,'Root file must match published file: '+file.path);
 publishedFiles.push({path:file.path,sha256,matches:true});
}
const otherPendingChanges=[];
for(const path of ['sections/main-product.liquid','snippets/product-item-horizontal.liquid','templates/404.json']){
 assert.equal(await hash('.tmp/search-publish-20261102-after/'+path),await hash('.tmp/search-publish-20261102-before/'+path));
 otherPendingChanges.push({path,productionUnchanged:true,includedInGit:true});
}
const result={verifiedAt:new Date().toISOString(),store:'996356-ea.myshopify.com',theme:189814309085,publishedFiles,otherPendingChanges,pass:true};
await writeFile(new URL('./remote-verification.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({publishedFilesVerified:publishedFiles.length,otherFilesUnchanged:otherPendingChanges.length,pass:true}));
