import { readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root=new URL('./',import.meta.url),read=path=>readFile(new URL(path,root),'utf8'),json=async path=>JSON.parse(await read(path));
const summary=await json('validation-summary.json');
summary.updatedAt=new Date().toISOString();
summary.revision='original-design-preserved';
summary.validation={
 queryPolicyTests:{passed:43,failed:0},analyticsTests:{passed:6,failed:0},
 realRenderer:await json('results/restored-render-validation.json'),
 controllerBrowserChecks:await json('results/restored-controller-browser-checks.json'),
 enterAfterCards:await json('results/restored-enter-validation.json'),
 desktop:{width:1280,height:900,cards:5,overflow:false,compactListHidden:true,screenshot:'results/restored-desktop.jpg'},
 mobile:{width:390,height:844,rows:5,inputFont:'16px',overflow:false,desktopGridHidden:true,allFiveImagesLoaded:true,screenshot:'results/restored-mobile.jpg'},
 exactCase:{productId:'9592944885981',title:'CEAT ZOOM D 90/100-10 TL 53J',total:1,screenshot:'results/restored-desktop-exact.jpg'},
};
const findings=await json('results/restored-theme-check.json');
const modified=['snippets/scripts-tag.liquid','assets/search-normalize.js','assets/search-analytics.js','snippets/search-display-term.liquid','snippets/search-results-metadata.liquid','sections/main-search.liquid'];
const added=['assets/search-policy.js','assets/search-preview.js','assets/search-preview.css','snippets/search-catalog-config.liquid','sections/search-preview.liquid','sections/search-query-suggestions.liquid'];
const liquidFiles=[...modified,...added].filter(path=>path.endsWith('.liquid'));
const changed=findings.filter(row=>liquidFiles.some(path=>row.path.replaceAll('\\','/').endsWith('/'+path)));
summary.validation.changedLiquidErrors=changed.reduce((count,row)=>count+row.errorCount,0);
if(summary.validation.changedLiquidErrors)throw new Error('Changed Liquid contains errors');
summary.performance=await json('results/restored-section-performance.json');
summary.addedAssets=await Promise.all(added.filter(path=>path.startsWith('assets/')).map(async path=>({name:path.split('/').at(-1),bytes:(await stat(new URL('theme/'+path,root))).size})));
summary.design={
 originalRenderer:'snippets/product-item-layout-1.liquid',
 unchangedFiles:['assets/header.css','assets/search-modal.css','snippets/product-item-layout-1.liquid','snippets/button-quick-view.liquid'],
 notes:'Original theme styles and product card renderer reused. Header search already hides purchase/quick-view actions through header.css; this behavior is preserved. Full result-page controls are unchanged. Technical suggestions contradicting explicit attributes or duplicating the same plan are excluded; general suggestions remain.',
};
summary.customerChanges=[
 'Se conservan tipografías, colores, tarjetas de escritorio y filas compactas de móvil del tema actual.',
 'La medida y viscosidad pasan a ser filtros reales tanto en la vista previa como al presionar Enter.',
 'Las sugerencias no modifican la búsqueda de productos y se descartan las que contradicen una medida o repiten la misma búsqueda.',
 'Las sugerencias se consultan en paralelo; no retrasan los productos ni se insertan después de iniciar una selección por teclado.',
 'Los errores de carga se distinguen de una búsqueda sin coincidencias; Enter sigue disponible.',
 'La paginación usa el tamaño configurado, sin omitir productos entre páginas.'
];
summary.limitations=[
 'Mediciones a través del proxy oficial de desarrollo, con 24 muestras por versión después del calentamiento; no garantizan tiempos en conexiones reales de clientes.',
 'La versión final conserva el HTML de las tarjetas originales: no aplica la reducción de HTML de la propuesta compacta descartada.',
 'En consultas sin caché se agrega una solicitud opcional solo para sugerencias, en paralelo. Una sugerencia lenta puede aparecer después de los productos.',
 'Prueba móvil con viewport de 390px; no se midió un dispositivo físico ni su teclado.',
 'El diccionario de atributos debe regenerarse antes de publicar y al introducir valores nuevos en el catálogo.',
 'Theme Check conserva errores anteriores fuera de los archivos modificados.',
 'La suite adicional de Playwright no se ejecutó por dependencia ausente; los escenarios relevantes del controlador final se verificaron con el navegador conectado y el mismo servidor de fixtures.'
];
summary.deployment='Solo tema de desarrollo 190293868765. Sin publicación ni cambios del buscador en la raíz del repositorio.';
summary.files=await Promise.all([...modified,...added].map(async path=>({path,kind:modified.includes(path)?'modified':'added',sha256:createHash('sha256').update(await readFile(new URL('theme/'+path,root))).digest('hex')})));
await writeFile(new URL('validation-summary.json',root),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({status:summary.status,queries:summary.validation.realRenderer.validation.length,priceChecks:summary.validation.realRenderer.validation.reduce((sum,row)=>sum+row.checks.length,0),controllerChecks:summary.validation.controllerBrowserChecks.checks.length,changedLiquidErrors:summary.validation.changedLiquidErrors,performance:summary.performance.summary}));
