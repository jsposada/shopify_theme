# Plan de métricas para búsqueda web y buscadores de neumáticos y repuestos

- **Fecha:** 2026-09-27
- **Actualización:** 2026-10-22
- **Estado:** Búsqueda general implementada y probada localmente en tema, pixel y receptor, con persistencia y consultas PostgreSQL. Despliegue y activación pendientes. Se conserva el plan de las landings.
- **Objetivo:** identificar los términos, medidas de neumáticos, motos y tipos de repuesto que buscan los visitantes, incluyendo previsualizaciones sin resultados, diferencias con la búsqueda enviada y su avance hacia producto, carrito y compra.

## 1. Resultado esperado

Disponer de un informe que permita responder, por período:

- Cuáles son las medidas de neumáticos más buscadas.
- Cuáles son las marcas, modelos y años de moto más buscados.
- Cuáles son los tipos de repuesto más buscados.
- Qué combinaciones no tienen resultados publicados.
- Qué términos muestran cero productos en la previsualización, aunque el visitante no envíe la búsqueda.
- Qué búsquedas presentan diferencias entre la previsualización y la página de resultados, considerando consultas, filtros y límites de cada superficie.
- Cuántas búsquedas terminan en visita a producto, carrito y compra.

La primera versión debe priorizar búsquedas totales, visitantes únicos y búsquedas sin resultados. La relación con carrito y compra puede incorporarse como segunda etapa.

## 2. Arquitectura propuesta

```text
Buscador general del tema + buscadores de las landings
        ↓
Eventos personalizados de Shopify
        ↓
Web Pixel Bikerz
        ↓
Receptor shopify-pixel-receiver en Easypanel
        ↓
PostgreSQL
        ↓
Informe o panel de búsquedas
```

No se necesita crear una integración paralela. La implementación debe ampliar la infraestructura de analítica ya existente.

## 3. Situación actual

### Buscador de neumáticos

Archivo: `sections/tire-finder.liquid`

Ya publica:

- `bikerz:tire_finder_search` con ancho, perfil, aro y uso.
- `bikerz:tire_finder_incomplete` cuando faltan campos obligatorios.

El evento de búsqueda ya contiene la información principal para construir la medida buscada.

### Buscador de repuestos

Archivo: `sections/ymm-part-finder.liquid`

Ya publica, entre otros:

- `bikerz:ymm_search_submit`.
- `bikerz:ymm_results_view`.
- `bikerz:ymm_no_results`.
- `bikerz:ymm_product_click`.

Actualmente el evento de búsqueda solo informa si existe año y si se seleccionó un tipo de repuesto. Se debe agregar la marca, modelo, año y tipo concretos.

### Web Pixel y receptor

Existe la app `bikerz-pricing-analytics`, un Web Pixel y el servicio `shopify-pixel-receiver` desplegado en Easypanel.

El pixel actual procesa eventos estándar como navegación, producto, carrito y checkout. Todavía debe suscribirse a los eventos personalizados de ambos buscadores y enviarlos al receptor.

## 4. Eventos que se deben registrar

### 4.1 Búsqueda de neumáticos

Evento principal: `bikerz:tire_finder_search`

Datos mínimos:

| Campo | Ejemplo | Observación |
|---|---|---|
| `search_id` | UUID | Une búsqueda, resultados y clics posteriores. |
| `finder` | `tires` | Identifica el buscador. |
| `ancho` | `120` | Puede quedar vacío cuando la interfaz lo permita. |
| `perfil` | `70` | Puede quedar vacío para medidas que no lo usan. |
| `aro` | `17` | Campo obligatorio. |
| `uso` | `calle` | Opcional. |
| `query_key` | `120/70-17` | Valor normalizado para el ranking. |
| `result_count` | `18` | Puede enviarse en un evento posterior. |
| `has_results` | `true` | Facilita calcular búsquedas sin resultados. |

### 4.2 Búsqueda de repuestos

Evento principal: `bikerz:ymm_search_submit`

Datos mínimos:

| Campo | Ejemplo | Observación |
|---|---|---|
| `search_id` | UUID | Une búsqueda, resultados y clics posteriores. |
| `finder` | `parts` | Identifica el buscador. |
| `make_id` | `yamaha` | Identificador interno normalizado. |
| `make_name` | `Yamaha` | Texto para el informe. |
| `model_id` | `fz16` | Identificador interno normalizado. |
| `model_name` | `FZ16 150` | Texto para el informe. |
| `year` | `2022` | Nulo cuando el visitante no conoce el año. |
| `year_unknown` | `false` | Distingue año omitido de año seleccionado. |
| `part_type` | `filtro-aceite` | Opcional. |
| `query_key` | `Yamaha FZ16 150 · 2022` | Valor normalizado para el ranking. |
| `result_count` | `6` | Cantidad publicada encontrada. |
| `has_results` | `true` | Facilita calcular búsquedas sin resultados. |

### 4.3 Eventos complementarios

- Resultado mostrado.
- Búsqueda sin resultados.
- Clic en un producto desde los resultados.
- Solicitud de ayuda por WhatsApp.
- Producto agregado al carrito después de una búsqueda.
- Compra atribuida a una búsqueda.

En las landings se debe contar una búsqueda cuando el visitante presiona el botón de buscar, no cada vez que cambia un selector. En el buscador general se registran por separado las previsualizaciones mostradas y las búsquedas enviadas; sus reglas se definen en la sección 12.

## 5. Almacenamiento sugerido

Crear una tabla específica, por ejemplo `search_events`, o ampliar el receptor con una columna JSONB para los datos variables.

Campos base recomendados:

```text
id
event_id
search_id
occurred_at
shop_domain
client_id
event_name
finder
query_key
result_count
has_results
custom_data JSONB
```

Requisitos:

- `event_id` debe ser único para evitar duplicados por reintentos.
- `client_id` debe ser el identificador anónimo entregado por Shopify.
- `custom_data` no debe contener nombres, correos, teléfonos ni otros datos personales.
- Los valores usados en rankings deben normalizarse para evitar separar búsquedas equivalentes por mayúsculas o formato.

## 6. Informes mínimos

### Neumáticos

- Top de medidas completas.
- Top de anchos, perfiles y aros.
- Top por tipo de uso.
- Medidas sin resultados.
- Tendencia diaria, semanal y mensual.

### Repuestos

- Top de marcas.
- Top de modelos.
- Top de combinaciones marca, modelo y año.
- Top de tipos de repuesto.
- Motos y repuestos sin resultados.
- Porcentaje de búsquedas realizadas sin indicar año.

### Indicadores comunes

- Búsquedas totales.
- Visitantes únicos que buscaron.
- Porcentaje sin resultados.
- Porcentaje de clic en producto.
- Porcentaje de agregado al carrito.
- Porcentaje de compra atribuida.

El informe debe permitir filtrar por rango de fechas y por tipo de buscador.

El buscador general incorporará además los indicadores y clasificaciones de la sección 12. Los conteos de previsualizaciones y envíos deben presentarse por separado.

## 7. Fases de implementación

### Fase 1: capturar búsquedas

1. Enriquecer los eventos de repuestos con valores reales.
2. Normalizar la medida completa de neumáticos.
3. Generar un `search_id` por búsqueda.
4. Suscribir el Web Pixel a los eventos personalizados necesarios.
5. Enviar eventos sanitizados al receptor de Easypanel.
6. Guardarlos de forma idempotente en PostgreSQL.
7. Instrumentar el buscador general y suscribir el pixel a los eventos de previsualización, envío, resultados y errores definidos en la sección 12.

### Fase 2: resultados y ausencia de inventario

1. Registrar `result_count` y `has_results`.
2. Crear rankings de búsquedas sin resultados.
3. Validar que las cantidades coincidan con lo mostrado en las landings.
4. Correlacionar la última previsualización aplicable con el envío y los resultados posteriores del buscador general.
5. Clasificar diferencias esperables, posibles discrepancias, fallas técnicas y casos sin información suficiente.

### Fase 3: conversión

1. Relacionar clics en productos con `search_id`.
2. Relacionar carrito y compra usando el identificador anónimo y una ventana de atribución definida.
3. Informar tasa de conversión por medida, moto y tipo de repuesto.

### Fase 4: visualización

Crear un panel sencillo, ya sea dentro de la app de Shopify o mediante una herramienta conectada a PostgreSQL, con rankings y filtros por fecha.

## 8. Privacidad y seguridad

- Respetar el consentimiento de analítica administrado por Shopify.
- No enviar datos personales en los eventos personalizados.
- Validar en el receptor los nombres de evento permitidos.
- Limitar tamaño, tipo y longitud de cada campo recibido.
- Mantener la clave de instalación fuera del theme y del repositorio público.
- Aplicar límites de frecuencia y conservar la protección contra eventos duplicados.

## 9. Criterios de aceptación

- Una búsqueda válida genera un solo registro principal.
- Cambiar un selector sin buscar no genera una búsqueda.
- La medida o moto guardada coincide con lo mostrado al visitante.
- Las búsquedas sin resultados quedan identificadas correctamente.
- Los reintentos de red no duplican registros.
- Los eventos no contienen información personal.
- El panel puede mostrar el top de búsquedas para 7, 30 y 90 días.
- La medición no bloquea la navegación ni la carga de resultados.

## 10. Pendientes antes de desarrollar

- Definir si el panel vivirá dentro de Shopify o en una herramienta externa.
- Confirmar la base PostgreSQL que usará el receptor.
- Definir cuánto tiempo se conservarán los eventos.
- Definir la ventana de atribución entre búsqueda y compra.
- Recuperar o reconstruir el código fuente editable del Web Pixel si solo está disponible el archivo compilado localmente.
- Verificar el contrato y la versión actualmente desplegados del pixel y del receptor antes de extenderlos.
- Elegir el mecanismo temporal de correlación entre páginas, sujeto al consentimiento, sin depender de un identificador persistente del visitante.
- Definir límites de longitud, redacción del texto libre y retención de los nuevos eventos de búsqueda.

## 11. Primera entrega recomendada

La primera entrega debería incluir:

1. Captura de búsquedas completas en ambos buscadores.
2. Cantidad de resultados y detección de cero resultados.
3. Ranking por 7, 30 y 90 días.
4. Prueba controlada en el theme de vista previa antes de activar la medición en producción.
5. Captura de previsualizaciones del buscador general, incluidas las que no terminan en envío.
6. Comparación entre previsualización y resultados posteriores, con un informe de discrepancias y cobertura de correlación.

La atribución a carrito y compra debe implementarse después de validar que los rankings de búsqueda sean correctos.

## 12. Ampliación aprobada: previsualización y resultados del buscador general

**Aprobación de alcance:** 22 de octubre de 2026. Esta sección documenta la funcionalidad acordada y sus criterios de aceptación. El avance inicial se detalla en la sección 12.9; la activación productiva está pendiente.

### 12.1 Captura de previsualizaciones

Registrar cada previsualización efectivamente mostrada después de la espera breve del buscador, incluso si el visitante nunca presiona Enter. La unidad de observación es una respuesta mostrada para una revisión de consulta, no cada pulsación de teclado.

- Incluir resultados servidos desde la caché del buscador.
- Emitir el evento después del render y de los ajustes que determinan lo mostrado al visitante.
- Asociar la respuesta a la consulta que la originó. Una respuesta obsoleta, cancelada o descartada no cuenta como previsualización vista de la consulta actual.
- Si una respuesta obsoleta llega a mostrarse, conservar su consulta de origen y marcar el desajuste con el texto actual como falla técnica.
- Registrar como cero productos únicamente una respuesta válida con cero productos. Un error, timeout, cancelación o evento ausente no equivale a cero.
- Contar por separado productos, sugerencias de consultas y otros recursos, como páginas o artículos.
- Identificar productos por ID y posición. Las representaciones duplicadas para escritorio y móvil no deben duplicar el conteo.
- Reabrir el mismo resultado sin cambiar la consulta no debe crear otra previsualización lógica. Una nueva consulta o revisión sí puede producir otra observación.

### 12.2 Eventos y contrato mínimo

Los nombres siguientes son la propuesta de contrato para implementar sobre la infraestructura existente. La suscripción del pixel debe ser explícita y el receptor debe validar cada nombre y sus campos.

| Evento | Momento de emisión | Uso |
|---|---|---|
| `bikerz:search_preview_viewed` | Se muestra una previsualización válida, con o sin productos. | Registrar lo visto antes de enviar. |
| `bikerz:search_submit` | Se confirma la navegación mediante Enter, botón o sugerencia. | Registrar la consulta enviada y su origen. |
| `bikerz:search_results_viewed` | Se muestra la página de resultados. | Registrar total, página y productos mostrados. |
| `bikerz:search_preview_error` | Falla la consulta o el procesamiento de la previsualización. | Separar fallas técnicas de respuestas sin productos. |

Campos comunes:

- Identidad de instalación y ambiente según el contrato del receptor, `schema_version`, `event_id` y fecha de ocurrencia. El servidor agrega la fecha de recepción.
- `search_id`: identificador aleatorio de la interacción, sin identidad del cliente.
- `query_revision`: revisión de la consulta dentro de la interacción.
- `request_id`: identifica la respuesta de previsualización; el envío referencia la última respuesta aplicable cuando exista.
- `surface`: ubicación del buscador, por ejemplo cabecera, modal o página de búsqueda; `finder = general`.
- Texto escrito sanitizado, consulta efectiva de previsualización y consulta efectiva enviada, cuando estén disponibles.
- Versión de las reglas de normalización y del tema; idioma y contexto de mercado, tipos de recursos, filtros y orden aplicados.

Campos de resultados:

- Cantidad de productos devueltos por la previsualización y cantidad efectivamente mostrada, más el límite aplicado. No representan el total de coincidencias del catálogo.
- IDs de productos mostrados y sus posiciones, con límites de tamaño explícitos.
- Conteos de otros recursos separados de productos.
- Total de resultados de la página final, tipos de recursos incluidos en ese total, número de página, tamaño de página y productos mostrados. No etiquetar un total mixto como total de productos.
- Estado de la respuesta, duración y origen `network` o `cache` cuando corresponda.
- Para fallas: código de error permitido y datos técnicos mínimos; sin cuerpos de respuesta ni mensajes arbitrarios.

El evento estándar `search_submitted` puede complementar la medición, pero no debe duplicar los envíos contabilizados por el evento propio ni sustituir el total explícito de resultados de la página. Su array de variantes no se tratará como un conteo completo del catálogo.

Un clic directo en un producto de la previsualización se registrará, si se incorpora la medición de clics, como clic y no como búsqueda enviada a la página de resultados.

### 12.3 Correlación entre páginas

- Mantener `search_id` y revisión durante la navegación a los resultados mediante un mecanismo temporal sujeto al consentimiento, que se elegirá al implementar.
- Relacionar el envío con la última previsualización que corresponda al texto enviado. No unir registros solamente por texto, hora aproximada o visitante.
- Si el usuario selecciona otra sugerencia, conservar la consulta anterior y la seleccionada; marcar el cambio para no compararlas como una misma consulta.
- Si se envía antes de recibir una previsualización, guardar el envío con previsualización desconocida, no con cero productos.
- Distinguir envíos sin previsualización, resultados sin envío correlacionado y búsquedas con todos los pasos observados.
- Paginación, filtros y cambios de orden se consideran vistas de resultados posteriores; no generan automáticamente una nueva búsqueda inicial.
- La correlación del buscador general no requiere almacenar `client_id`. Los visitantes únicos y la atribución a compra del plan original mantienen sus decisiones pendientes de privacidad y alcance.

### 12.4 Reglas para interpretar diferencias

La inspección del tema local mostró dos condiciones que deben conservarse en los datos:

1. `assets/search-normalize.js` transforma `10w40` en `(10W40 OR 10W-40)` para la previsualización y en `10W-40` para el envío. Es una diferencia de reglas observada en código, no una discrepancia de resultados ya comprobada.
2. `sections/predictive-search.liquid` limita cada lista de productos a cinco elementos. Esa cantidad mostrada no equivale al total de coincidencias.

| Observación | Clasificación |
|---|---|
| Previsualización válida sin productos y resultados posteriores con productos. | Posible oportunidad perdida en la previsualización. |
| Previsualización con productos y resultados posteriores sin productos. | Posible discrepancia al enviar. |
| Previsualización limitada a cinco productos y total posterior mayor. | Diferencia esperable por límite; no implica anomalía. |
| Productos destacados u orden diferentes. | Diferencia de selección o relevancia dentro de las ventanas observadas. |
| Consulta, filtros, idioma, tipos o reglas diferentes. | Contexto no equivalente; informar la diferencia antes de atribuir una falla. |
| Error o respuesta obsoleta mostrada. | Falla técnica; no contar como cero resultados. |
| Sin envío posterior observado. | Interacción solo en previsualización; no demuestra abandono. |
| Falta uno de los pasos o no se puede correlacionar. | Información insuficiente; no imputar ceros. |

La comparación de IDs debe indicar qué páginas se observaron. Que un producto sugerido no figure en la primera página posterior no prueba que esté ausente de todos los resultados. No se recorrerán todas las páginas para cada visitante solamente con fines analíticos.

### 12.5 Persistencia e informes

Reutilizar el receptor y PostgreSQL con una tabla específica de eventos de búsqueda y un agregado diario por término, fecha comercial `America/Santiago` y superficie. El nombre definitivo y la migración se decidirán al revisar el contrato desplegado. Mantener estos conteos separados de las métricas de exposición por oferta.

- Aplicar la deduplicación del receptor con la identidad de instalación, ambiente y evento según su contrato, además de evitar emisiones repetidas del mismo render lógico.
- Conservar eventos sanitizados durante la retención acordada; guardar resúmenes diarios para rankings de 7, 30 y 90 días.
- Presentar previsualizaciones, interacciones y envíos como métricas distintas para no inflar el volumen con fragmentos de una misma búsqueda.
- Ofrecer rankings de términos, previsualizaciones sin productos, discrepancias entre pasos y errores técnicos.
- Medir cobertura: proporción de envíos con previsualización correlacionada y proporción con resultados posteriores observados.
- Mostrar las consultas efectivas y el contexto para investigar cada discrepancia durante la ventana de retención.

### 12.6 Privacidad y cobertura

- Sanitizar el texto libre antes de publicarlo mediante `Shopify.analytics.publish`, porque otros pixels suscritos también pueden recibir eventos personalizados.
- Suprimir o redactar correos, teléfonos y demás contenido personal detectable. Si no se puede sanitizar con confianza, omitir el texto y conservar únicamente los campos seguros y el estado de redacción.
- Revalidar y sanitizar en el receptor; no registrar texto original en logs, errores, URLs analíticas ni registros de rechazo.
- Definir longitud máxima, listas de campos permitidos y límites de productos por evento antes de activar la captura.
- Respetar el consentimiento analítico y mantener la medición fuera del camino crítico de navegación.
- Declarar cobertura de entrega best effort: bloqueadores, consentimiento y fallas de red pueden impedir observar una interacción. No prometer captura del 100 %.

### 12.7 Criterios de aceptación adicionales

1. Una previsualización válida sin productos queda registrada aunque no se presione Enter.
2. Una respuesta recuperada de caché se registra con la consulta y productos realmente mostrados, sin duplicar las representaciones móvil y escritorio.
3. Escribir rápidamente y recibir respuestas fuera de orden no atribuye productos de una consulta anterior a la actual.
4. Un error o timeout nunca incrementa el indicador de búsquedas sin productos.
5. El envío y los resultados posteriores conservan la correlación, incluida la selección de una sugerencia distinta.
6. La prueba `10w40` conserva por separado texto, consulta predictiva y consulta enviada.
7. Cinco productos en la previsualización y un total posterior mayor no se clasifican como falla solamente por la diferencia de cantidades.
8. La comparación de productos informa la página y ventana observadas y distingue tipos de recursos.
9. Reenvíos, reapertura del mismo resultado y eventos estándar complementarios no duplican la métrica principal.
10. Los casos sin pasos correlacionados quedan como desconocidos y su cobertura aparece en el informe.
11. Las pruebas con datos personales en el campo de búsqueda no publican ni persisten el texto original.
12. La prueba funcional cubre escritorio y móvil, consentimiento, caché, cero resultados, error, envío rápido y navegación atrás/adelante, sin bloquear el buscador.

### 12.8 Referencias oficiales

- [Shopify: publicar y recibir eventos personalizados](https://shopify.dev/docs/api/web-pixels-api/emitting-data).
- [Shopify: Predictive Search API y límites de recursos](https://shopify.dev/docs/api/ajax/reference/predictive-search).
- [Shopify: contrato del evento estándar search_submitted](https://shopify.dev/docs/api/web-pixels-api/standard-events/search_submitted).

### 12.9 Avance de implementación y despliegue — 2026-10-22

- Captura del tema implementada para los cuatro eventos de búsqueda, con metadatos Liquid, caché, respuestas fuera de orden, sanitización, consentimiento y correlación temporal por pestaña.
- Interruptor `search_analytics_enabled` con valor predeterminado `false`, activado en el tema público `SEO` después de pruebas en una copia no publicada.
- Contrato compartido y adaptador para el App Web Pixel implementados y probados sin cambiar los artefactos compilados existentes.
- Pasaron 19 pruebas locales de contrato y navegador, incluidas las clases reales del buscador y la carga tardía del publicador de Shopify, reproducida y corregida antes de activar el tema público.
- Los archivos Liquid modificados o nuevos no presentan errores en Theme Check; el chequeo global conserva errores de otras áreas y artefactos locales.
- Las fuentes se encontraron en `codex/shopify-pixel-pilot` (`ec3ace1`) y se recuperaron en una copia separada, rama `codex/search-preview-analytics`.
- Pixel y receptor integrados con cuatro eventos propios, persistencia independiente, migraciones aditivas, consolidación diaria idempotente, auditoría e informe SQL de discrepancias y cobertura.
- Pasaron 40 pruebas Python, incluidas seis con PostgreSQL real aislado, 17 de la extensión y una del bundle en sandbox sin DOM. El contrato del tema y el de la extensión tienen SHA-256 idénticos.
- Despliegue productivo autorizado: migraciones `0002` y `0003` aplicadas, receptor desplegado desde `codex/search-preview-analytics` (`1afd58f`) y versión del píxel `search-preview-20261022-1afd58f` publicada, sin cambiar los eventos estándar ni los ajustes de instalación.
- Se confirmó la persistencia real de una previsualización vacía antes de Enter y de los tres pasos correlacionados. `10w40` conserva 10 productos predictivos, 5 mostrados y 21 resultados posteriores, con contexto `query_rules_differ`, sin falso positivo por cantidad.
- Activación selectiva de nueve archivos en el tema público, respaldos previos y comprobación fuera de vista previa. El informe SQL permite revisar las observaciones del mismo día. Permanecen identificables dos términos sintéticos de QA y el primer caso incompleto anterior a la corrección; no se eliminaron datos.
- Pendiente: programar la consolidación nocturna con conexión de escritura separada para automatizar el histórico permanente de 90 días. No se habilitó ninguna purga ni se cambió catálogo, precios, inventario o pedidos.

Archivos, contrato, límites iniciales, instrucciones de integración y rollback: [implementación inicial de analítica de búsquedas](../../integrations/search-analytics/README.md).
