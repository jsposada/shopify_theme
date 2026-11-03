# Buscador publicado el 2026-11-02

Se publicó la corrección del buscador en el tema activo **189814309085** de **www.bikerz.cl**, con autorización explícita del propietario. Se transfirieron únicamente los 12 archivos del manifiesto de búsqueda, con `--nodelete`. No se sustituyó el tema completo.

Las medidas y viscosidades reconocidas se convierten en filtros reales; la vista previa y Enter utilizan la búsqueda normal de Shopify con los mismos criterios. Se conservan el diseño, las tarjetas de escritorio y las filas móviles del tema. Las sugerencias se consultan en paralelo y se descartan las que contradicen una medida explícita. La paginación respeta los 16 productos configurados y deja de omitir resultados entre páginas.

## Comprobaciones

- Los 12 archivos descargados del tema publicado coinciden por SHA-256 con los validados y con los archivos de la raíz del repositorio.
- En la tienda pública, `90/100-10` muestra exclusivamente **CEAT ZOOM D 90/100-10 TL 53J** en la vista previa y al presionar Enter; el título conserva la medida legible.
- En esta revisión pasaron 43 pruebas de interpretación y 6 de analítica, además de las comprobaciones previas de interfaz y del renderizado real. La suite general `scripts/test-search-analytics.mjs` no pudo iniciarse porque Playwright no está instalado; la comprobación posterior a publicar se realizó en el navegador conectado.
- Theme Check reporta cero errores en los archivos Liquid del buscador. El tema completo conserva incidencias ajenas a este despliegue.
- Medición de desarrollo, 24 muestras por versión: mediana 485 ms original y 508 ms candidato; p90 618 y 609 ms. No representa una garantía de latencia en conexiones de clientes.

## Evidencia y respaldo

- [Verificación de archivos](../../output/search-review/2026-11-02/publication/remote-verification.json).
- [Comprobación del navegador público](../../output/search-review/2026-11-02/publication/browser-verification.json).
- [Captura de la vista previa publicada](../../output/search-review/2026-11-02/publication/live-preview.jpg).
- [Informe de validación](../../output/search-review/2026-11-02/shopify-validation/validation-summary.json).

El respaldo local previo está en `.tmp/search-publish-20261102-before/`, excluido de Git. Conserva los archivos existentes antes de publicar; los seis archivos añadidos por este despliegue están identificados en el manifiesto. Una reversión debe restaurar los archivos previos y retirar las referencias a los nuevos assets.

## Otros cambios pendientes incluidos en Git

Se conservan las correcciones previas de `main-product.liquid`, `product-item-horizontal.liquid` y `404.json`, la actualización de la auditoría y los informes de rendimiento. Estos tres archivos del tema no se publicaron en este despliegue; su contenido en producción se comprobó idéntico al respaldo previo. Su publicación y validación específica siguen pendientes.
