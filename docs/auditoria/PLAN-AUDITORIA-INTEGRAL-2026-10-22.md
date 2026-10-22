# Plan de auditoría integral — Bikerz Chile (www.bikerz.cl)

- **Fecha:** 2026-10-22
- **Alcance:** tienda Shopify completa (theme, catálogo, checkout, apps, medición, legal, seguridad y operación).
- **Theme auditado:** `Gearx-bicycle` 1.0.2 (Thimpress), personalizado en este repositorio.
- **Regla base:** la auditoría es de solo lectura. Ningún hallazgo se corrige en producción durante la auditoría; las correcciones siguen el flujo local → theme no publicado → aprobación → publicación (D-006 del [SEO-ROADMAP](../seo/SEO-ROADMAP.md)).

## 1. Por qué esta auditoría y qué la diferencia de lo ya hecho

Entre agosto y septiembre de 2026 se cerraron auditorías específicas de SEO on-page, rendimiento, GTM, alt text, accesibilidad, IDs, Liquid/HTML, datos estructurados, GBP y arquitectura de landings (ver `docs/seo/`). Esta auditoría **no las repite**: las revalida con datos nuevos y cubre las áreas que nunca se auditaron.

El hallazgo de negocio más grave de la línea base sigue abierto y orienta todo el plan:

| Dispositivo | % sesiones orgánicas | Conversión | % ingresos |
| --- | ---: | ---: | ---: |
| Móvil | 57,5% | 0,076% | 13,1% |
| Escritorio | 41,9% | 0,332% | 86,9% |

**Pregunta central:** ¿qué impide comprar en móvil y qué riesgos (legales, técnicos, de medición) pueden afectar ventas o reputación en los próximos 3 meses?

| Área | Tipo de trabajo | Prioridad |
| --- | --- | --- |
| A. Conversión y embudo de compra | Nuevo | Crítica |
| B. Búsqueda, navegación y buscadores | Nuevo (UX) + revalidación | Alta |
| C. Catálogo y calidad de datos de producto | Nuevo | Alta |
| D. Medición y analítica | Revalidación + nuevo | Alta |
| E. Legal, privacidad y confianza (Chile) | Nuevo | Alta (plazo legal) |
| F. Rendimiento y Core Web Vitals | Revalidación (fase 2.5 abierta) | Media |
| G. SEO técnico | Revalidación + pendientes T-01/T-02 | Media |
| H. Accesibilidad WCAG 2.2 AA | Revalidación + flujos de compra | Media |
| I. Seguridad, cuentas y operación | Nuevo | Media |
| J. Salud del theme y del código | Nuevo | Media |
| K. Contenido, local y autoridad | Solo brechas | Baja |

## 2. Preparación (días 1–2)

### 2.1 Accesos necesarios (los entrega el propietario)

- [ ] Shopify admin como colaborador o staff con permisos de lectura: Pedidos, Productos, Analytics, Tienda online, Apps, Configuración (sin permisos de pagos).
- [ ] Google Search Console (propiedad de dominio).
- [ ] GA4 (Lector) y GTM (Lectura).
- [ ] Microsoft Clarity (grabaciones y mapas de calor).
- [ ] Meta Business / Events Manager (lectura del Pixel y CAPI).
- [ ] Google Merchant Center, si existe.
- [ ] Panel DNS del dominio (lectura) para revisar SSL, correo y redirecciones.

### 2.2 Congelar la línea base

- [ ] Fecha de corte común: 28 días previos al inicio (y mismo período del año anterior cuando haya estacionalidad).
- [ ] Exportar: embudo de Shopify Analytics por dispositivo, informe de checkouts abandonados, GA4 ecommerce por dispositivo y landing, GSC rendimiento + indexación, CrUX de origen y por URL.
- [ ] Guardar exportaciones en `outputs/auditoria-2026-10/` (no se versionan, igual que el resto de `outputs/`).

### 2.3 Muestra de URLs representativas

Cada plantilla se audita con al menos una URL real, en móvil (390 × 844) y escritorio (1280 × 720):

| Plantilla | URL de muestra (confirmar) |
| --- | --- |
| Home | `/` |
| Colección comercial | `/collections/neumaticos`, `/collections/repuestos` |
| Landing SEO | una de `collection.seo-landing` |
| Producto neumático | `/products/michelin-anakee-adventure-110-80r19-59v` |
| Producto casco / repuesto / lubricante | una por plantilla (`product.casco`, `product.repuesto`, `product.lubricantes`) |
| Producto agotado | uno sin stock |
| Búsqueda | `/search?q=110/80-17` y una consulta sin resultados |
| Blog y artículo | `/blogs/motos-chile` + artículo con más tráfico |
| Carrito y checkout | hasta el paso de pago, sin comprar |
| Páginas de servicio y contacto | `/pages/servicios`, `/pages/contacto` |
| 404 | URL inexistente |

### 2.4 Rastreo completo

- [ ] Rastreo del sitio con Screaming Frog (o equivalente) renderizando JavaScript, user agent móvil, respetando `robots.txt`, a velocidad baja.
- [ ] Segundo rastreo a partir de `sitemap.xml` para cruzar URLs huérfanas.

## 3. Áreas de auditoría

### A. Conversión y embudo de compra — Crítica

**Objetivo:** localizar en qué paso se pierde al comprador móvil y por qué.

Datos:
- [ ] Embudo por dispositivo: sesión → vista de producto → agregar al carrito → inicio de checkout → compra (Shopify Analytics y GA4; comparar ambos).
- [ ] Tasa de abandono por paso del checkout (información, envío, pago).
- [ ] Clarity: grabaciones de sesiones móviles en fichas de neumáticos con y sin carrito; rage clicks, dead clicks, scroll depth y errores de JS.
- [ ] Mapas de calor de home, colección de neumáticos y ficha de neumático en móvil.

Ficha de producto (móvil primero):
- [ ] Precio, precio de comparación y descuento visibles sin desplazarse.
- [ ] Costo y plazo de despacho visibles antes del checkout (o estimador por comuna).
- [ ] Medios de pago y cuotas visibles (Webpay, Mercado Pago, transferencia, etc.).
- [ ] Botón de compra alcanzable con el pulgar; barra fija funcional al cambiar variante.
- [ ] Información de compatibilidad (medida, índice de carga/velocidad, uso) legible y sin jerga.
- [ ] Señales de confianza: garantía, tienda física en Santiago, asesoría, políticas de cambio.
- [ ] Estado de stock claro. Nota: los talles/medidas agotados **no** se convierten en botón de WhatsApp (decisión del propietario: las reposiciones son lentas).
- [ ] Peso de la ficha: galería, quick view, recomendados y scripts de apps.

Carrito y checkout:
- [ ] Carrito (drawer y página): edición de cantidad, eliminación, mensajes de error, envío gratis o umbral, cupones.
- [ ] Configuración del checkout: compra como invitado, campos obligatorios mínimos, autocompletado de dirección y comuna, métodos de envío con nombres comprensibles, retiro en tienda.
- [ ] Pasarelas de pago activas, tiempos de respuesta y errores frecuentes (revisar pedidos fallidos/abandonados).
- [ ] Página de estado del pedido y notificaciones por correo (contenido, marca, enlaces).
- [ ] Recuperación de checkouts abandonados: si está activa, cadencia y texto.

Entregable: mapa del embudo con la caída por paso y dispositivo, y una lista de 5–10 hipótesis priorizadas (impacto × confianza × esfuerzo) para probar.

### B. Búsqueda, navegación y buscadores — Alta

- [ ] Menú móvil: profundidad, nombres de categorías, acceso a neumáticos/repuestos/cascos en ≤ 2 toques.
- [ ] Buscador de neumáticos (`sections/tire-finder.liquid`): tasa de uso, búsquedas incompletas, combinaciones sin resultados, comportamiento con medidas en pulgadas.
- [ ] Buscador por moto (`sections/ymm-part-finder.liquid`): cobertura de marcas/modelos/años frente al catálogo real, estados vacíos.
- [ ] Búsqueda predictiva y página de resultados: normalización de medidas y viscosidades, sinónimos (cubierta/neumático/llanta), errores tipográficos, consultas con cero resultados.
- [ ] Filtros de colección: orden, nombres, valores duplicados o vacíos, filtros que devuelven cero productos.
- [ ] Validar la instrumentación nueva de búsqueda (`assets/search-analytics*.js`, `integrations/search-analytics/`) antes de activarla: eventos, PII (no enviar datos personales en consultas), volumen y deduplicación.

Entregable: top de búsquedas sin resultado y fricciones de navegación, con propuesta de sinónimos, redirecciones de búsqueda o nuevas colecciones.

### C. Catálogo y calidad de datos de producto — Alta

- [ ] Exportar productos (CSV del admin) y revisar: títulos con patrón consistente (marca + modelo + medida + índice), tipos de producto, proveedores, etiquetas.
- [ ] Metacampos usados por buscadores y landings (medida, aro, uso, compatibilidad de moto): completitud por producto.
- [ ] Imágenes: productos sin imagen, imágenes de baja resolución, fondos inconsistentes, alt.
- [ ] Variantes: SKU, código de barras (GTIN) y MPN para Merchant Center; variantes sin stock permanente.
- [ ] Precios: precios de comparación inflados o caducados, productos a $0, diferencias entre canales.
- [ ] Productos activos sin stock y sin fecha de reposición; productos archivados con tráfico (cruzar con GSC).
- [ ] Colecciones vacías o con menos de 4 productos indexables.
- [ ] Google Merchant Center / listados gratuitos: estado del feed, productos rechazados, advertencias.

Entregable: hoja de calidad del catálogo con % de completitud por campo y lista de productos a corregir priorizada por ventas o tráfico.

### D. Medición y analítica — Alta

- [ ] Eventos de ecommerce GA4 en toda la ruta: `view_item_list`, `view_item`, `add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`; sin duplicados y con valor/moneda correctos.
- [ ] Conciliación de pedidos: Shopify vs. GA4 vs. Meta para el mismo período (objetivo: diferencia de compras ≤ 5%).
- [ ] Atribución anómala ya detectada: compras atribuidas a URLs de checkout, `thank-you` y contacto confirmado; identificar la causa (autoreferencia de dominio, redirección de pasarela, falta de exclusión de referentes).
- [ ] Exclusión de referentes de pasarelas de pago (Webpay, Mercado Pago, etc.) en GA4.
- [ ] Consent Mode v2 y Customer Privacy API de Shopify: qué se dispara antes y después del consentimiento.
- [ ] Meta Pixel + Conversions API: deduplicación por `event_id`, calidad de coincidencia.
- [ ] Clarity: enmascaramiento de datos personales en checkout y formularios.
- [ ] UTMs en campañas de correo y redes; tráfico `(not set)` y `Sin definir`.

Entregable: matriz de eventos (esperado vs. real por plataforma) y lista de correcciones de medición, que debe resolverse **antes** de medir cualquier prueba de conversión del área A.

### E. Legal, privacidad y confianza (Chile) — Alta, con plazo

> Esta sección identifica brechas; no reemplaza la revisión de un abogado. Confirmar fechas y exigencias con asesoría legal.

Protección de datos (Ley 21.719, vigencia prevista para el 1 de diciembre de 2026):
- [ ] Política de privacidad actualizada: responsable, finalidades, base de licitud, transferencias (Shopify, Google, Meta, Microsoft, apps), plazos de conservación y canal para ejercer derechos.
- [ ] Banner de cookies/consentimiento con rechazo tan fácil como aceptar, conectado a la Customer Privacy API y a Consent Mode.
- [ ] Inventario de qué datos personales recoge cada app y script (formularios, Clarity, Pixel, WhatsApp, receptor de analítica propio).
- [ ] Consentimiento separado para marketing por correo/WhatsApp.

Protección al consumidor (Ley 19.496 y modificaciones):
- [ ] Identificación del proveedor visible: razón social, RUT, domicilio y contacto.
- [ ] Términos y condiciones accesibles antes de comprar; aceptación en checkout si corresponde.
- [ ] Derecho a retracto en compras a distancia y política de cambios/devoluciones clara.
- [ ] Garantía legal y garantía del fabricante explicadas.
- [ ] Precio total informado (impuestos incluidos) y costo de despacho antes de pagar.
- [ ] Plazos de despacho declarados y coherentes con la operación real.
- [ ] Emisión de boleta/factura electrónica y su integración con los pedidos.

Entregable: checklist legal con estado (cumple / parcial / no cumple / a validar con abogado) y textos o ubicaciones a corregir.

### F. Rendimiento y Core Web Vitals — Media (revalidación)

- [ ] Datos de campo: CrUX/Search Console de origen y por grupo de URLs (LCP, INP, CLS en móvil). Esto cierra o reabre la fase 2.5.
- [ ] Lighthouse móvil, mediana de 3 ejecuciones, por cada plantilla de la muestra 2.3 (no solo la home).
- [ ] INP en interacciones clave: abrir menú, usar buscador de neumáticos, cambiar variante, agregar al carrito, abrir quick view.
- [ ] Coste por tercero: GTM, Clarity, Meta, Shopify Forms (se conserva por D-016; medir, no proponer quitarlo), WhatsApp, apps.
- [ ] Recursos pesados del theme: `sparkle.gif` (175 KB), `swiper-bundle.js` (137 KB), `animate.css`, `base.rtl.css` (¿se usa?), imágenes de landings > 200 KB.
- [ ] CLS residual en "Conoce nuestros productos" y en carruseles.

Entregable: tabla de métricas por plantilla (campo y laboratorio) frente a los objetivos LCP < 2,5 s, INP < 200 ms, CLS < 0,1.

### G. SEO técnico — Media (revalidación)

- [ ] Cierre de pendientes T-01 (enlaces `within: collection`) y T-02 (canonical, filtros y robots).
- [ ] Cobertura de indexación actual vs. línea base (925 indexadas / 350 rastreadas sin indexar).
- [ ] Canonical, `noindex` y paginación por plantilla, incluidas las landings SEO y las vistas previas `collection.seo-preview-*` (deben estar ocultas o sin indexar si no están aprobadas).
- [ ] Mercados y contextos: existen `index.context.us.json` e `index.context.b2b.json`. Verificar si hay mercados/idiomas activos que generen URLs duplicadas o `hreflang` incorrectos.
- [ ] Datos estructurados de producto aptos para listados de comerciantes: `Offer`, disponibilidad, `shippingDetails`, `hasMerchantReturnPolicy`, marca, GTIN.
- [ ] Redirecciones en cadena, enlaces internos a 404/301, páginas huérfanas (cruce rastreo vs. sitemap).
- [ ] Seguimiento del cambio de metadata de la home (primer corte 2026-09-26) y canibalización home vs. `/collections/neumaticos`.

Entregable: lista de incidencias SEO técnicas nuevas o reabiertas, añadida al backlog del roadmap SEO (no un documento paralelo).

### H. Accesibilidad WCAG 2.2 AA — Media

- [ ] Revalidar lo cerrado en fase 3 con axe/Lighthouse en todas las plantillas de la muestra.
- [ ] Flujos de compra con teclado y lector de pantalla (NVDA en escritorio, TalkBack/VoiceOver en móvil): buscador de neumáticos, variante, carrito, drawer, modales, quick view.
- [ ] Criterios nuevos de WCAG 2.2: tamaño mínimo de objetivo (24 × 24 px), foco no oculto por barras fijas, arrastre con alternativa (carruseles).
- [ ] Contraste de botones, precios tachados, etiquetas de descuento y textos sobre banners.
- [ ] Mensajes de error accesibles en formularios (contacto, Shopify Forms, newsletter).

Entregable: hallazgos con criterio WCAG, plantilla afectada y severidad.

### I. Seguridad, cuentas y operación — Media

- [ ] Cuentas de staff y colaboradores: quién tiene acceso, permisos mínimos, cuentas antiguas, 2FA obligatorio.
- [ ] Apps instaladas: permisos (scopes), uso real, coste mensual, desarrollador activo; apps desinstaladas que dejaron código o snippets.
- [ ] Dominio y DNS: certificado, redirección única `bikerz.cl` → `www.bikerz.cl`, registros SPF, DKIM y DMARC para que los correos de la tienda no caigan en spam.
- [ ] Scripts de terceros cargados desde dominios externos (integridad y necesidad).
- [ ] Respaldo del theme: sincronización admin ↔ repositorio (D-018), themes no publicados obsoletos y cuál es el respaldo válido.
- [ ] Prevención de fraude: análisis de fraude de Shopify activo, pedidos de riesgo alto recientes.
- [ ] Receptor propio de analítica (Easypanel/PostgreSQL): autenticación, retención de datos y que no almacene datos personales innecesarios.

Entregable: lista de riesgos con dueño y acción.

### J. Salud del theme y del código — Media

- [ ] Theme Check completo: línea base de errores heredados vs. nuevos, agrupados por tipo.
- [ ] Theme de proveedor: ¿Thimpress publica versiones posteriores a 1.0.2? Evaluar el coste de actualizar frente al grado de personalización.
- [ ] Código muerto: plantillas sin uso (`page.opinew_all_reviews`, `product.respuestov2`, `product.producto-predeterminadov2`, vistas previas SEO), CSS RTL, secciones y snippets sin referencias.
- [ ] Bloques de apps huérfanos en plantillas JSON.
- [ ] Errores de consola de JavaScript en cada plantilla.
- [ ] Traducciones: textos en inglés visibles para el cliente en `locales/` y en el theme.
- [ ] Cambios locales sin publicar ni versionar (el repositorio tiene trabajo en curso en búsqueda e imágenes): confirmar qué está listo y qué no antes de auditar producción.

Entregable: inventario de deuda técnica con estimación de esfuerzo.

### K. Contenido, local y autoridad — Baja (solo brechas)

- [ ] Estado de las fases 6 (editorial) y 7 (autoridad) del roadmap: no iniciadas. Solo confirmar prioridad frente a los hallazgos de A–E.
- [ ] Blog: enlaces desde los 5 artículos con más tráfico hacia colecciones y productos (el blog aporta 29,5% de las sesiones y casi ningún carrito).
- [ ] Coherencia de nombre, dirección y teléfono entre web, GBP y directorios (arrastre de la fase 4.3).

## 4. Método de evaluación

### 4.1 Formato de cada hallazgo

| Campo | Descripción |
| --- | --- |
| ID | `AUD-<área>-<n>`, por ejemplo `AUD-A-03` |
| Área y plantilla | Dónde ocurre |
| Descripción | Qué pasa, en una frase |
| Evidencia | Captura, URL, grabación de Clarity, métrica o archivo:línea |
| Impacto | Ventas, legal, SEO, accesibilidad, seguridad o coste |
| Severidad | Crítica / Alta / Media / Baja |
| Esfuerzo | S (< 1 día) / M (1–3 días) / L (> 3 días) |
| Dueño | Propietario, desarrollo o proveedor de app |
| Recomendación | Acción concreta y cómo validar que quedó resuelto |

### 4.2 Escala de severidad

- **Crítica:** impide comprar, expone a sanción legal, filtra datos personales o rompe la medición de ventas.
- **Alta:** reduce de forma medible la conversión, la indexación o el acceso de un grupo de usuarios.
- **Media:** fricción o deuda con impacto acotado.
- **Baja:** mejora de calidad o pulido.

### 4.3 Priorización

Orden de ejecución = severidad, luego `impacto estimado ÷ esfuerzo`. Las correcciones de medición (área D) van antes que cualquier prueba de conversión (área A), porque sin datos fiables no se puede saber si una mejora funcionó.

## 5. Herramientas

| Uso | Herramienta |
| --- | --- |
| Rastreo | Screaming Frog SEO Spider |
| Rendimiento | PageSpeed Insights, Lighthouse CLI, CrUX, DevTools Performance |
| Comportamiento | Microsoft Clarity, Shopify Analytics, GA4 Explorations |
| SEO | Search Console, Rich Results Test, Schema Validator |
| Accesibilidad | axe DevTools, Lighthouse, NVDA, TalkBack/VoiceOver |
| Medición | GTM Preview, GA4 DebugView, Meta Events Manager, Shopify Pixel helper |
| Theme | Shopify CLI, Theme Check, git |
| Seguridad y correo | SSL Labs, MXToolbox (SPF/DKIM/DMARC) |

## 6. Calendario (3 semanas)

| Semana | Trabajo | Resultado |
| --- | --- | --- |
| 1 | Preparación (2), D Medición, A Conversión (datos y Clarity), E Legal | Línea base congelada, matriz de eventos, embudo por dispositivo, checklist legal |
| 2 | A Conversión (ficha, carrito, checkout), B Búsqueda, C Catálogo, F Rendimiento | Hipótesis de conversión, top de búsquedas sin resultado, hoja de calidad del catálogo, métricas por plantilla |
| 3 | G SEO técnico, H Accesibilidad, I Seguridad, J Theme, K brechas; consolidación | Registro completo de hallazgos, informe ejecutivo y backlog priorizado |

## 7. Entregables finales

1. **Informe ejecutivo** (2–3 páginas): estado general por área, los 10 hallazgos más importantes y el impacto esperado de corregirlos.
2. **Registro de hallazgos** (hoja de cálculo) con el formato de 4.1.
3. **Backlog priorizado** en tres horizontes: corregir ya (≤ 2 semanas), próximo mes, trimestre.
4. **Plan de pruebas de conversión** para móvil con hipótesis, métrica principal y duración mínima.
5. **Actualización del [SEO-ROADMAP](../seo/SEO-ROADMAP.md)** con los hallazgos de G, sin crear un roadmap paralelo.

## 8. Restricciones y decisiones vigentes que la auditoría respeta

- No se modifica producción durante la auditoría (D-006).
- Shopify Forms se conserva; su coste de rendimiento se mide, pero no se propone desactivarlo (D-016).
- Las medidas/talles agotados no se convierten en contacto por WhatsApp.
- No se usa aplicación de reseñas por ahora (D-013).
- No se desbloquean filtros ni búsquedas en `robots.txt` de forma general (D-003).
- Las exportaciones con datos comerciales se guardan en `outputs/` y no se versionan.

## 9. Datos o decisiones que se necesitan del propietario

- [ ] Accesos de la sección 2.1.
- [ ] Pasarelas de pago y métodos de envío reales que deberían estar activos.
- [ ] Política comercial vigente: garantía, cambios, devoluciones, plazos de despacho.
- [ ] Razón social y RUT a mostrar en el sitio.
- [ ] Si existen campañas pagadas activas (afectan atribución y conversión).
- [ ] Datos pendientes de la fase 5.3: categorías más rentables, marcas prioritarias, medidas más vendidas.

## 10. Siguiente auditoría

Al cerrar esta auditoría se preparará una **auditoría de producto digital** de la tienda: recorridos de usuario, funcionalidades (buscadores, quick view, wishlist, comparador, búsqueda predictiva), uso real de cada una y roadmap de funcionalidades priorizado. Se construirá sobre los hallazgos de las áreas A y B; la calidad del catálogo (área C) no se repite allí.
