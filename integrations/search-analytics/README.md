# Analítica de búsquedas: implementación inicial

Fecha: 2026-10-22. Estado: receptor, píxel y captura del tema desplegados y verificados en producción. Consolidación nocturna del histórico pendiente de configurar.

Las fuentes se recuperaron de la rama `codex/shopify-pixel-pilot` (`ec3ace1`) y la integración continúa en una copia separada, rama `codex/search-preview-analytics`. Código, migraciones, agregado diario, informe y procedimiento de activación: [implementación integrada](C:/Users/juposada/Documents/Codex/2026-10-22/teniendo-en-cuenta-este-pixel-dime/bikerz-pixel/docs/shopify-search-analytics-implementation.md).

## Qué está implementado

- `assets/search-analytics-contract.js`: contrato compartido, límites y sanitización antes de publicar.
- `assets/search-analytics.js`: previsualizaciones, errores, envíos y vistas de resultados; correlación temporal por pestaña; deduplicación; consentimiento.
- `snippets/search-results-metadata.liquid`: consulta, tipos, total, página e IDs de productos a partir de Liquid. Se reemplaza con el contenedor de resultados en las actualizaciones AJAX.
- `pixel-search.mjs`: proyección y suscripciones para integrar en la extensión existente, conservando su transporte y los eventos estándar.
- `scripts/test-search-analytics.mjs`: pruebas de contrato, adaptador y navegador con datos sintéticos; también utiliza las clases reales del buscador extraídas en memoria de `assets/global.js`.

El interruptor `search_analytics_enabled` está en la configuración del buscador del tema y su valor predeterminado es `false`. Está activado en el tema público `SEO` (`164560142557`) y en la copia local; se conservaron los cambios anteriores del usuario. Se publicaron únicamente los nueve archivos de esta funcionalidad después de probarlos en el tema no publicado `189765058781`.

## Recorrido y comportamiento

1. El tema espera una consulta y muestra la respuesta predictiva. La captura observa la respuesta mostrada después del render, incluyendo caché y cero productos.
2. El tema publica uno de los cuatro eventos propios mediante `Shopify.analytics.publish` únicamente cuando `analyticsProcessingAllowed()` devuelve `true`. Si falta la API, la captura permanece cerrada hasta poder comprobar el permiso.
3. El envío conserva el texto escrito y la consulta final sanitizados. Un registro temporal de `sessionStorage` transporta explícitamente el `search_id`, la revisión y la referencia de previsualización a la siguiente página.
4. La página de resultados verifica la consulta del registro transportado y publica su total y ventana observada. Si no hay correlación válida, informa `unmatched`.
5. El adaptador de la app se suscribe a los eventos, comprueba nuevamente el contrato y el consentimiento, y entrega filas al transporte existente.
6. El receptor integrado valida estas filas y las guarda en una tabla independiente. Las pruebas con PostgreSQL local confirmaron commit antes del `202`, deduplicación y rollback de lotes mixtos. Las migraciones y los permisos mínimos ya están aplicados en producción; se confirmó la recepción de los tres pasos con el receptor desplegado.

La instrumentación reemplaza solamente `getSearchResults` de la clase `predictive-search` cuando el interruptor está activo. Mantiene el render, foco, teclado y reset del tema, agrega cancelación de peticiones anteriores, identifica la consulta de origen y limita su caché a 50 respuestas. `assets/global.js` permanece intacto. Si el tema cambia esa interfaz, se deben repetir las pruebas de compatibilidad.

`sessionStorage` contiene únicamente el contrato sanitizado, tiene vigencia de 30 minutos y se elimina al detectar revocación. Un envío pendiente vence para la correlación inicial a los dos minutos. Si el almacenamiento no está disponible, la navegación funciona y se informa correlación desconocida. Las consultas redactadas no se guardan en ese registro. Abrir enlaces en otra pestaña no transporta una correlación mediante URLs ni genera un envío propio confirmado.

Los límites iniciales son 200 caracteres por consulta o valor de opción, 20 opciones permitidas y 24 IDs por observación. Las medidas como `140 70 17` se conservan. Se omite todo el grupo de consultas si se detectan correos, teléfonos, RUT, controles, markup, URLs u otros patrones sensibles. Estas reglas no identifican universalmente información personal: deben revisarse durante el piloto. No se guarda texto sin sanitizar en el registro temporal ni se imprime en logs propios.

## Contrato de integración

Eventos explícitos:

- `bikerz:search_preview_viewed`
- `bikerz:search_submit`
- `bikerz:search_results_viewed`
- `bikerz:search_preview_error`

`contract.project(eventName, event.customData)` valida los campos y rechaza eventos con campos desconocidos, IDs repetidos, tipos inválidos o texto que no pasó la sanitización. `toSearchRow` agrega la identidad del evento Shopify, fecha, secuencia y dominio configurado por la app; no usa el dominio declarado por el tema. La fila contiene `search_data` y deja nulos los campos económicos y de producto del contrato original.

Los textos `query_text`, `predictive_query` y `submitted_query` tienen funciones distintas. En `10w40`, el tema mantiene `(10W40 OR 10W-40)` para previsualización y `10W-40` para envío. No se deben colapsar esos campos en el receptor.

`products_returned` es el número devuelto por la API predictiva y `products_shown` el número de productos expuestos; ninguno es el total del catálogo. `result_count` proviene de `search.results_count`; `result_scope` indica si los tipos incluyen solamente productos o resultados mixtos. `product_ids` representa únicamente la ventana mostrada.

## Fuentes recuperadas e integración

La revisión inicial del checkout `main` encontró solamente artefactos en estos directorios:

- `C:/JS/bikerz_app/shopify/bikerz-pricing-analytics`: contiene artefactos compilados, dependencias y archivos de despliegue; no aparecen `shopify.app.toml`, el TOML de la extensión ni `src/index.ts`, `src/transform.ts` y `src/transport.ts`.
- `C:/JS/bikerz_app/services/shopify_pixel_receiver`: contiene cachés de Python y pruebas; no aparecen las fuentes editables del servicio.

La búsqueda posterior encontró las fuentes completas en Git. Se recuperaron en `C:/Users/juposada/Documents/Codex/2026-10-22/teniendo-en-cuenta-este-pixel-dime/bikerz-pixel`, sin cambiar el checkout de `C:/JS/bikerz_app`.

La extensión integrada conserva los cinco eventos estándar y usa la configuración existente `endpointUrl`, `installationKey` y `shopDomain`. Agrega cuatro suscripciones de búsqueda, con copia idéntica del contrato del tema. El receptor tiene validación independiente, tabla cruda, vistas de comparación, agregado permanente e informe SQL. No se reemplazó el servicio operativo.

Trabajo completado en la copia de integración:

1. Recuperación de fuentes y configuración desde Git.
2. Suscripciones y transformación de búsquedas dentro de la extensión original.
3. Reutilización del transporte existente para lotes estándar y de búsqueda.
4. Validación y enrutamiento independientes en el receptor, sin confiar en el navegador.
5. Persistencia de búsquedas con unicidad por tienda, ambiente, instalación y evento; transacción compartida para lotes mixtos.
6. Reconstrucción diaria de siete días, auditoría y consultas de discrepancias y cobertura.

La autenticación y la validación oficial de configuración de Shopify ya se completaron sin errores. La compilación oficial de ambas extensiones también pasó, al igual que el test del bundle generado en un sandbox sin DOM, incluyendo revocación del consentimiento.

La secuencia de activación ya se completó: migraciones, receptor, publicación de la extensión, pruebas en copia del tema y activación selectiva en el tema público. Se conservaron los cinco eventos estándar y la configuración de la instalación. La versión publicada es `search-preview-20261022-1afd58f`.

`pixel-search.mjs` conserva el adaptador inicial como referencia y para las pruebas del tema. La extensión recuperada usa ahora `src/search.ts` dentro de su `register` original; no se deben conectar ambos adaptadores a la vez. El informe SQL integrado permite revisar datos del mismo día mediante las vistas crudas cuando todavía no hay consolidación. Sigue pendiente programar la consolidación nocturna con permisos separados para conservar automáticamente los resúmenes históricos de 90 días; no hay una purga activa.

## Verificación y rollback

Ejecutar con Node.js, Playwright y Chrome instalado:

```powershell
node --test scripts/test-search-analytics.mjs
shopify theme check --output json
git diff --check
```

Playwright debe estar disponible para Node. En esta estación se usó el runtime de dependencias instalado por Codex mediante `NODE_PATH`; no se instalaron dependencias adicionales. Se puede elegir otro navegador instalado con `BIKERZ_BROWSER_CHANNEL`, por ejemplo `msedge`.

Se verificaron 19 casos: sanitización, contrato del adaptador, consentimiento del adaptador, previsualización sin Enter en escritorio/móvil, IDs visibles sin duplicación, `10w40`, caché/reapertura, respuestas tardías, errores HTTP, consentimiento y revocación del tema, sugerencia con consulta distinta, envío antes de respuesta, envío cancelado, cero resultados, reemplazo AJAX, consultas sensibles, Enter y reset con las clases reales del tema, interruptor desactivado, almacenamiento no disponible, respuestas malformadas, totales mixtos, restauración de página y carga tardía del publicador de Shopify. Este último caso fue reproducido antes de corregirlo: ahora se reintenta la vista inicial durante un máximo de diez segundos, siempre sujeto a consentimiento, sin crear una cola sin permiso. Algunos casos agrupan varios de estos escenarios.

El chequeo del tema no reportó errores en los archivos Liquid modificados o nuevos. El chequeo global encuentra errores en otras áreas y artefactos locales, por lo que todavía no es una validación limpia del tema completo. Las pruebas no sustituyen el recorrido en un tema de vista previa conectado al receptor.

Para detener la captura, desactivar `search_analytics_enabled` y volver a cargar la página. Los assets de captura dejan de cargarse y se utiliza el buscador original. Los datos existentes se conservan según la política de retención; esta entrega no agrega ninguna eliminación de datos.

Referencias: [eventos personalizados](https://shopify.dev/docs/api/web-pixels-api/emitting-data), [consentimiento](https://shopify.dev/docs/api/customer-privacy) y [objeto Liquid search](https://shopify.dev/docs/api/liquid/objects/search).
