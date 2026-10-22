# Hallazgos — fase pública de la auditoría web

- **Fecha:** 2026-10-22
- **Plan:** [PLAN-AUDITORIA-INTEGRAL-2026-10-22.md](PLAN-AUDITORIA-INTEGRAL-2026-10-22.md)
- **Alcance de esta fase:** todo lo que se puede revisar sin accesos de administración: sitio público en móvil (375 × 812), DNS y correo, cabeceras, páginas legales, catálogo público (`products.json`), búsqueda, datos estructurados y código del theme.
- **Método:** solo lectura. No se agregó nada al carrito ni se envió ningún formulario, para no contaminar GA4, Meta ni Google Ads con eventos de prueba.
- **Pendiente por falta de accesos:** embudo y abandono de checkout (A), conciliación de eventos (D), cuentas, apps y permisos (I), Merchant Center (C).

## Resumen

| ID | Hallazgo | Severidad | Esfuerzo |
| --- | --- | --- | --- |
| AUD-A-01 | En móvil, el botón «Añadir al carrito» queda tapado por tres elementos flotantes | Crítica | S–M |
| AUD-A-02 | «Última unidad» depende de un metacampo de proveedor, no del stock, y aparece en productos agotados | Alta | S |
| AUD-E-01 | Medición y remarketing activos sin banner de consentimiento y con consentimiento concedido por defecto | Alta | M |
| AUD-E-02 | Las políticas publicadas se contradicen en plazos de cambio y de reembolso | Alta | S |
| AUD-G-01 | El JSON-LD de producto emite una disponibilidad inválida en todos los productos con stock | Alta | S |
| AUD-C-01 | Ninguno de los 624 neumáticos tiene código de barras (GTIN) | Alta | L |
| AUD-A-03 | La ficha no informa costo ni plazo de despacho, medios de pago ni garantía | Media | M |
| AUD-B-01 | La búsqueda es demasiado amplia con medidas y no avisa cuando una marca no existe | Media | M |
| AUD-E-03 | Hay dos políticas de privacidad y dos términos y condiciones distintos; el footer enlaza la versión más débil | Media | S |
| AUD-I-01 | DMARC solo en modo monitoreo; DKIM no verificable con selectores comunes | Media | S |
| AUD-B-02 | La búsqueda predictiva y la página de resultados no siempre coinciden | Baja | S |
| AUD-E-04 | El footer no enlaza las políticas de devoluciones y despacho | Baja | S |
| AUD-J-01 | La página 404 y las plantillas de cuenta muestran texto en inglés y de demo | Media | S |
| AUD-J-02 | Restos de Opinew renderizan estrellas vacías y un botón sin nombre útil en tarjetas de producto | Media | S |
| AUD-J-03 | `animate.css` (61 KB) se carga en todas las páginas y bloquea el renderizado | Media | S |
| AUD-J-04 | Código y assets muertos: 4 snippets, unas 20 secciones, 13 assets y plantillas duplicadas | Baja | M |
| AUD-J-05 | Theme Check: 951 errores (945 de traducciones en locales no publicados) y configuración ausente | Baja | S |

## A. Conversión

### AUD-A-01 — Botón de compra tapado en móvil · Crítica

- **Qué pasa:** al abrir una ficha con stock en móvil, el botón «Añadir al carrito» queda en la parte baja de la primera pantalla (y = 758–797 px de 812) y tres capas fijas lo cubren: el chip «¿Necesitas ayuda?» de Shopify Inbox, el aviso «10% de descuento» de Shopify Forms y la burbuja flotante de WhatsApp.
- **Evidencia:** `document.elementFromPoint` sobre el botón, en x = 60, 150, 200 y 330, devuelve `SHOPIFY-CHAT`, `SHOPIFY-FORMS-EMBED#app-embed-container-1048885` y `a.bikerz-whatsapp-float`, nunca el botón. Ficha: `/products/dunlop-q-lite-110-70r17-54h`. El chip de Inbox también tapa el botón «Ver neumáticos» del buscador en `/collections/neumaticos`.
- **Por qué importa:** un toque en la zona del botón abre el chat o el formulario en lugar de agregar al carrito. Es la primera hipótesis concreta para explicar la brecha de conversión móvil (0,076% frente a 0,332% en escritorio).
- **Recomendación** (Shopify Forms se conserva, D-016):
  1. Mover o retrasar el aviso de Shopify Forms en móvil: mostrarlo solo después de desplazarse o al intentar salir, o excluirlo de las fichas de producto.
  2. Elegir un solo canal de chat flotante en móvil (Shopify Inbox o WhatsApp); hoy compiten dos.
  3. Subir la burbuja restante por encima de la zona del botón y de la barra fija de producto.
- **Validación:** en 375 × 812 y 390 × 844, `elementFromPoint` sobre el centro y los extremos del botón devuelve el botón; Clarity muestra menos clics muertos o de frustración en la zona baja de la ficha.

### AUD-A-02 — «Última unidad» no refleja el stock · Alta

- **Qué pasa:** el texto se muestra si existe el metacampo `custom.proveedor` en la variante o el producto, sin mirar el inventario.
- **Evidencia:** `sections/main-product.liquid:7-10` y `:150-152`. Muestra: 5 de 25 neumáticos agotados y 2 de 15 con stock muestran «Última unidad». Ejemplo: `/products/michelin-anakee-adventure-110-80r19-59v` dice «Última unidad» y a la vez «Agotado».
- **Por qué importa:** información de disponibilidad falsa. Resta confianza y puede considerarse publicidad engañosa según la Ley 19.496.
- **Recomendación:** confirmar con el propietario qué significa `proveedor`. Si indica stock de proveedor, cambiar el texto (por ejemplo «Despacho desde proveedor») y no mostrarlo en productos agotados. Si debe significar última unidad, calcularlo desde el inventario.
- **Validación:** ningún producto con `available = false` muestra el texto.

### AUD-A-03 — Información de compra ausente en la ficha · Media

- **Qué pasa:** junto al precio solo aparece «Envío calculado al finalizar la compra». La ficha no menciona cuotas, Webpay, Mercado Pago, plazo de entrega ni garantía.
- **Por qué importa:** el costo y el plazo de despacho son motivos típicos de abandono, y el comprador solo los descubre en el checkout.
- **Recomendación:** un bloque breve bajo el precio con despacho (costo o umbral y plazo RM/regiones), retiro en tienda, medios de pago y cuotas, y garantía. Requiere datos del propietario (sección 9 del plan).

## B. Búsqueda

### AUD-B-01 — Resultados demasiado amplios o sin aviso · Media

| Consulta | Predictiva | Página de resultados |
| --- | ---: | ---: |
| `110/80-17` | 10 | 35 |
| `110 80 17` | 10 | 521 |
| `llanta 90/90-18` | 10 | 563 |
| `neumatico scooter` | 10 | 602 |
| `11080r17` | 0 | 0 |
| `pirelli` | 9 (Michelin) | 9 |
| `maxxis` | 2 (casco Axxis) | 2 |

- **Qué pasa:** con espacios la búsqueda cae en coincidencias por palabra suelta y devuelve casi todo el catálogo. Una medida escrita sin separadores no encuentra nada. Las marcas que no se venden devuelven productos de otras marcas sin avisar.
- **Nota:** el repositorio tiene cambios sin publicar en `sections/main-search.liquid` y `sections/predictive-search.liquid`, y el último commit normaliza medidas y viscosidades. Hay que repetir esta tabla después de publicar.
- **Recomendación:** normalizar medidas (`11080r17`, `110 80 17` → `110/80-17`); para marcas sin stock, mostrar un mensaje («No trabajamos Pirelli; estas son alternativas en tu medida»); revisar el orden de relevancia.

### AUD-B-02 — Predictiva y página de resultados no coinciden · Baja

- `cubierta 130/70-17`: 0 en la predictiva, 1 en la página de resultados. El plan de métricas de búsqueda ya contempla medir estas diferencias.

## C. Catálogo

### AUD-C-01 — Sin GTIN en neumáticos · Alta

- **Evidencia:** 624 neumáticos en `/collections/neumaticos/products.json`; ninguna variante tiene `barcode`. El JSON-LD de producto no incluye `gtin` ni `mpn`.
- **Por qué importa:** Google Shopping, los listados gratuitos y las campañas de Shopping (hay etiquetas de Google Ads activas en el sitio) usan el GTIN para identificar el producto. Sin él, baja la elegibilidad y la cobertura.
- **Recomendación:** cargar el EAN del fabricante en el campo código de barras, empezando por los neumáticos con stock y más vendidos, y luego emitirlo en el JSON-LD.
- **Dato adicional:** 156 de 624 neumáticos (25%) están agotados y siguen publicados. No es un error por sí mismo; conviene decidir si se muestran al final de las colecciones.

## E. Legal, privacidad y confianza

> Brechas detectadas; deben validarse con asesoría legal.

### AUD-E-01 — Seguimiento sin consentimiento · Alta

- **Qué pasa:** no existe banner de cookies. `Shopify.customerPrivacy.currentVisitorConsent()` devuelve todo vacío, pero al cargar la home, sin interacción, ya se envían datos a GA4 (`page_view`), Google Ads (remarketing `viewthroughconversion`), DoubleClick, Microsoft Clarity (`collect`) y se carga el Pixel de Meta. Consent Mode reporta `gcs=G111`: almacenamiento publicitario y analítico concedidos por defecto.
- **Por qué importa:** la Ley 21.719 (vigencia prevista el 1 de diciembre de 2026, a confirmar) exige una base de licitud para tratar datos personales, y el consentimiento es la vía habitual para analítica y publicidad.
- **Recomendación:** activar el banner de privacidad de Shopify (o una app compatible con la Customer Privacy API) con «Rechazar» tan visible como «Aceptar»; pasar Consent Mode v2 a «denegado por defecto» hasta que el visitante acepte; condicionar Clarity y Meta al consentimiento. Medir antes y después: los datos de GA4 bajarán, y conviene registrar la fecha en el roadmap.

### AUD-E-02 — Políticas contradictorias · Alta

| Tema | `/pages/terminos-y-condiciones`, FAQ, `/policies/terms-of-service` | `/policies/refund-policy` |
| --- | --- | --- |
| Garantía de satisfacción | 5 días corridos | 14 días corridos |
| Plazo de reembolso | 10–20 días hábiles | hasta 45 días hábiles (retracto) |

- **Por qué importa:** Shopify enlaza la política de reembolso en el checkout. Ante un reclamo, el consumidor puede exigir la condición más favorable.
- **Recomendación:** que el propietario defina un plazo único y se unifiquen los cuatro textos.

### AUD-E-03 — Documentos legales duplicados · Media

- El footer enlaza `/pages/politicas-de-privacidad` (647 palabras: solo cita la Ley 19.628, no explica cómo ejercer derechos ni nombra a terceros). La política de Shopify `/policies/privacy-policy` (2.440 palabras, actualizada el 10 de junio de 2025) sí incluye derechos y conservación, pero tampoco nombra a Google, Meta ni Microsoft Clarity. Ninguna menciona la Ley 21.719.
- También hay dos términos y condiciones: la página (3.832 palabras) y la política de Shopify (562).
- **Recomendación:** dejar una sola versión de cada documento (la de Shopify, que se enlaza en el checkout), actualizarla y redirigir la página antigua.

### AUD-E-04 — Footer incompleto · Baja

- El footer enlaza privacidad, términos y FAQ, pero no devoluciones (`/policies/refund-policy`) ni despacho (`/policies/shipping-policy`). La identificación del proveedor (razón social, RUT, dirección) existe en `/policies/contact-information`, pero no está enlazada.

## G. SEO técnico

### AUD-G-01 — Disponibilidad inválida en el JSON-LD de producto · Alta

- **Evidencia:** `sections/main-product.liquid:410` genera `"http://schema.org/{% if variant.available %} InStock{% else %}OutOfStock{% endif %}"`. El espacio antes de `InStock` produce `http://schema.org/ InStock`, un valor que no es válido. Afecta a todos los productos con stock; los agotados salen bien.
- **Recomendación:** quitar el espacio y usar `https://schema.org/`. De paso, agregar `gtin` (tras AUD-C-01), `shippingDetails` y `hasMerchantReturnPolicy` para los listados de comerciantes.
- **Validación:** Rich Results Test sobre una ficha con stock sin advertencias de disponibilidad.

### Verificado sin incidencias

- Redirecciones: `http://bikerz.cl/` → `https://www.bikerz.cl/` en 2 saltos; `/HOME` → `/`; `/collections/all/products/…` → `/products/…` con 301.
- No hay subcarpetas de mercado (`/en`, `/en-us`, `/es-us` dan 404). Las plantillas `index.context.us` y `index.context.b2b` no generan URLs duplicadas.
- El índice de sitemaps responde bien. La home tiene canonical correcto, un solo H1 y `lang="es"`.

## I. Seguridad y correo

### AUD-I-01 — Autenticación de correo · Media

- SPF correcto: `v=spf1 include:_spf.google.com include:shops.shopify.com ~all`.
- DMARC en `p=none` (solo monitoreo, con reportes a Cloudflare y a contacto@bikerz.cl). No protege contra suplantación del dominio.
- DKIM: no se encontraron los selectores comunes (`google`, `shopify`, `selector1`, `k1`). Puede tener un selector propio, así que hay que confirmarlo en Google Workspace y en Shopify (Configuración › Notificaciones › Dominio del remitente).
- **Recomendación:** confirmar DKIM para Google Workspace y Shopify, revisar 2–4 semanas de reportes DMARC y subir a `p=quarantine`.
- Cabeceras de seguridad (HSTS, `X-Frame-Options`, CSP `frame-ancestors`) las gestiona Shopify; no requieren acción.

## J. Salud del theme y del código

Theme Check completo en `outputs/auditoria-2026-10/theme/theme-check.json` (Shopify CLI 4.8.4).

### AUD-J-01 — Inglés y texto de demo visibles · Media

- `templates/404.json`: «Page not found», «Sorry for the inconvenience», «Back to homepage» (verificado en vivo en una URL inexistente).
- `templates/customers/login.json:28-29`: «First time at GreaX» (nombre del theme mal escrito); `customers/register.json:26-27`: «First time at GearX». Hay que confirmar en admin si la tienda usa cuentas clásicas.
- Unos 15 textos en inglés en Liquid activo, por ejemplo «Share» (`snippets/detail-wishlist-compare-share.liquid:54`) y `title="Search with keyword: Shirt"` (`snippets/facets.liquid:84`).
- **Recomendación:** traducir 404 y login desde el editor; pasar los textos de Liquid a claves de `locales/es.json`.

### AUD-J-02 — Restos de Opinew en tarjetas · Media

- `snippets/product-item-horizontal.liquid:166` renderiza `opinew_review_stars_lists`. Cada tarjeta deja, dentro del `<h3>`, un `<a role="button" aria-label="Product reviews">` con estrellas vacías. La home contiene 24 referencias a Opinew en el HTML. También quedan secciones de app vacías en `templates/product.json:283` y `page.opinew_all_reviews.json`.
- **Por qué importa:** botones vacíos en inglés para lectores de pantalla, encabezados contaminados y HTML de más. No se usa app de reseñas (D-013).
- **Recomendación:** quitar el render y las secciones vacías.

### AUD-J-03 — `animate.css` global · Media

- `snippets/head-assets.liquid:6` carga `animate.css` (61 KB, bloquea el renderizado) en todas las páginas; solo lo usa `sections/slide.liquid:525-529` (home).
- **Recomendación:** cargarlo solo cuando exista la sección `slide`, o extraer las 2–3 animaciones usadas. `swiper-bundle.js` (140 KB, con `defer`) también es global; evaluarlo con el área F.

### AUD-J-04 — Código y assets muertos · Baja

- Snippets sin ninguna referencia: `test`, `placeholder-render`, `product-item-layout-2`, `opinew_review_stars_product`. El check `OrphanedSnippet` de Theme Check da 83, pero incluye falsos positivos como `head-assets`.
- Unas 20 secciones sin uso en plantillas (demo del theme, `part-finder` reemplazada por `ymm-part-finder`, `opinew_review_carousel`).
- 13 assets sin referencias, incluido `sparkle.gif` (179 KB). Los CSS RTL nunca se sirven (`enable_rtl = false`).
- Plantillas probablemente sin uso (confirmar asignación en admin): `product.respuestov2`, `product.producto-predeterminadov2`, `product.accesorios-v1`, `product.card_compare`, `page.about` (demo en inglés), `page.recent-viewed`, `page.opinew_all_reviews`. `index.context.us/b2b` están vacías y no tienen efecto.
- `snippets/tool-demos.liquid` se renderiza en todas las páginas (`layout/theme.liquid:119`), pero solo actúa en la tienda demo del proveedor.

### AUD-J-05 — Theme Check · Baja

- Theme: 951 errores y 370 advertencias (línea base del 2026-09-14: 903 y 351). 945 errores son `MatchingTranslations` en `es-ES`, `es-MX`, `fr` y `zh-TW`; `es.json` está completo. Los 6 errores restantes son los mismos de la línea base.
- No existe `.theme-check.yml`, así que el CLI también analiza `outputs/` y suma 117 advertencias falsas.
- **Recomendación:** crear `.theme-check.yml` que ignore las carpetas que no son del theme; borrar o sincronizar los locales no publicados (confirmar en admin qué idiomas están activos).

### Inventario de trabajo local sin publicar

- **Analítica de búsqueda:** toggle `search_analytics_enabled` (por defecto `false`), cambios en búsqueda y predictiva, nuevos `assets/search-analytics*.js`, snippets e `integrations/search-analytics/`.
- **Encuadre de imágenes:** `product_aspect_ratio` pasa a 1/1, más `assets/product-image-fit.css` (se carga de forma global).
- `.gitignore` ignora `outputs/` pero no `output/` (10 archivos de evidencia de PageSpeed).

## Observaciones para las próximas fases

- Hay etiquetas de Google Ads activas (conversión y remarketing): existen campañas pagadas, algo que hay que considerar al conciliar la atribución (área D).
- El checkout no se recorrió para no generar eventos `add_to_cart` ni `begin_checkout` reales. Se propone hacerlo con el tráfico interno excluido en GA4 o con un pedido de prueba coordinado con el propietario.
