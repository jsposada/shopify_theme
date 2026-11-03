# Candidato final: diseño original conservado

Publicado y verificado el 2026-11-02 en el tema activo **189814309085** de https://www.bikerz.cl/. La copia de desarrollo **190293868765** se conserva como referencia. La evidencia de publicación está en `../publication/`.

Los archivos finales y revisables están en `theme/`. `validation-summary.json` contiene el manifiesto SHA-256, las comprobaciones y las limitaciones. Los scripts de preparación/restauración son auxiliares de esta investigación; no sustituyen el candidato final ni deben ejecutarse antes de un despliegue sin volver a revisar sus resultados.

Se reutilizan sin cambios `product-item-layout-1.liquid`, `header.css` y `search-modal.css`: mismas tarjetas, tipos de letra y adaptación a móvil. El CSS actual ya oculta compra/vista rápida en la vista previa del encabezado; se respeta esa decisión del tema. Los controles de la página completa conservan su comportamiento.

La fuente de productos es la búsqueda normal con filtros reales para medidas/viscosidad. Las sugerencias se consultan aparte, en paralelo y con caché; no deciden qué productos devolver. Se eliminan sugerencias que contradigan atributos explícitos o equivalgan a la consulta actual. Una sugerencia lenta no cambia una selección de teclado ya iniciada.

La medición final está en `results/restored-section-performance.json`: 24 muestras por versión después del calentamiento, con las sugerencias incluidas. Mediana de productos: 485 ms original y 508 ms candidato; p90: 618 y 609 ms. HTML mediano total: 89.9 y 90.2 KB. Son pruebas mediante el proxy de desarrollo, sin garantías para conexiones de clientes. Los resultados de la propuesta compacta anterior ya no describen el candidato final.

La validación final incluye 9 consultas contra Shopify, 24 comprobaciones de precio/variante, paginación 16+16+1 sin omisiones, 13 escenarios del controlador en navegador, 43 pruebas de interpretación y 6 de analítica. Los Liquid modificados tienen cero errores de Theme Check; persisten errores anteriores en otras partes del tema.

Para repetir la comprobación de servidor: `node validate-real-render.mjs`. Para los escenarios de interfaz se dispone de `serve-controller-fixture.mjs` y `test-preserved-controller.mjs`; esta última requiere instalar Playwright. En esta revisión se usó el navegador conectado para los escenarios finales porque el módulo no estaba disponible y su instalación no pudo completarse.

Para próximos despliegues: refrescar el diccionario con `refresh-catalog.mjs`, validar el candidato contra el tema publicado vigente y transferir exclusivamente los archivos del manifiesto. No subir la copia completa del tema, que podría incluir contenido ajeno a este cambio. En este despliegue se transfirieron 12 archivos; la copia descargada de producción coincide en SHA-256 con el candidato y con la raíz del repositorio.
