# Auditoría de rendimiento 2.4 — 2026-09-04

## Alcance

- Página evaluada: `https://www.bikerz.cl/`.
- Herramientas: PageSpeed Insights, Lighthouse, inventario de recursos del navegador, revisión del DOM y Shopify Theme Check.
- Entorno de cambios: copia local, theme de desarrollo y theme live `SEO` (`164560142557`). Los cambios aprobados se publicaron el 2026-09-04.

## Línea base pública

Informe de PageSpeed Insights: <https://pagespeed.web.dev/analysis/https-www-bikerz-cl/7mf4ctc9nu?form_factor=mobile>

### Datos reales de usuarios — últimos 28 días

| Métrica | Móvil | Escritorio |
| --- | ---: | ---: |
| LCP | 2,2 s | Sin datos suficientes |
| INP | 127 ms | 108 ms |
| CLS | 0,13 | 0,28 |
| FCP | 1,6 s | 1,5 s |
| TTFB | 0,7 s | Sin datos suficientes |

La evaluación de Core Web Vitals no está aprobada. En móvil, LCP e INP están dentro de los umbrales, pero CLS supera 0,10. En escritorio, el CLS observado también supera el umbral.

### Laboratorio — una ejecución diagnóstica

| Métrica | Móvil | Escritorio |
| --- | ---: | ---: |
| Rendimiento | 72 | 80 |
| FCP | 2,1 s | 0,8 s |
| LCP | 4,9 s | 0,9 s |
| TBT | 0 ms | 30 ms |
| CLS | 0,16 | 0,334 |
| Speed Index | 3,6 s | 1,6 s |
| Payload total | 2.695 KiB | 3.349 KiB |
| Trabajo del hilo principal | 4,6 s | 5,1 s |

Estos valores son diagnósticos y no sustituyen las tres ejecuciones por dispositivo previstas en 2.5.

## Hallazgos

### 1. Shopify Forms explica el aviso completo de JavaScript no utilizado

- Recurso: `forms-2546/assets/index.js` de Shopify Forms.
- Transferencia: 252,3 KiB.
- Ahorro estimado por Lighthouse: 239,3 KiB.
- El bloque inline de Forms presente en la home tiene `form_id` vacío y no muestra contenido propio.
- El app embed global sí tiene una función visible: muestra el aviso promocional `10% de descuento` y abre el formulario configurado por Shopify Forms.
- Shopify Forms se conserva para no eliminar la captación promocional existente.

### 2. Exceso de preloads explícitos

- El theme marcaba 16 hojas de estilo con `stylesheet_tag: preload: true`.
- La mayoría ya aparece en el HTML y Shopify prioriza automáticamente los recursos bloqueantes del `<head>`.
- Se retiró únicamente el parámetro `preload`; las hojas de estilo continúan cargándose como antes.

### 3. Scripts globales sin uso en la home

- `collection-main.js` solo corresponde a colección y búsqueda.
- `product-grid.js` solo corresponde a la sección Product grid y a la carga incremental del blog.
- `wishlist.js` no tiene botones que inicializar en la configuración actual de la home.
- `compare.js` estaba referenciado, pero no existe en la copia local y la función Comparar está desactivada.
- Se movieron los dos primeros scripts a las secciones que los usan, se condicionó Wishlist y se eliminó la referencia rota a Compare.

### 4. Animaciones no compuestas

- Lighthouse detectó 12 imágenes cuya transición incluía `aspect-ratio` por el uso global de una transición sobre todas las propiedades.
- Se limitó esa transición a `transform` y `opacity`, conservando los efectos visuales de zoom, desplazamiento y cambio de imagen.
- La comprobación Lighthouse local posterior pasó de 12 elementos detectados a uno. El único caso restante corresponde al movimiento del carrusel Swiper de marcas.

### 5. Carruseles y clones

- La home inicializa cinco carruseles Swiper.
- El carrusel de marcas crea 12 clones porque usa autoplay y loop.
- El carrusel de productos crea 10 clones por la misma razón.
- Total: 22 slides duplicados en el DOM.
- No se cambió autoplay ni loop porque alteraría el comportamiento visible aprobado; queda como decisión opcional del propietario.

### 6. CLS

- En la ejecución de escritorio, 0,331 de los 0,334 puntos de CLS afectaron a la sección `Conoce nuestros productos`.
- El informe también identifica el cambio tardío de las fuentes Oswald y Barlow.
- Este punto requiere una medición comparativa en 2.5 antes de atribuir la causa únicamente al carrusel o modificar tipografías.

### 7. Módulo antiguo de compras recientes

- El theme cargaba siempre la sección interna `Fake Order` o `someone-purchased`.
- Sus tres productos configurados ya no existen, por lo que generaba una imagen vacía, CSS, un temporizador y JavaScript sin posibilidad de mostrar contenido válido.
- Se corrigió la condición para cargar el módulo únicamente cuando exista al menos un producto válido.
- La función permanece disponible: si en el futuro se configura un producto real, el módulo vuelve a renderizarse normalmente.

## Cambios locales preparados

- `snippets/head-assets.liquid`: se retiran preloads explícitos y se restringen transiciones de imágenes.
- `snippets/scripts-tag.liquid`: se eliminan cargas globales innecesarias.
- `sections/main-collection-product-grid.liquid`: carga local de `collection-main.js`.
- `sections/main-search.liquid`: ya cargaba `collection-main.js`; no necesitó cambios.
- `sections/product-grid.liquid` y `sections/main-blog.liquid`: carga local de `product-grid.js`.
- `snippets/tp-modal-quickview.liquid`, `sections/someone-purchased.liquid` y `snippets/tool-demos.liquid`: retiro del preload explícito, sin retirar el CSS.

## Estado de validación

- `git diff --check`: correcto.
- JSON del theme: correcto.
- Shopify Theme Check: los archivos cambiados no incorporan errores nuevos. El theme conserva errores históricos fuera del alcance de 2.4.
- Theme de desarrollo `165034229981`: sincronizado mediante Shopify CLI con `--nodelete`.
- Home: un H1 visible, sin desbordamiento horizontal, cero nodos o estilos del módulo inválido de compras recientes, scripts globales retirados y transiciones limitadas correctamente.
- Colección de neumáticos: 20 productos, filtros presentes y `collection-main.js` cargado localmente.
- Búsqueda `michelin`: 16 resultados visibles, filtros presentes y `collection-main.js` cargado localmente.
- Ficha de producto: el botón Añadir al carrito abrió el drawer sin errores y mostró un producto.
- Compra rápida: el endpoint del producto devolvió el modal y su formulario; el script necesario continúa cargado en la home.
- Lighthouse local: el resultado global no es comparable con producción por la sobrecarga del proxy de desarrollo y la variabilidad de terceros; sí confirmó la reducción de animaciones no compuestas de 12 a una.
- Aprobación visual del propietario: completada el 2026-09-04.
- Publicación: completada el 2026-09-04 en el theme live `SEO` (`164560142557`) mediante un push limitado a ocho archivos, con `--nodelete` y `--allow-live`.
- Control previo: se descargaron desde producción los ocho archivos objetivo. En `sections/someone-purchased.liquid` se detectó una modificación local anterior y ajena a 2.4; se excluyó del despliegue y se preservó el valor remoto de `data-url`.
- Integridad posterior: se volvieron a descargar los ocho archivos publicados y sus hashes SHA-256 coinciden con el paquete exacto de despliegue.
- Home pública: usa los assets del theme activo `/cdn/shop/t/18/`, mantiene un único H1 visible, no presenta desbordamiento horizontal y no carga `collection-main.js`, `product-grid.js`, `wishlist.js`, `compare.js` ni recursos del módulo inválido de compras recientes. Conserva `product-form.js`, `quick-view.js` y Swiper; la transición auditada quedó limitada a `transform, opacity`.
- Colección pública `/collections/neumaticos`: un H1 visible, 20 productos, filtros presentes, `collection-main.js` cargado y sin desbordamiento horizontal.
- Búsqueda pública `michelin`: resultados presentes, `collection-main.js` cargado, sin desbordamiento horizontal y sin errores de consola durante la comprobación.
- La medición comparativa definitiva posterior al despliegue corresponde al paso 2.5 y permanece pendiente.
