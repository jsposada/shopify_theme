# Memoria y roadmap SEO — Bikerz Chile

> Fuente única de verdad para el trabajo SEO del theme Shopify de Bikerz.
>
> Última actualización: 2026-09-14
> Rama de trabajo: `codex/seo-home-phase-1`
> Entorno autorizado: copia local y theme no publicado de Shopify
> Producción: no publicar ni modificar sin aprobación explícita del propietario

## 1. Cómo usar esta memoria

Este archivo debe leerse antes de comenzar cualquier sesión SEO y actualizarse al terminar cada tarea relevante.

Estados:

- `[ ]` Pendiente.
- `[~]` En curso o completado parcialmente.
- `[x]` Terminado y validado.
- `[!]` Bloqueado; requiere una acción o decisión del propietario.

Reglas de trabajo:

1. Avanzar en el orden del roadmap. No saltar a otra fase salvo que quede documentado el motivo.
2. Cada tarea debe tener un responsable y una definición de terminado.
3. Todo cambio de código se hace primero en la copia local y después en un theme no publicado.
4. No usar `shopify theme push --live`, `--publish` ni `--allow-live` durante el desarrollo.
5. Antes de publicar se debe revisar el theme de prueba en móvil y escritorio.
6. No considerar terminada una tarea solo porque el código fue editado: debe validarse técnicamente y, cuando corresponda, medirse en Search Console.
7. Proteger las URLs y consultas que ya generan tráfico. Un dato nuevo puede cambiar el plan, pero la decisión debe registrarse en la sección 5.
8. No mezclar cambios SEO con modificaciones locales no relacionadas sin revisar primero el diff.
9. Los cambios de código se validan en el theme no publicado; las configuraciones globales de Shopify, como la metadata de la home en Preferencias, solo se aplican cuando el propietario autorice su impacto público.
10. Los reportes brutos de Analytics, Lighthouse y GTM se conservan localmente bajo `outputs/`, pero no se versionan para evitar publicar información comercial sensible.

## 2. Objetivo del proyecto

Incrementar el tráfico orgánico comercial y las ventas de Bikerz en Chile mediante correcciones críticas de la home, mejoras de rendimiento y accesibilidad, datos estructurados y SEO local, arquitectura de categorías, contenido editorial, autoridad externa y medición continua.

Prioridades comerciales:

1. Neumáticos para motos en Chile.
2. Repuestos para motos.
3. Cascos y equipamiento.
4. Servicios de taller y asesoría.
5. Contenido informativo conectado con productos y categorías.

Horizonte inicial: 90 días desde el inicio de la implementación.

## 3. Línea base validada

### 3.1 Fuentes disponibles

Se analizaron 13 exportaciones de Google Search Console:

- Rendimiento general de 16 meses.
- Rendimiento de home, blog, neumáticos, cascos y repuestos.
- Páginas indexadas.
- Rastreada, actualmente sin indexar.
- Alternativas con canonical.
- Páginas con redirección.
- Páginas no encontradas 404.
- Excluidas por `noindex`.
- Bloqueadas por `robots.txt`.

Ventana del rendimiento: hasta 2026-08-13.
Ventana de indexación: hasta 2026-08-06.

### 3.2 Rendimiento general

- Total de 16 meses: 11.462 clics, 652.611 impresiones y CTR de 1,76%.
- Últimos 28 días: 1.068 clics y 59.916 impresiones.
- Variación de 28 días: clics +14,1%, impresiones +6,7% y CTR +0,115 puntos porcentuales.
- Últimos 90 días: 3.121 clics y 177.522 impresiones.
- Variación de 90 días: clics +24,1%, impresiones +10,6% y CTR +0,191 puntos porcentuales.

Lectura: no se detecta una caída general del dominio. El sitio crece, pero tiene oportunidades importantes de arquitectura, indexación, CTR y aprovechamiento de páginas comerciales.

### 3.3 Home

- Total de 16 meses: 1.712 clics, 28.823 impresiones, CTR de 5,94% y posición media de 8,02.
- Últimos 90 días: 501 clics y 9.788 impresiones.
- Variación de 90 días: clics +86,2%, impresiones +61,0% y CTR +0,695 puntos porcentuales.
- La home ya posiciona por consultas genéricas como `neumaticos moto`, `neumaticos de moto`, `neumaticos para motos` y `neumaticos moto chile`.

Conclusión: la home debe defender como intención principal **neumáticos para motos en Chile**. Cascos, repuestos y taller se trabajarán como líneas secundarias.

### 3.4 Colecciones comerciales

Neumáticos:

- 163 clics y 7.370 impresiones en el periodo analizado.
- Últimos 90 días frente a los 90 anteriores: clics -28,9% e impresiones -27,1%.
- La colección tiene menor relevancia para consultas genéricas que la home.

Cascos:

- 6 clics y 422 impresiones.
- Cobertura principalmente de consultas de marca o modelo; casi no existe descubrimiento genérico.

Repuestos:

- 2 clics y 104 impresiones.
- Visibilidad insuficiente y muy poca cobertura no relacionada con la marca.

### 3.5 Blog

- Total de 16 meses: 3.500 clics y 348.255 impresiones.
- Últimos 90 días frente a los 90 anteriores: clics -22,4% e impresiones -23,9%.
- Páginas con mayor oportunidad de actualización:
  1. Tube type vs. tubeless.
  2. Cambio de aceite.
  3. Guía de motos custom.
  4. Índice o capacidad de carga.
  5. Medidas de neumáticos.

Conclusión: actualizar primero los artículos que ya tienen impresiones y autoridad antes de aumentar el volumen de publicaciones nuevas.

### 3.6 Indexación

- Indexadas: 925 URLs.
- Rastreada, actualmente sin indexar: 350 URLs.
- Cerca del 82% de las 350 son rutas duplicadas o de poco valor típicas de Shopify.
- Prioridad real dentro de ese informe: 62 productos con URL limpia y una URL de contacto antigua.
- Alternativas con canonical: 1.078. Predominan variantes, productos dentro de colecciones y parámetros. No se considera una emergencia.
- Páginas con redirección: 97. Aproximadamente 90 usan rutas `/collections/all/products/...`.
- Páginas 404: 16, frente a unas 41 al inicio del informe.
- Excluidas por `noindex`: 20. Diecinueve son búsquedas internas esperadas y una es un producto limpio que requiere revisión.
- Bloqueadas por `robots.txt`: 27. Predominan búsquedas, filtros y áreas privadas; no deben desbloquearse de forma general.

### 3.7 Sitemap

- Estado: `[x]` Enviado y procesado correctamente.
- Sitemap: `https://www.bikerz.cl/sitemap.xml`.
- Fecha de envío: 2026-08-20.
- Última lectura confirmada: 2026-08-20.
- Estado de Search Console: `Correcto`.
- Páginas descubiertas: 1.041.
- Videos descubiertos: 0.

Conclusión: no hay un bloqueo vigente del sitemap. Search Console ya reconoce el índice de sitemaps de Shopify.

## 4. Roadmap ordenado

### Fase 0 — Proteger producción y crear la línea base

- Duración estimada: 1–2 días.
- Objetivo: tener una línea base reproducible y un flujo sin riesgo para producción.

#### 0.1 Crear una copia segura del tema

- Estado: `[x]`
- Responsable: propietario; Codex trabaja sobre la copia local autorizada.
- Decisión adaptada: el repositorio contiene una copia local que no está en producción y el propietario la subirá mediante Shopify CLI como un theme no publicado.
- Restricción: no publicar la copia hasta completar las validaciones.
- Terminado cuando: `[x]` el flujo local → theme de prueba → revisión → publicación está acordado y producción queda protegida.

#### 0.2 Crear rama SEO

- Estado: `[x]`
- Responsable: Codex.
- Resultado: rama `codex/seo-home-phase-1` creada.
- Observación: los cambios que ya estaban en el repositorio pertenecen al propietario y deben conservarse.

#### 0.3 Incorporar Search Console y establecer línea base

- Estado: `[x]`
- Responsables: propietario exporta y gestiona Search Console; Codex valida, consolida y analiza.
- Completado por Codex:
  - Validación y consolidación de los 13 archivos.
  - Diagnóstico de rendimiento, consultas, páginas e indexación.
  - Priorización de home, colecciones y artículos.
- Completado por el propietario:
  - `[x]` Envío y procesamiento correcto de `sitemap.xml`; 1.041 páginas descubiertas.
  - `[x]` Revisión del producto `continental-contiraceattack-2-street-200-55zr17`: producto discontinuado archivado y redirigido a una alternativa equivalente.
  - `[x]` Gestión de las 404 significativas cerrada por confirmación del propietario.
- Criterio de cierre: `[x]` sitemap correcto, producto con `noindex` resuelto y tratamiento de las 404 documentado.

#### 0.4 Incorporar la línea base de GA4 o Shopify Analytics

- Estado: `[x]` Reportes corregidos, conciliados y línea base documentada.
- Responsables: propietario exporta; Codex valida y consolida.
- Periodo común: 2025-08-01 a 2026-07-31.
- Filtro confirmado por manifiesto: `Session default channel group = Organic Search`.
- Archivos definitivos: resumen mensual, landing pages, categorías de dispositivo y productos dentro de `outputs/ga4-seo/`.

##### Línea base orgánica de GA4

| Métrica | Resultado | Cálculo o definición |
| --- | ---: | --- |
| Sesiones orgánicas | 11.487 | Suma de los 12 meses. |
| Carritos iniciados | 215 | Evento `addToCarts`. |
| Tasa de inicio de carrito | 1,87% | 215 / 11.487. |
| Compras | 21 | `ecommercePurchases`. |
| Tasa de conversión | 0,183% | 21 / 11.487. |
| Ingresos de compra | 4.196.433 CLP | `purchaseRevenue`. |
| Ticket promedio | 199.830 CLP | Ingresos / compras. |
| Ingreso por sesión | 365 CLP | Ingresos / sesiones. |
| Artículos comprados | 27 | `itemsPurchased`; una compra puede contener más de un artículo. |
| Ingresos por artículos | 4.254.469 CLP | `itemRevenue`; no debe confundirse con `purchaseRevenue`. |

##### Conversión por dispositivo

| Dispositivo | Sesiones | % sesiones | Carritos | Tasa carrito | Compras | Conversión | Ingresos | % ingresos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Móvil | 6.612 | 57,5% | 82 | 1,24% | 5 | 0,076% | 551.100 CLP | 13,1% |
| Escritorio | 4.823 | 41,9% | 133 | 2,76% | 16 | 0,332% | 3.645.333 CLP | 86,9% |
| Tablet | 64 | 0,6% | 0 | 0,00% | 0 | 0,000% | 0 CLP | 0,0% |

Hallazgo prioritario: escritorio convierte 4,39 veces más que móvil y genera 9,07 veces más ingreso por sesión. Móvil aporta la mayoría del tráfico orgánico, pero solo 13,1% de los ingresos medidos. La experiencia y conversión móvil deben tratarse como una prioridad transversal.

##### Rendimiento por tipo de landing

| Tipo | Sesiones | % sesiones | Carritos | Compras | Conversión | Ingresos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Productos | 4.120 | 35,9% | 105 | 8 | 0,194% | 1.123.991 CLP |
| Blog | 3.393 | 29,5% | 4 | 0 | 0,000% | 0 CLP |
| Home | 1.893 | 16,5% | 74 | 5 | 0,264% | 1.170.742 CLP |
| Sin definir | 645 | 5,6% | 0 | 0 | 0,000% | 0 CLP |
| Colecciones | 588 | 5,1% | 19 | 3 | 0,510% | 517.800 CLP |
| Páginas | 469 | 4,1% | 3 | 1 | 0,213% | 452.700 CLP |
| Búsqueda interna | 345 | 3,0% | 10 | 0 | 0,000% | 0 CLP |
| Checkout/atribución | 19 | 0,2% | 0 | 4 | No válida | 931.200 CLP |
| Otros | 12 | 0,1% | 0 | 0 | 0,000% | 0 CLP |

Lecturas para el roadmap:

- La home recibe 16,5% de las sesiones orgánicas y genera 27,9% de los ingresos atribuidos por GA4.
- Las colecciones muestran la conversión observada más alta entre las landing comerciales válidas, pero reciben solo 5,1% de las sesiones. Esto respalda la fase dedicada a fortalecer colecciones.
- El blog aporta 29,5% de las sesiones orgánicas, pero no registra compras como landing y solo cuatro carritos. Se debe mejorar su conexión con productos y colecciones sin juzgarlo únicamente por atribución de último clic.
- Los productos reciben 35,9% de las sesiones, generan ocho compras y concentran 26,8% de los ingresos atribuidos.
- El reporte contiene cuatro compras y 931.200 CLP bajo URLs de checkout, además de una compra por 452.700 CLP asociada a `/pages/contacto?contact_posted=true`. Son señales de atribución anómala y no deben usarse para evaluar esas landing como páginas de adquisición.

##### Conciliación GA4 frente a Shopify Analytics directo

| Métrica | GA4 orgánico | Shopify, referente buscador | Diferencia |
| --- | ---: | ---: | ---: |
| Sesiones | 11.487 | 10.460 | GA4 +9,8% |
| Compras u órdenes | 21 | 20 | GA4 +1 |
| Ingresos o ventas | 4.196.433 CLP | 3.434.793 CLP | GA4 +22,2% |
| Conversión | 0,183% | 0,191% | -0,008 puntos porcentuales |

Las compras y la conversión están razonablemente alineadas. Los ingresos no son idénticos porque cada plataforma utiliza campos y reglas de atribución diferentes. La reconstrucción desde customer journey se conserva como análisis de sensibilidad, no como sustituto de GA4 o Shopify Analytics directo.

##### Controles de calidad

- Las sesiones varían levemente por dimensión: 11.487 en el resumen mensual, 11.499 por dispositivo y 11.484 por landing. La diferencia máxima es 12 sesiones, aproximadamente 0,10%; para el KPI general se usa el resumen mensual.
- Carritos, compras e ingresos coinciden entre resumen, dispositivos y landing pages: 215 carritos, 21 compras y 4.196.433 CLP.
- El manifiesto registra 12 filas mensuales, 1.208 landing pages, tres categorías de dispositivo y 138 productos.
- Las URLs de checkout, `thank-you`, contacto confirmado y `(not set)` se mantienen visibles como problemas de calidad de medición; no se redistribuyen artificialmente.

- Criterio de término de la fase 0: `[x]` existe una línea base anterior a cambios con tráfico, posiciones, conversión, rendimiento orgánico y páginas indexadas.

### Estado de la fase 0

- Estado: `[x]` Completada.
- Fecha de cierre: 2026-08-26.
- Próximo paso vigente del roadmap: fase 2.2, auditar aplicaciones activas.

### Backlog técnico derivado de la fase 0

Estas tareas fueron descubiertas al construir la línea base. Se conservan como trabajo técnico adicional, pero no reemplazan ni renumeran las fases del plan original.

#### T-01 — Enlaces internos de producto

- Estado: `[ ]`
- Responsable: Codex.
- Acción: eliminar el uso innecesario de `within: collection` y hacer que las tarjetas apunten directamente a `product.url` o a la URL canónica equivalente.
- Archivos inicialmente detectados:
  - `snippets/product-item-layout-1.liquid`
  - `snippets/product-item-compare.liquid`
  - `snippets/product-item-layout-2.liquid`
  - `snippets/product-item-horizontal.liquid`
  - `snippets/product-item-upsell-bundle.liquid`
  - `sections/someone-purchased.liquid`
- Validación:
  - Buscar nuevamente `within: collection`.
  - Revisar tarjetas de producto en home, colecciones, recomendaciones y bundles.
  - Confirmar que no se rompan variantes, filtros ni analítica.
- Terminado cuando: los enlaces relevantes llegan directamente a la URL limpia y el theme de prueba funciona correctamente.

#### T-02 — Canonical, filtros y robots

- Estado: `[ ]`
- Responsable: Codex.
- Acción: verificar que producto, variante, colección, búsqueda y paginación emitan las señales esperadas.
- Restricción: no desbloquear filtros o búsquedas de forma general.
- Alternativa SEO: crear colecciones o landings estáticas para intenciones con demanda.
- Terminado cuando: no existen canonical contradictorios ni páginas de poco valor indexables accidentalmente.

#### Cierres técnicos completados durante la fase 0

Redirecciones 404:

- Estado: `[x]` Resuelto durante la fase 0.3.
- Redirecciones aplicadas por el propietario el 2026-08-20:
  - `/collections/cascos/products/casco-airoh-connor-omega-mate` → `/products/airoh-connor-omega-mate-casco-integral`.
  - `/HOME` → `/`.
  - `/home` → `/`.
  - `/blogs/bikerz.cl` → `/blogs/motos-chile`.
  - `/blogs/motos-chile/tagged/bikerz.cl` → `/blogs/motos-chile`.
- Las familias antiguas sin sustituto aprobado —Xcelink Kratos `110/80-17`, Castrol Power1 4T `10W50` y Michelin City Grip Pro `90/90-14`— se mantienen como 404 salvo que aparezca un reemplazo realmente equivalente.
- Regla conservada: no redirigir URLs basura ni todas las 404 hacia la home.

Producto limpio con `noindex`:

- Estado: `[x]` Resuelto durante la fase 0.3.
- URL/handle: `continental-contiraceattack-2-street-200-55zr17`.
- Resultado: producto discontinuado archivado por el propietario.
- Redirección: `/products/continental-contiraceattack-2-street-200-55zr17` → `/products/michelin-power-gp-200-55-zr-17-78w`.
- Motivo: misma medida `200/55ZR17`, índice `78W` y uso deportivo comparable.

### Fase 1 — Correcciones SEO críticas de la home

- Duración estimada: 2–4 días.
- Objetivo: alinear la home con una intención comercial amplia, corregir su jerarquía semántica y añadir contenido estable sin hacerla competir directamente con la colección de neumáticos.

#### 1.1 Definir una sola intención para cada página

- Estado: `[x]` Mapa aprobado por el propietario el 2026-08-26.
- Responsable: Codex. El propietario aprueba la propuesta final.
- Objetivo: asignar una intención principal única a cada URL o tipo de página indexable prioritario, evitando que home, colecciones, productos y artículos compitan deliberadamente por la misma consulta.
- Entregable: mapa SEO con las columnas `URL o plantilla`, `intención principal`, `cluster de consultas`, `etapa del recorrido`, `página relacionada` y `conflicto pendiente`.

##### Mapa recomendado

| Página | Intención principal | Palabra clave principal | Clúster secundario compatible | Evitar como objetivo principal |
| --- | --- | --- | --- | --- |
| Home `/` | Presentar Bikerz como tienda especializada, sus categorías, autoridad y servicios. | `tienda de neumáticos y equipamiento para motos en Chile` | tienda para motos Chile, Bikerz Chile, neumáticos, cascos, repuestos, lubricantes y taller | `neumáticos para motos Chile` como intención exacta y exclusiva |
| `/collections/neumaticos` | Comprar y comparar neumáticos por medida, aro, marca y uso. | `neumáticos para motos en Chile` | neumáticos de moto, neumáticos por medida, aro, marca, urbanos, deportivos, touring, trail y mixtos | tienda completa, cascos, repuestos y servicios generales |
| `/collections/cascos` | Comprar cascos por tipo, talla, marca y uso. | `cascos para motos en Chile` | cascos integrales, modulares, adventure, tallas y cascos acreditados cuando el inventario lo respalde | equipamiento general y contenido puramente informativo sobre seguridad |
| `/collections/repuestos` | Encontrar repuestos compatibles por moto y tipo de pieza. | `repuestos para motos en Chile` | filtros de aceite y aire, frenos, transmisión, marca, modelo, año y compatibilidad | accesorios generales sin relación con repuestos |
| `/collections/lubricantes` | Comprar aceites adecuados por motor, viscosidad, especificación y marca. | `aceites para motos en Chile` | lubricantes para motos, aceite 4T, aceite 2T, 10W40, 10W50, aceite sintético y marcas | cambio de aceite como servicio local |
| `/pages/servicios` | Contratar servicios de neumáticos para moto en una ubicación física. | `cambio de neumáticos para motos en Santiago` | instalación, montaje, vulcanizado, tubulizado, balanceo y servicio de neumáticos para motos | venta nacional de neumáticos y catálogo de productos |
| `/blogs/motos-chile` | Organizar y descubrir guías, comparativas y consejos para motociclistas. | `blog de motos en Chile` | guías de neumáticos, mantenimiento, seguridad, comparativas y consejos para motociclistas | keywords transaccionales exactas de las colecciones |

##### Reglas de separación

1. La home puede mencionar todas las categorías y conservar un buscador de neumáticos, pero debe enlazar la intención transaccional exacta hacia `/collections/neumaticos`.
2. La colección de neumáticos debe ser la página más completa para comparar, filtrar y comprar neumáticos; no debe presentarse como una tienda general.
3. Home y colección no deben compartir el mismo `title`, H1, primer párrafo ni anchor principal.
4. No se cambiarán canonical ni URLs para realizar esta separación.
5. El traslado de la intención genérica de neumáticos debe implementarse gradualmente: primero reforzar la colección y el enlace desde la home; después ajustar la metadata de la home.
6. Durante la transición se medirán por separado home y colección para el clúster `neumáticos para motos`, usando ventanas comparables de 28 días.
7. Cada producto mantendrá una intención exacta basada en marca, modelo, medida, índice y atributo real del producto.
8. Cada artículo del blog responderá una pregunta o necesidad informativa específica y enlazará la colección relacionada sin copiar su intención transaccional.

##### Evidencia utilizada

- Search Console muestra que la home ya posiciona por variantes genéricas de neumáticos aproximadamente entre las posiciones 7 y 10, mientras la colección tiene menor visibilidad. Por eso el cambio debe ser gradual y medido.
- GA4 muestra que la home genera 27,9% de los ingresos orgánicos atribuidos y que las colecciones, aunque reciben solo 5,1% de las sesiones, presentan la mejor conversión comercial observada entre las landing válidas.
- La SERP chilena para neumáticos, cascos, repuestos y aceites está dominada por páginas de categoría, lo que respalda asignar esas consultas a colecciones y reservar la home como hub comercial de marca.
- La home publicada sigue titulada alrededor de `Neumáticos para Motos`, por lo que hoy existe solapamiento real con `/collections/neumaticos`.
- `/collections/repuestos` aparece en Google como `Nueva Colección - Bikerz` y `/collections/cascos` como `Cascos – Bikerz`; sus títulos actuales no expresan la intención objetivo.
- Servicios contiene venta, vulcanizado, tubulizado, mantenimiento, cadena y cambio de aceite. Para evitar una página demasiado genérica se propone priorizar la intención local de cambio de neumáticos y mantener los demás como servicios secundarios o futuras landing específicas.
- Tareas:
  1. `[x]` Inventariar las páginas prioritarias.
  2. `[x]` Contrastar Search Console, GA4 y SERP de Chile.
  3. `[x]` Asignar una intención principal y clústeres secundarios compatibles.
  4. `[x]` Definir reglas para evitar canibalización entre home y neumáticos.
  5. `[x]` Mapa aprobado antes de modificar titles, H1, contenido o arquitectura interna.
- Criterio de cierre: `[x]` cada URL prioritaria tiene una intención principal documentada y los conflictos de canibalización tienen una decisión explícita.

#### 1.2 Cambiar el título y la meta description

- Estado: `[x]` Completado y validado en producción el 2026-08-29.
- Responsable: propietario en Shopify; Codex prepara y valida el texto.
- Título final publicado: `Neumáticos y Repuestos para Motos en Chile | Bikerz`.
- Meta description final publicada: `Compra neumáticos, repuestos, cascos y lubricantes para motos con despacho a todo Chile. Buscador por medida, asesoría experta y taller en Santiago.`
- Pasos para el propietario:
  1. Ir a **Tienda online > Preferencias**.
  2. Buscar **Imagen para compartir en redes sociales y SEO**.
  3. Cambiar el título y la meta description.
  4. Guardar únicamente cuando el texto esté aprobado para producción.
- Nota de seguridad: estos campos son una configuración de la tienda, no del theme no publicado; por eso no se modificarán durante una prueba local sin autorización expresa para afectar la metadata pública.
- Validación de Codex:
  - `[x]` El título de la home no coincide de forma exacta con el de `/collections/neumaticos`, que permanece como `Neumáticos para Motos – Bikerz`.
  - `[x]` La respuesta HTML del servidor y el DOM renderizado muestran el mismo título y la misma descripción; no se detectó una aplicación sobrescribiéndolos.
  - `[x]` Existe un solo `<title>` SEO dentro de `<head>` y una sola meta description. Los otros cuatro elementos `<title>` del documento pertenecen a iconos SVG de medios de pago y no son metadata duplicada.
  - `[x]` El canonical de la home es `https://www.bikerz.cl/`; `og:title` y `og:description` coinciden con la metadata publicada.
- Criterio de término:
  - `[x]` Título único de 51 caracteres, menor a 60.
  - `[x]` Descripción única de 148 caracteres, menor a 160.
  - `[x]` Las palabras “motos” y “Chile” aparecen naturalmente.
  - `[x]` No se repite una lista artificial de palabras clave.
- Seguimiento: comparar el rendimiento de la home y `/collections/neumaticos` en Search Console durante los 28 días posteriores al cambio, con primer corte el 2026-09-26.

#### 1.3 Corregir el H1

- Estado: `[x]` Completado y validado en el theme no publicado el 2026-08-29.
- Responsable: Codex.
- Problema detectado:
  - El H1 corresponde al logotipo.
  - El texto principal del hero es un `<div>`.
  - No existe un encabezado textual principal estable.
- Cambios:
  1. `[x]` Cambiar el contenedor del logo de `<h1>` a `<div>` en `snippets/logo.liquid` sin alterar sus clases CSS.
  2. `[x]` Crear un H1 estable: `Neumáticos, repuestos y equipamiento para motos en Chile`.
  3. `[x]` Agregar debajo una introducción de 47 palabras.
  4. `[x]` Mantener las promociones del slider como contenido secundario: cualquier `<h1>` almacenado en el título de un slide se degrada a párrafo al renderizar.
  5. `[x]` El HTML renderizado contiene exactamente un H1 textual en la home.
  6. `[x]` Las 10 plantillas JSON de producto conservan un bloque de título activo y la colección conserva su H1 en breadcrumbs.
  7. `[x]` Tras la validación visual del propietario, el bloque volvió a su posición original después de `Conoce nuestros productos`; el H1 mantiene su semántica, pero adopta una presentación compacta para no alterar el layout aprobado.
- Archivos modificados:
  - `snippets/logo.liquid`.
  - `sections/slide.liquid`.
  - `sections/banner-with-text.liquid`.
  - `templates/index.json`.
- Validación técnica local:
  - `templates/index.json` se analiza como JSON válido.
  - Los cuatro archivos no presentan errores nuevos en Theme Check; `sections/banner-with-text.liquid` conserva un error histórico ajeno al cambio en la llamada a `responsive-image` de la línea 36.
  - La introducción estable cumple la extensión de 40–70 palabras.
  - El bloque H1 solo puede usar nivel H1 en la home; en cualquier otro tipo de página vuelve a H2.
  - Presentación visual ajustada a 20 px en escritorio y tablet, 18 px en móvil y 12 px de separación interna, conservando la altura y ubicación anteriores del bloque.
  - Home en escritorio, viewport 1280 × 720: un H1 visible de 20 px, 25 px de alto, sin imágenes y con el texto aprobado.
  - Home en móvil, viewport 390 × 844: un H1 visible de 18 px, distribuido en dos líneas, sin desbordamiento horizontal.
  - Colección validada: `/collections/neumaticos` conserva un único H1 visible, `Neumáticos para Motos`.
  - Producto validado: `/products/michelin-anakee-adventure-110-80r19-59v` conserva un único H1 visible con el nombre del producto.
- Criterio de término:
  - `[x]` Existe un solo H1 visible para usuarios en el theme no publicado.
  - `[x]` El H1 no está oculto ni presenta problemas visuales en escritorio o móvil.
  - `[x]` No cambia con la promoción del mes.
  - `[x]` Es texto real y no contiene solamente una imagen.

#### 1.4 Corregir el copy comercial

- Estado: `[x]` Completado y aprobado por el propietario el 2026-08-29.
- Responsable: Codex redacta; propietario aprueba.
- Correcciones inmediatas:
  - `[x]` `Aprovecha los descuento` → `Aprovecha los descuentos`.
  - `[x]` `en toda la marca CEAT` → `en neumáticos CEAT`.
  - `[x]` `Compra ahora` → `Ver neumáticos CEAT`.
  - `[x]` `Ver mas` en cascos → `Ver cascos para moto`.
  - `[x]` `Ver más` en ofertas → `Ver neumáticos en oferta`.
  - `[x]` `Ver mas` en blog → `Leer consejos para motociclistas`.
  - `[x]` `@ 2024 BIKERZ` → `© {{ año actual }} BIKERZ`, calculado dinámicamente con Liquid.
- Archivos modificados:
  - `templates/index.json`.
  - `config/settings_data.json`.
  - `sections/footer-2.liquid`.
  - `sections/footer.liquid`.
- Validación local:
  - Los cuatro CTA visibles conservan sus destinos correctos: neumáticos CEAT, cascos, neumáticos en oferta y blog.
  - Los textos anteriores no aparecen en el DOM renderizado.
  - El footer muestra `© 2026 BIKERZ. Todos los derechos reservados` en la fecha de validación.
  - En un viewport móvil de 390 × 844, los cuatro CTA permanecen en una sola línea y no generan desbordamiento horizontal.
  - Los archivos modificados no presentan errores nuevos en Theme Check; los avisos de ambos footers corresponden a nombres de variables preexistentes.
- Criterio de término:
  - `[x]` El texto visible no contiene los errores detectados.
  - `[x]` Los enlaces describen claramente su destino y mantienen el `href` correcto.
  - `[x]` Los textos no se cortan ni desbordan en móvil.
  - `[x]` El propietario aprueba visualmente el copy en el theme no publicado.

#### 1.5 Agregar una introducción SEO estable

- Estado: `[x]` Completado y aprobado por el propietario el 2026-08-31.
- Responsables: Codex implementa; el propietario aprueba.
- Ubicación aprobada: después de las categorías y antes del buscador de neumáticos, conforme a D-011.
- Contenido esperado:
  - H1 y propuesta de valor.
  - Despachos a todo Chile.
  - Tienda y taller en Santiago.
  - Especialización en neumáticos.
  - Asesoría para medidas y compatibilidad.
  - Enlaces a las categorías principales.
- Implementación:
  - H1 semántico preservado: `Neumáticos, repuestos y equipamiento para motos en Chile`.
  - Introducción final de 106 palabras distribuida en dos párrafos.
  - Enlaces internos descriptivos hacia `/collections/neumaticos`, `/collections/repuestos`, `/collections/cascos` y `/collections/lubricantes`.
  - Alto de escritorio conservado en 200 px; alto móvil ajustado de 300 a 380 px para evitar superposición.
- Validación local del 2026-08-30:
  - Un solo H1 visible en escritorio, tablet y móvil.
  - Sin desbordamiento horizontal ni vertical en 1280 × 720, 768 × 1024 y 390 × 844.
  - Los cuatro enlaces internos conservan el destino correcto y no abren pestañas nuevas.
  - `templates/index.json` es JSON válido y Theme Check no reporta infracciones para ese archivo. La revisión global conserva errores heredados en archivos ajenos a este paso.
- Criterio de término:
  - `[x]` La home explica qué vende Bikerz, dónde opera y por qué confiar sin depender de banners ni imágenes.
  - `[x]` El texto mantiene una extensión de 100–180 palabras y no provoca desbordamientos.
  - `[x]` Los enlaces a las categorías principales son descriptivos y funcionales.
  - `[x]` El propietario aprueba el texto y su presentación visual en el theme no publicado.

### Estado de la fase 1

- Estado: `[x]` Completada.
- Fecha de cierre: 2026-08-31.
- Resultado: intención, metadata, H1, copy comercial e introducción SEO de la home implementados, validados y aprobados.
- Despliegue: `[x]` theme `SEO`, ID `164560142557`, publicado como live por el propietario el 2026-08-31.
- Alcance del push previo: siete archivos de la fase 1, con `--nodelete`.
- Validación en producción: título correcto, un solo H1 visible, introducción nueva, cuatro enlaces internos correctos, copyright dinámico y ausencia de desbordamiento horizontal.
- Respaldo: el antiguo live `new look`, ID `164296949981`, permanece no publicado.
- Próximo paso: fase 2.1, priorizar correctamente el hero.

### Fase 2 — Rendimiento y Core Web Vitals

- Duración estimada: 1–2 semanas.
- Objetivo: mejorar la velocidad percibida y las métricas web sin introducir regresiones en compra, medición ni estabilidad visual.

#### 2.1 Priorizar correctamente el hero

- Estado: `[x]` Completado, publicado y validado en producción el 2026-08-31.
- Responsable: Codex.
- Archivo modificado: `sections/slide.liquid`.
- Diagnóstico previo:
  - La versión móvil renderizaba dos elementos `<img>` independientes: uno de escritorio oculto y uno móvil visible. En la comprobación del navegador ambos terminaron descargados.
  - La primera imagen visible usaba `loading="lazy"`, no tenía `fetchpriority` ni `decoding`, y por tanto Lighthouse no aprobaba la estrategia de descubrimiento del LCP.
  - El atributo `height` se calculaba desde la imagen de escritorio y se reutilizaba en móvil; además se serializaba como decimal (`1563.0`).
  - `sizes="(min-width: 750px) 60vw, 120vw"` no representaba el ancho real del hero, que ocupa todo el viewport.
- Cambios:
  - `[x]` La primera imagen activa usa `loading="eager"`, `fetchpriority="high"` y `decoding="async"`.
  - `[x]` Los slides posteriores conservan `loading="lazy"` y `fetchpriority="auto"`; solo `forloop.first` recibe prioridad alta.
  - `[x]` Los dos `<img>` independientes se sustituyeron por un único `<picture>` con `<source media="(max-width: 767px)">` para móvil y `<img>` de respaldo para escritorio.
  - `[x]` Los valores de `width` y `height` se toman directamente de los objetos de imagen de Shopify y se renderizan como enteros: escritorio `4500 × 1563` y móvil `2000 × 1250` en el banner activo.
  - `[x]` El hero declara `sizes="100vw"`; la fuente móvil ofrece candidatos de 375, 550, 750 y 1100 px, y la fuente de escritorio conserva candidatos hasta 3840 px.
  - `[x]` El navegador solicita una sola variante del hero según el viewport, no ambas.
- Validación del navegador local:
  - Móvil, viewport configurado en `390 × 844`: un `<picture>`, un `<source>`, un `<img>`, fuente actual móvil de 550 px, hero de 250 px de alto y sin desbordamiento horizontal.
  - Escritorio, viewport configurado en `1265 × 720`: un `<picture>`, un `<source>`, un `<img>`, fuente actual de escritorio de 1920 px, hero de 350 px de alto y sin desbordamiento horizontal.
  - En ambos tamaños el `<img>` visible expone `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, `sizes="100vw"` y dimensiones enteras.
  - Theme Check no reporta infracciones en `sections/slide.liquid`; la salida global mantiene errores heredados en otros archivos.
- Contraste con Lighthouse 13.4.1, una ejecución móvil por entorno:
  - Live antes del cambio: rendimiento 45, LCP simulado 3,81 s, LCP observado 1,45 s, CLS 0,161 y TBT 4.298 ms. El LCP era el banner móvil con `loading="lazy"`; se solicitaron tanto el banner móvil como el de escritorio y fallaron las comprobaciones de prioridad alta y carga eager.
  - Copia local modificada: Lighthouse identifica el mismo banner como LCP y aprueba `fetchpriority=high`, descubrimiento en el documento inicial y ausencia de lazy-loading. Solo solicita la variante móvil del hero, con prioridad alta, y aprueba la auditoría de dimensiones explícitas.
  - La copia local obtuvo LCP observado de 1,64 s, pero LCP simulado de 8,90 s, CLS 0,160 y TBT 2.528 ms. Ese LCP simulado no se compara directamente con producción porque el servidor de desarrollo elevó el FCP a 6,77 s. La meta se verificará sobre el mismo entorno live después del despliegue.
  - Lighthouse no atribuyó el desplazamiento principal al hero: el CLS existente se concentra en la sección `Conoce nuestros productos`; se mantiene como hallazgo para los pasos posteriores de rendimiento.
- Publicación y validación en producción:
  - El propietario aprobó visualmente el cambio.
  - Se publicó únicamente `sections/slide.liquid` en el theme live `SEO`, ID `164560142557`, usando `--nodelete` y `--allow-live`.
  - Una descarga de verificación confirmó que el SHA-256 del archivo remoto coincide exactamente con el archivo local.
  - En móvil se renderizan un `<picture>`, un `<source>` y un único `<img>`; la fuente actual es el banner móvil, el hero conserva 250 px de alto y no existe desbordamiento horizontal.
  - En escritorio se renderiza un único `<img>` dentro del `<picture>`; la fuente actual es el banner de escritorio de 1920 px, el hero conserva 350 px de alto y no existe desbordamiento horizontal.
  - Lighthouse live posterior: rendimiento 50, FCP 2,36 s, LCP simulado 2,86 s, LCP observado 1,18 s, CLS 0,161 y TBT 3.427 ms.
  - Frente a la referencia previa, el LCP simulado bajó 0,95 s, equivalente a 24,9%; la puntuación subió 5 puntos y el TBT bajó 871 ms. Son ejecuciones individuales, por lo que la mediana de tres pruebas se realizará en 2.5.
  - La descarga redundante del banner de escritorio desapareció en móvil: las solicitudes del hero pasaron de dos a una, ahorrando aproximadamente 55 KB transferidos en esta prueba.
  - Las tres comprobaciones de descubrimiento del LCP quedaron aprobadas: prioridad alta, presencia en el HTML inicial y carga eager.
  - El CLS permaneció en 0,161 antes y después; el cambio no introdujo desplazamiento acumulado adicional.
- Evidencia conservada:
  - `outputs/lighthouse/phase-2-1-live-before-mobile.json`.
  - `outputs/lighthouse/phase-2-1-local-mobile.json`.
  - `outputs/lighthouse/phase-2-1-live-after-mobile-run1.json`.
- Meta técnica:
  - `[x]` LCP móvil de laboratorio inferior a 4 segundos en producción: 2,86 s en la comprobación posterior.
  - `[~]` Mantener LCP real inferior a 2,5 segundos: seguimiento posterior en datos de campo; no bloquea el cierre inmediato porque CrUX necesita acumular tráfico.
  - `[x]` No introducir CLS atribuible al hero: CLS idéntico antes y después.
- Criterio de cierre:
  - `[x]` Aprobación visual del propietario.
  - `[x]` Publicación aislada y verificación del archivo remoto.
  - `[x]` HTML responsive y solicitud única del hero confirmados en producción.
  - `[x]` Lighthouse live posterior por debajo de 4 segundos y sin regresión de CLS.

#### 2.2 Auditar aplicaciones activas

- Estado: `[x]` Terminado el 2026-09-02; reemplazo funcional, ajuste visual y mensajes configurables aprobados, publicados y validados en producción.
- Responsables: ambos.
- Hallazgo remoto del 2026-08-31:
  - En la comparación inicial, el antiguo live `new look` tenía activos tres embeds de Editorify y el código global de Opinew que no aparecían en `SEO` antes de publicarse.
  - `templates/product.json` y `templates/page.opinew_all_reviews.json` contenían bloques de Opinew en `new look` y en la copia local, pero no en el theme `SEO` remoto.
  - La validación posterior a la publicación confirmó que los bloques antiguos de Opinew ya fallaban porque la ruta de la extensión no existe; no se observó un widget funcional perdido.
  - La integración de reseñas sigue pendiente de definición y reconstrucción, no de una copia automática de los bloques antiguos.
  - Evidencia detallada: `docs/seo/THEME-LIVE-VS-SEO-2026-08-31.md`.
- Aplicaciones y recursos inicialmente detectados:
  - Opinew.
  - Editorify.
  - Dondy WhatsApp.
  - Microsoft Clarity.
  - Shopify Forms.
  - Google Tag Manager / Google Analytics.
  - Meta Pixel.
  - Knasta.
  - Otros recursos de Shopify.
- Decisiones del propietario:
  1. `[x]` Aplicación que contiene reseñas reales: ninguna por ahora.
  2. `[x]` Aplicación de reseñas utilizada en fichas: ninguna.
  3. `[x]` Aplicación de reseñas con plan pagado: ninguna.
  4. `[x]` Proveedor que se conservará entre Opinew y Editorify: ninguno por ahora.
- Respuesta a “qué aplicaciones cargan en las fichas”:
  - App embeds activos globalmente en el theme live: Dondy WhatsApp, Microsoft Clarity y Shopify Forms.
  - Dondy muestra el botón flotante de WhatsApp tanto en fichas de neumáticos como de cascos.
  - Clarity y Forms cargan sus scripts globalmente, aunque no son contenido específico de la ficha.
  - No se detectaron scripts, estrellas, widgets ni nodos visibles de Opinew o Editorify en las dos fichas revisadas.
  - La plantilla live `templates/product.json` conserva una sección de aplicaciones vacía llamada `opinew-reviews-product-page-code`, pero no contiene ningún bloque de Opinew y no renderiza un widget.
  - Las otras nueve plantillas locales de producto no contienen bloques `shopify://apps`.
  - El theme también incluye un botón propio “Consulta stock por Whatsapp” en `snippets/product-form.liquid`; no es una app y solo aparece bajo la condición de producto sin disponibilidad definida en ese archivo.
- Diferencia local frente a live que debe preservarse:
  - El repositorio local todavía conserva bloques y app embeds históricos de Opinew y Editorify en `templates/product.json` y `config/settings_data.json`.
  - El theme live no los tiene activos. No se debe publicar ninguno de esos dos archivos sin reconciliar primero la diferencia, porque podría reactivar integraciones que el propietario decidió no usar.
- Evaluación de Dondy, plan gratuito:
  - La ficha oficial de Shopify indica que el plan gratuito ofrece botón de WhatsApp, conversaciones ilimitadas, ubicación y tamaño configurables y mensajes prellenados. Los informes, la inclusión automática de URL de producto, horarios y recuperación manual aparecen desde el plan Pro.
  - El uso live observado corresponde únicamente a un botón flotante de 63 × 63 px, fijo a 10 px de la esquina inferior derecha, que abre un enlace directo a WhatsApp.
  - En la ejecución Lighthouse posterior a 2.1, Dondy transfirió aproximadamente 65 KB de JavaScript y 3,7 KB de datos de API; el archivo representa unos 215 KB descomprimidos.
  - Lighthouse estimó alrededor de 164 ms de trabajo de arranque para `ChatBubble.js` y detectó aproximadamente 31 KB de JavaScript sin uso, 53% del archivo medido.
  - El propietario confirmó `+56 9 7767 0252` como número oficial. Las tres referencias locales que todavía utilizaban un número diferente fueron actualizadas.
  - Recomendación de Codex: reemplazar Dondy por un enlace propio `<a>` con SVG y CSS del theme, sin JavaScript ni peticiones externas. Puede conservar posición, tamaño, mensaje prellenado, accesibilidad y apertura en una pestaña nueva.
  - Beneficio esperado: eliminar cerca de 69 KB transferidos, una dependencia externa, una llamada de API y el trabajo de CPU asociado en todas las páginas.
  - Renuncia aceptable para el uso actual: se pierde la edición desde el panel de Dondy y cualquier capacidad futura de informes o automatización; el plan gratuito utilizado no aporta esas funciones avanzadas.
- Implementación publicada:
  - Se creó `snippets/whatsapp-floating-button.liquid` con un enlace directo a `wa.me`, SVG inline y CSS, sin JavaScript ni solicitudes externas.
  - El mensaje general incluye la URL canónica de la página. En productos también incluye automáticamente el título del producto.
  - El enlace usa `target="_blank"`, `rel="noopener noreferrer"`, etiqueta accesible `Escríbenos por WhatsApp` y foco visible para teclado.
  - El botón mide 60 × 60 px en escritorio y 56 × 56 px en móvil; permanece fijo a 12 px de la esquina inferior derecha.
  - Se actualizaron los dos CTA históricos del home y el botón de consulta de stock para utilizar el número oficial.
  - Los cuatro archivos aprobados se publicaron de forma aislada en el theme live `SEO` (`164560142557`) mediante Shopify CLI.
  - No se publicó el `config/settings_data.json` del repositorio, porque contiene diferencias históricas frente a la configuración live.
  - Para desactivar Dondy se descargó una copia nueva de la configuración remota, se cambió únicamente el campo `disabled` de su app embed de `false` a `true` y se volvió a subir esa copia remota.
- Validación local:
  - Home móvil, viewport 390 × 844: un solo botón propio, sin scripts ni nodos de Dondy, URL y número correctos y sin desbordamiento horizontal.
  - Producto móvil: el mensaje incluye título y canonical del producto; no aparece el número anterior en el HTML.
  - Home escritorio, viewport 1265 × 720: un solo botón de 60 px, posición fija correcta y sin desbordamiento horizontal.
  - `templates/index.json` y `config/settings_data.json` son JSON válidos.
  - Theme Check no reporta infracciones en los cinco archivos afectados; la salida global mantiene errores heredados en otros archivos.
- Validación en producción del 2026-09-02:
  - Los hashes remotos de los cuatro archivos publicados coinciden con la copia local aprobada.
  - La configuración remota confirma `disabled: true` exclusivamente para el app embed de Dondy; Microsoft Clarity y Shopify Forms no fueron modificados.
  - La home y una ficha de producto muestran un solo botón propio, usan `+56 9 7767 0252`, no contienen el número anterior y no presentan desbordamiento horizontal.
  - La ficha probada incluye el nombre y la URL canónica del producto en el mensaje prellenado.
  - No se detectaron scripts ni nodos de Dondy en el DOM público después de desactivar el embed.
  - Lighthouse pasó de 3 solicitudes y 67,2 KB transferidos por Dondy a 0 solicitudes y 0 KB en dos corridas posteriores.
  - La puntuación móvil general varió de 50 antes a 47 y 43 después; el LCP pasó de 2,86 s a 3,58 s y 3,45 s, y el TBT fue inestable. Esta variación no se atribuye al botón propio: la eliminación de Dondy está demostrada por la ausencia del recurso, pero se requieren datos de campo o más mediciones para evaluar el efecto neto sobre Core Web Vitals.
  - Evidencia: `outputs/lighthouse/phase-2-2-live-after-dondy-mobile.json` y `outputs/lighthouse/phase-2-2-live-after-dondy-mobile-run2.json`.
- Ajuste visual local solicitado el 2026-09-02:
  - Se sustituyó el trazado SVG inicial por una versión proporcionada y reconocible del ícono de WhatsApp, también aplicada al botón de consulta de stock.
  - Se agregó una sección **WhatsApp** en los ajustes globales del theme para editar el mensaje del botón flotante y el mensaje base de consulta de stock sin modificar código.
  - En productos, el botón flotante sigue agregando automáticamente el título y la URL; en la consulta de stock, el metafield `custom.mensaje_whatsapp` sigue teniendo prioridad cuando existe.
  - La nueva versión se validó en la vista previa local `http://127.0.0.1:9293/`: un solo botón, SVG de 32 × 32 px, enlace correcto y ausencia de Dondy.
  - El propietario aprobó el ajuste y se publicaron de forma aislada `config/settings_schema.json`, `snippets/whatsapp-floating-button.liquid` y `snippets/product-form.liquid`.
  - Los tres hashes remotos coinciden con los archivos locales aprobados. La home pública confirma el nuevo trazado, un único botón, mensaje predeterminado correcto, ausencia de Dondy y ausencia de desbordamiento horizontal.
  - La ficha pública probada conserva el número oficial y agrega correctamente el título y la URL del producto.
- Trabajo de Codex:
  - `[~]` Identificar scripts duplicados; los hallazgos de GTM se tratarán en 2.3.
  - `[x]` Revisar `opinew-active.js`: no carga en el live actual; la referencia corresponde a archivos o configuraciones históricas.
  - `[x]` Detectar aplicaciones de reseñas presentes pero no utilizadas: Opinew y Editorify no renderizan funcionalidad live.
  - `[x]` Verificar widgets de reseñas: no existe actualmente un widget que se pueda diferir.
  - `[x]` WhatsApp: reemplazo funcional, ajuste visual y mensajes editables publicados y validados; Dondy ya no carga en producción.
  - `[x]` Shopify Forms carga globalmente. La documentación oficial indica que su app embed es requisito para los formularios inline y emergentes; no puede desactivarse sin decidir primero si se conservan o reemplazan los formularios actuales.
- Trabajo del propietario en Shopify:
  1. `[x]` Confirmar el número oficial: `+56 9 7767 0252`.
  2. `[x]` Aprobar la sustitución de Dondy por el botón propio.
  3. `[x]` Codex implementa y valida primero el botón en la copia local.
  4. `[x]` Revisar visualmente la implementación local y aprobar su publicación.
  5. `[x]` Desactivar únicamente el app embed de Dondy después de publicar el reemplazo.
  6. `[x]` Mantener Dondy instalado mientras se comprobaba el botón propio y las métricas posteriores; no se desinstaló la aplicación.
  7. `[x]` No activar ni publicar bloques de Opinew o Editorify.
  8. `[x]` Revisar el nuevo ícono en la vista previa local y aprobarlo.
  9. `[x]` Publicar de forma aislada los tres archivos del ajuste visual.
- Restricción: no desinstalar una aplicación de reseñas antes de exportar o confirmar sus datos.

#### 2.3 Auditar Google Tag Manager

- Estado: `[x]` Completado el 2026-09-04; cambio publicado, validado técnicamente y confirmado en GA4 Tiempo real.
- Responsables: Codex audita e implementa; el propietario aprueba y valida GA4 en Tiempo real.
- Evidencia administrativa recibida:
  - `[x]` Exportación de la versión publicada 2 de `GTM-TTT6HMPN`.
  - `[x]` Captura de **Configuración > Eventos de clientes** con los píxeles de aplicaciones activos.
- Auditoría de Codex:
  - `[x]` Confirmar instalación manual de `GTM-TTT6HMPN` en `layout/theme.liquid`.
  - `[x]` Inventariar en la home pública GA4 `G-PSM69XC45C`, Google tag `GT-MB6TJCMM`, Google Ads `AW-16944591696`, Meta Pixel `626755473530641`, Clarity `wgxvai3ebp`, Shopify Web Pixels y Knasta.
  - `[x]` Confirmar dos solicitudes `page_view` al mismo GA4 en una sesión extendida de la home; una incluye `shopify_event_name=page_viewed`.
  - `[x]` Corregir las hipótesis previas: no se demostró una duplicación pública de Meta o Clarity y las múltiples solicitudes de Google Ads deben clasificarse por etiqueta antes de considerarlas duplicadas.
  - `[x]` Atribuir cada etiqueta a GTM o app pixel mediante los archivos administrativos.
  - `[x]` Revisar etiquetas, activadores, variables, consentimiento y ecommerce del contenedor: contiene únicamente `GA4 Config - Web`, activada en todas las páginas, sin ecommerce y con `consentStatus: NOT_SET`.
  - `[x]` Preparar una matriz conservar/corregir/pausar/eliminar y un plan de prueba reversible.
  - `[x]` Tras la aprobación, retirar localmente solo los dos bloques de `GTM-TTT6HMPN` de `layout/theme.liquid`.
  - `[x]` Validar en el theme de desarrollo que desaparecen GTM, `gtm.js` y `ns.html`, mientras permanecen Google & YouTube, Meta, Clarity y Smart Pricing.
  - `[x]` Publicar únicamente `layout/theme.liquid` y validar en producción la ausencia de GTM y la continuidad de los píxeles de Shopify.
  - `[x]` Confirmar en GA4 Tiempo real que la home y el evento `page_view` continúan recibiendo datos.
- Decisión aprobada: conservar los cuatro píxeles de aplicaciones y retirar la instalación manual de GTM, porque su única etiqueta duplica el GA4 administrado por **Google & YouTube**; registrada como D-015.
- Evidencia detallada: `docs/seo/GTM-AUDIT-2026-09-02.md`.
- Reversión: restaurar los dos bloques de GTM y volver a publicar únicamente `layout/theme.liquid` si falta alguna señal esperada.

#### 2.4 Reducir CSS y JavaScript global

- Estado: `[x]` Completado, aprobado, publicado y validado en producción el 2026-09-04.
- Responsable: Codex.
- Acciones:
  - Revisar los preloads en `head-assets.liquid`, alrededor de la línea 6.
  - Evitar marcar como prioritarios estilos que no son críticos.
  - Cargar CSS específico solo cuando la sección exista.
  - Cargar scripts con `defer` cuando sea seguro.
  - Eliminar scripts del tema que no tengan uso.
  - Reducir animaciones no compuestas.
  - Revisar carruseles duplicados o clones innecesarios.
  - Medir antes y después.
- Despliegue: ocho archivos publicados en el theme live `SEO` (`164560142557`) con `--nodelete` y `--allow-live`; la descarga posterior confirmó que todos los hashes coinciden con el paquete preparado.
- Protección de cambios: una modificación local previa y ajena a 2.4 en `sections/someone-purchased.liquid` se excluyó expresamente del paquete, conservando el valor remoto.
- Validación pública: home, colección de neumáticos y búsqueda funcionales, sin desbordamiento horizontal ni errores de consola; la home no carga los scripts globales retirados y la colección/búsqueda conservan `collection-main.js`.
- Evidencia detallada: `docs/seo/PERFORMANCE-AUDIT-2026-09-04.md`.

#### 2.5 Validación de rendimiento

- Estado: `[ ]` Ciclo correctivo aprobado, publicado y revalidado en producción el 2026-09-06. Shopify Forms se conserva por decisión D-016 y se acepta temporalmente la variación del TBT; el paso permanece en seguimiento hasta que Core Web Vitals reales incorpore el despliegue.
- Responsable: Codex.
- Método: tres ejecuciones por dispositivo y uso de la mediana, no de un único resultado.
- Validaciones:
  - `[x]` PageSpeed móvil y escritorio.
  - `[x]` LCP, CLS y Total Blocking Time.
  - `[x]` Payload total y JavaScript no utilizado.
  - `[x]` Carrito.
  - `[x]` Buscador general.
  - `[x]` Buscador de neumáticos.
  - `[x]` Reseñas.
  - `[x]` WhatsApp.
  - `[x]` Analytics.
- Medianas Lighthouse 13.4.1 iniciales del 2026-09-04:
  - Móvil: rendimiento 49, FCP 2,448 s, LCP 3,292 s, TBT 2,661 s, CLS 0,161, payload 3.517,5 KiB y 520,5 KiB de JavaScript no utilizado.
  - Escritorio: rendimiento 70, FCP 0,681 s, LCP 1,169 s, TBT 0,246 s, CLS 0,335, payload 4.257,6 KiB y 491,5 KiB de JavaScript no utilizado.
- Contraste PageSpeed posterior, una ejecución: móvil 80 con LCP 3,3 s, TBT 180 ms y CLS 0,16; escritorio 75 con LCP 1,5 s, TBT 80 ms y CLS 0,366.
- Core Web Vitals reales: la URL móvil no aprueba por CLS 0,13; escritorio tiene evaluación no aplicable por datos incompletos y CLS 0,28. El periodo medido, 5 de agosto a 1 de septiembre, todavía no incluye el despliegue del 4 de septiembre.
- Funciones: búsqueda general, buscador 120/70 R17, carrito, Google Reviews, WhatsApp y píxeles principales operativos.
- Incidencia original: después de pasar de carrito vacío a un producto aparecía `window.loadContry is not a function`. La copia local ya incorpora un fallback seguro y la repetición del flujo no produjo el error.
- Evidencia: `docs/seo/PERFORMANCE-VALIDATION-2-5-2026-09-04.md` y seis JSON en `outputs/lighthouse-2-5-2026-09-04/`.
- Diagnóstico local posterior, una ejecución por dispositivo el 2026-09-06:
  - Móvil: CLS 0,025 frente a la mediana pública anterior de 0,161.
  - Escritorio: CLS 0,032 frente a la mediana pública anterior de 0,335.
  - Las puntuaciones y tiempos del proxy local no se comparan con producción; estas ejecuciones se utilizan para verificar geometría y estabilidad.
  - Evidencia: `outputs/lighthouse-2-5-corrections-2026-09-06/mobile-06.json` y `desktop-01.json`.
- Despliegue correctivo del 2026-09-06:
  - El propietario aprobó la presentación visual y se publicaron de forma aislada ocho archivos en el theme live `SEO` (`164560142557`), con `--nodelete` y `--allow-live`.
  - La comparación previa no encontró cambios remotos ajenos en esos archivos y la descarga posterior confirmó que los ocho hashes SHA-256 remotos coinciden con los locales.
  - La home pública mantiene un H1, no presenta desbordamiento horizontal, reserva 350 px de hero en escritorio y 250 px en móvil y muestra nueve logos sin slides duplicados.
  - La ficha de Michelin y el drawer del carrito funcionan, muestran una unidad y subtotal de $248.391 y no registran `window.loadContry is not a function` ni otros errores de consola.
- Medianas Lighthouse 13.4.1 posteriores, tres ejecuciones públicas por dispositivo:
  - Móvil: rendimiento 58, FCP 2,377 s, LCP 2,602 s, TBT 3,807 s, CLS 0,025, Speed Index 5,437 s, payload 3.526,0 KiB, 479,6 KiB de JavaScript no utilizado y 31,618 s de trabajo del hilo principal.
  - Escritorio: rendimiento 81, FCP 0,627 s, LCP 0,717 s, TBT 0,380 s, CLS 0,035, Speed Index 1,647 s, payload 3.798,8 KiB, 520,2 KiB de JavaScript no utilizado y 7,129 s de trabajo del hilo principal.
  - Frente a la línea base, CLS bajó aproximadamente 85% en móvil y 90% en escritorio; LCP mejoró 0,690 s y 0,452 s, respectivamente. TBT continúa muy variable y empeoró en este laboratorio local.
  - Evidencia: seis JSON en `outputs/lighthouse-2-5-live-after-cls-2026-09-06/`.
- Contraste PageSpeed del 2026-09-06, una ejecución independiente:
  - Móvil: rendimiento 96, FCP 2,0 s, LCP 2,5 s, TBT 30 ms, CLS 0, Speed Index 2,2 s, payload 2.669 KiB y 240 KiB de JavaScript no utilizado.
  - Escritorio: rendimiento 98, FCP 0,6 s, LCP 1,1 s, TBT 10 ms, CLS 0,033, Speed Index 0,8 s, payload 3.166 KiB y 240 KiB de JavaScript no utilizado.
  - Informe: `https://pagespeed.web.dev/analysis/https-www-bikerz-cl/8jli3nbc17?form_factor=mobile`.
  - CrUX todavía no permite atribuir el cambio: su ventana móvil de 28 días muestra LCP 2,1 s, INP 132 ms y CLS 0,13; escritorio muestra LCP 2,2 s, INP 108 ms y CLS 0,28. La mayor parte del periodo precede al despliegue.
- Control móvil de Shopify Forms, tres ejecuciones sin modificar la tienda:
  - Se bloqueó únicamente la descarga de `forms-2548/assets/index.js` dentro de Lighthouse; el app embed público continuó activo.
  - Mediana: rendimiento 59, FCP 2,392 s, LCP 2,726 s, TBT 3,251 s, CLS 0,025, Speed Index 3,752 s, payload 3.240,7 KiB, 281,6 KiB de JavaScript no utilizado y 27,894 s de trabajo del hilo principal.
  - Frente a la medición con Forms, mejora un punto, reduce 556 ms de TBT, 1,685 s de Speed Index, 285,3 KiB de payload, 198,0 KiB de JavaScript no utilizado y 3,724 s de trabajo del hilo. No alcanza por sí solo el objetivo de TBT inferior a 500 ms.
  - Recomendación técnica-comercial: conservar Forms si el popup del 10% tiene valor o conversiones medibles, porque retirarlo no resuelve el TBT y PageSpeed ya obtiene 96 móvil; registrar una excepción controlada y reevaluar con conversiones y CrUX. Si no genera registros o ventas, retirarlo sí elimina peso evitable.
  - Evidencia: tres JSON en `outputs/lighthouse-2-5-forms-control-2026-09-06/`.
- Criterio de término:
  - `[ ]` PageSpeed móvil inicial mínimo de 60–70 de forma consistente: PageSpeed aprueba con 96, pero la mediana Lighthouse quedó en 58.
  - `[ ]` TBT móvil inferior a 500 ms de forma consistente: PageSpeed dio 30 ms, pero la mediana Lighthouse fue 3.807 ms.
  - `[x]` Sin regresiones en el agregado principal al carrito ni en la medición; la incidencia del calculador de despacho ya no se reproduce en producción.
  - `[ ]` Core Web Vitals reales aprobados: el dato acumulado aún conserva CLS 0,13 en móvil y 0,28 en escritorio.
- Correcciones antes de repetir la validación:
  1. `[x]` Estabilizar la altura inicial de `Conoce nuestros productos` y revisar el carrusel de marcas precedente.
  2. `[x]` Corregir la inicialización de `loadContry` al agregar el primer producto.
  3. `[x]` Revisar el comportamiento de Swiper que generaba clones y reordenamientos en el carrusel de marcas; se reemplazó `loop` por `rewind`, se restauró el intervalo de 5 segundos y se fijaron columnas estables por breakpoint.
  4. `[x]` El propietario decidió conservar Shopify Forms y aceptar temporalmente su coste; no se modifica el alcance de Clarity ni Meta sin nueva evidencia. Decisión D-016.
  5. `[x]` Repetir tres pruebas por dispositivo; los criterios aún no son consistentes, por lo que 2.5 no se cierra.

### Fase 3 — Accesibilidad, imágenes y HTML

- Duración estimada: 3–5 días.
- Objetivo: corregir barreras de accesibilidad y errores de marcado que afectan comprensión, navegación o renderizado.

#### 3.1 Textos alternativos

- Estado: `[x]` Aprobado, publicado y validado en producción el 2026-09-07.
- Responsable de código: Codex.
- Trabajo de Codex:
  - `[x]` Agregar fallback de `alt` para logos de marcas.
  - `[x]` Agregar `alt` para imágenes de categorías.
  - `[x]` Evitar usar el nombre del archivo como texto alternativo en las tarjetas de producto.
  - `[x]` Usar `alt=""` solamente en imágenes genuinamente decorativas: fondo redundante y segunda imagen de hover.
  - `[x]` Revisar las 28 imágenes inicialmente detectadas sin descripción útil: 17 vacías o sin atributo y 11 con textos técnicos.
- Trabajo del propietario en Shopify:
  - `[x]` Aprobar visualmente la home local; el cambio no modificó el layout.
  - Mantenimiento editorial continuo: completar en el futuro los textos particulares de banners, fotografías de producto, taller y artículos cuando una descripción automática no represente suficientemente el contenido real. No bloquea el cierre de 3.1.
- Criterio: descripciones breves, relevantes y generalmente menores a 125 caracteres.
- Resultado local:
  - 0 imágenes sin atributo `alt`.
  - 0 textos técnicos como `01`, `02` o rutas de archivos.
  - 0 textos alternativos de más de 125 caracteres.
  - Lighthouse: auditoría `image-alt` aprobada con puntuación 1 y 0 elementos infractores; accesibilidad total 85.
  - La configuración vigente de la home en Shopify no se sobrescribió: los fallbacks funcionan desde Liquid y conservan los cambios remotos del hero y la quinta categoría `Ofertas`.
  - Evidencia: `docs/seo/ALT-TEXT-AUDIT-3-1-2026-09-06.md` y `outputs/lighthouse-3-1-alt-local-2026-09-06.json`.
- Resultado en producción:
  - Los ocho archivos descargados después del despliegue coinciden por SHA-256 con el paquete aislado aprobado.
  - 0 imágenes sin atributo `alt`, 0 textos técnicos y 0 textos mayores de 125 caracteres.
  - Hero vigente: `Ofertas para motos en Bikerz`; quinta categoría vigente: `Ofertas`; logo móvil: `Bikerz`; nueve marcas con descripción.
  - Lighthouse público: `image-alt` aprobado con puntuación 1, 0 elementos infractores y accesibilidad total 85.
  - Control estructural: un H1, cinco tarjetas de categoría, nueve marcas, un enlace de WhatsApp y ningún desbordamiento horizontal.
  - Evidencia: `outputs/lighthouse-3-1-alt-live-2026-09-07.json`.

#### 3.2 Etiquetas del buscador de neumáticos

- Estado: `[x]` Aprobado, publicado y validado en producción el 2026-09-07.
- Responsable: Codex.
- Trabajo de Codex:
  - `[x]` Asociar Ancho, Perfil y Aro con su `<label for>`.
  - `[x]` Generar IDs únicos a partir de `section.id`.
  - `[x]` Explicar de forma accesible que Aro es obligatorio y Ancho y Perfil son opcionales.
  - `[x]` Exponer el estado de carga y anunciar las opciones dependientes sin agregar texto visible.
  - `[x]` Excluir los números y las flechas decorativas del árbol de accesibilidad.
  - `[x]` Agregar foco visible a selectores y botón.
  - `[x]` Limitar el JavaScript a la instancia actual de la sección.
- Validación local:
  - 117 combinaciones cargadas y estado `aria-busy="false"` al terminar.
  - 0 IDs duplicados dentro del buscador.
  - Orden de teclado aprobado: Ancho → Perfil → Aro → Buscar neumáticos.
  - Al elegir Aro 10 quedaron 5 anchos y 2 perfiles compatibles; el botón se habilitó.
  - Destino aprobado: `/collections/neumaticos?filter.p.m.custom.di_metro=10`.
  - La geometría de escritorio coincide exactamente con producción: bloque de 1265 × 197 px y mismos tamaños y posiciones de los cuatro controles.
  - En un viewport responsive de 919 px también coinciden: bloque de 904 × 318 px y misma distribución en dos columnas.
  - Theme Check aislado: 0 infracciones.
- Trabajo del propietario:
  - `[x]` Revisar el buscador en `http://127.0.0.1:9292/` y confirmar el resultado visual.
- Resultado en producción:
  - Se publicó únicamente `sections/tire-finder.liquid` en el theme live `SEO` (`164560142557`).
  - La descarga posterior coincide por SHA-256 con el archivo aprobado: `0CC0696C1CAA104DD17888A37D18EC939BD345BF1D57C6892D2325B365B63CAA`.
  - 117 combinaciones cargadas; 20 anchos, 10 perfiles y 12 aros disponibles inicialmente.
  - 0 IDs duplicados dentro del buscador, 2 regiones vivas y 0 símbolos decorativos expuestos.
  - Al elegir Aro 10 quedaron 5 anchos y 2 perfiles compatibles; el botón abrió la colección con el filtro correcto.
  - Orden de teclado y foco visible aprobados en la web pública.
- Evidencia: `docs/seo/ACCESSIBILITY-AUDIT-3-2-2026-09-07.md`.

#### 3.3 Enlaces sin nombre

- Estado: `[x]`
- Responsable: Codex.
- Cierre: implementado localmente el 2026-09-07, aprobado y publicado el 2026-09-12.
- Acciones:
  - Revisar los 36 enlaces vacíos inicialmente detectados.
  - Agregar `aria-label` a iconos necesarios.
  - Eliminar enlaces invisibles duplicados.
  - Corregir el enlace absoluto superpuesto al hero.
  - Dar nombre a los controles de sliders.
  - Evitar que enlaces decorativos queden en el orden de tabulación.

#### 3.4 IDs duplicados

- Estado: `[x]` Cerrado el 2026-09-14; implementado, aprobado, publicado y validado en producción.
- Responsable: Codex.
- Trabajo de Codex:
  - `[x]` Corregir `ProductSubmitButton-` en tarjetas y separar el botón principal del botón fijo con sufijo `-sticky`.
  - `[x]` Eliminar IDs innecesarios de tarjetas clonadas por Swiper y conservar sus clases y comportamiento.
  - `[x]` Corregir los formularios de localización con prefijos independientes para barra superior y menú móvil.
  - `[x]` Mantener un solo `cart-icon-bubble` y sincronizar el contador de la barra móvil sin duplicar el ID.
  - `[x]` Corregir IDs y referencias de buscador predictivo, resultados, filtros, rango de precio y notas del carrito.
  - `[x]` Verificar `label`, `for`, `aria-controls`, `aria-labelledby` y `aria-describedby` en plantillas representativas.
- Validación local y pública:
  - Home: 0 IDs duplicados, 0 referencias rotas, un H1 y 0 px de desbordamiento horizontal.
  - Colección de neumáticos: 0 duplicados y 0 referencias rotas antes y después de aplicar un filtro AJAX.
  - Resultados de búsqueda, ficha de producto, carrito y contacto: 0 duplicados y 0 referencias rotas.
  - Los botones principal y fijo agregaron al carrito; el drawer y la eliminación funcionaron y ambos contadores quedaron sincronizados.
  - El buscador predictivo devolvió ocho enlaces; idioma y carrusel conservaron su operación.
  - No se observaron errores ni advertencias de consola en los controles finales.
  - Antes de publicar, los 21 archivos remotos coincidían con la línea base pública conocida; no había cambios online nuevos que fusionar.
  - Se publicó un paquete aislado en el theme live `SEO` (`164560142557`) con `--nodelete` y `--allow-live`.
  - Se excluyó de cinco snippets el cambio local pendiente de T-01 sobre `within: collection`.
  - La descarga posterior confirmó 21 de 21 hashes SHA-256 idénticos al paquete aprobado.
  - En producción, home, colección, búsqueda, ficha, carrito y contacto mantienen 0 IDs duplicados y 0 referencias rotas.
- Trabajo del propietario:
  - `[x]` Revisar la home, una ficha y el carrito en `http://127.0.0.1:9292/` y aprobar la publicación aislada.
- Evidencia: `docs/seo/ID-AUDIT-3-4-2026-09-14.md`.

#### 3.5 Errores Liquid y HTML

- Estado: `[x]` Cerrado el 2026-09-14; implementado, aprobado, publicado y validado en producción.
- Responsable: Codex.
- Trabajo de Codex:
  - `[x]` Ejecutar y clasificar Theme Check: 1.288 hallazgos, 938 errores y 350 advertencias en la línea base.
  - `[x]` Separar 897 errores heredados de traducciones de los 41 errores con posible impacto real.
  - `[x]` Corregir sintaxis Liquid inválida en logo, banners, buscador, producto, tarjetas comparables, bundles y breadcrumbs.
  - `[x]` Corregir HTML inválido en formularios de producto y tarjeta de regalo.
  - `[x]` Corregir assets e iconos inexistentes en blog, producto y tarjeta de regalo.
  - `[x]` Añadir H1 semántico y visualmente oculto a contacto sin modificar su diseño.
  - `[x]` Mantener un único H1 en producto y artículo; normalizar los H1 internos del contenido editorial a H2.
  - `[x]` Completar `alt`, dimensiones, nombres accesibles e IDs en las plantillas afectadas.
  - `[x]` Validar home, contacto, búsqueda, producto, blog y artículo: un H1, cero IDs repetidos, referencias rotas, imágenes sin `alt`, imágenes sin dimensiones, interactivos anidados y desbordamiento.
  - `[x]` Repetir Theme Check: 903 errores, de los cuales 897 son diferencias de traducciones; quedan seis errores no relacionados con traducciones y ninguno afecta una rama activa de la tienda en español.
  - `[x]` Clasificar los `<style>` dentro del cuerpo como deuda diferida de secciones dinámicas; moverlos requiere reestructurar cada sección y puede afectar el editor del theme.
  - `[x]` Comparar dos veces los 18 archivos remotos antes de publicar; no se detectaron cambios online nuevos.
  - `[x]` Excluir del paquete los cambios locales pendientes de T-01 y conservar `within: collection` en los dos snippets afectados.
  - `[x]` Publicar 18 archivos con `--nodelete` y validar coincidencia SHA-256 de 18 de 18 archivos remotos.
  - `[x]` Repetir en producción la validación de home, contacto, búsqueda, producto, blog y artículo sin errores de DOM ni consola.
- Trabajo del propietario:
  - `[x]` Revisar visualmente home, contacto, una ficha y el artículo CEAT Zoom XL en la copia local.
  - `[ ]` Cambiar en el editor del artículo el texto antiguo `WhatsApp +56 9 5770 9915` por el número oficial `+56 9 7767 0252`; el enlace ya apunta al número oficial.
  - `[x]` Aprobar la publicación aislada del paquete 3.5.
- Regla: no intentar eliminar mecánicamente todos los errores reportados; primero se resuelven los que afectan renderizado, accesibilidad o comportamiento.
- Evidencia: `docs/seo/LIQUID-HTML-AUDIT-3-5-2026-09-14.md`.

### Fase 4 — Datos estructurados y SEO local

- Duración estimada: 2–4 días.
- Objetivo: representar correctamente el negocio, reforzar las señales locales y mantener coherencia entre el sitio y Google Business Profile.

#### 4.1 Información que debe entregar el propietario

- Estado: `[ ]`
- Responsable: propietario.
- Información requerida:
  - Nombre comercial exacto.
  - Razón social, si debe mostrarse.
  - Dirección completa.
  - Código postal.
  - Comuna.
  - Región.
  - Coordenadas de Google Maps.
  - Teléfono principal definitivo.
  - Teléfono secundario, si corresponde.
  - Correo público.
  - Horarios por día.
  - Días feriados o excepciones.
  - URL de Google Business Profile.
  - Instagram, Facebook, TikTok y YouTube definitivos.
  - Servicios del taller.
  - Zonas de despacho.
  - Métodos de pago.
  - Política de cambios.
  - Política de devoluciones.
  - Política de despacho.
  - Existencia de retiro en tienda.
  - Logotipo oficial.
  - Fotografía del local.

#### 4.2 Rehacer el JSON-LD

- Estado: `[ ]`
- Responsable: Codex.
- Implementación prevista:
  - `Organization` o subtipo comercial exacto.
  - `WebSite`.
  - Información del establecimiento físico.
  - `PostalAddress`.
  - `ContactPoint`.
  - `sameAs` sin valores vacíos.
  - `openingHoursSpecification`.
  - `geo`.
  - `areaServed`.
  - Referencias internas mediante `@id`.
  - Enlace al logo y a las redes oficiales.
- Restricción: no marcar las reseñas de Google como `aggregateRating` propio sin comprobar que cumpla las políticas sobre reseñas autorreferenciales.
- Validación:
  - Rich Results Test.
  - Schema.org Validator.
  - PageSpeed.
  - Inspección del DOM.

#### 4.3 Google Business Profile

- Estado: `[ ]`
- Responsable principal: propietario.
- Trabajo del propietario:
  - Verificar que nombre, dirección y teléfono coincidan exactamente con el sitio.
  - Seleccionar categorías primarias y secundarias reales.
  - Agregar servicios del taller.
  - Agregar horarios.
  - Agregar productos o categorías cuando corresponda.
  - Subir fotos nuevas del local y taller.
  - Responder todas las reseñas recientes.
  - Crear un proceso para solicitar reseñas a clientes reales.
  - Publicar novedades o promociones periódicamente.
  - Revisar enlaces de sitio, teléfono y WhatsApp.
- Apoyo de Codex:
  - Preparar una descripción optimizada del negocio.
  - Preparar el listado de servicios.
  - Crear plantillas de respuesta a reseñas.
  - Crear mensajes para solicitar reseñas.
  - Preparar un calendario de publicaciones locales.

### Fase 5 — Arquitectura de categorías y landing pages

- Duración estimada: semanas 3–8.
- Objetivo: crear páginas transaccionales limpias para intenciones respaldadas por demanda, inventario y variedad suficiente.

#### 5.1 Crear URLs limpias por intención

- Estado: `[ ]`
- Responsable: Codex prepara estructura, copy y plantilla; propietario aprueba el catálogo.
- Neumáticos por uso:
  - `/collections/neumaticos-trail-adventure`
  - `/collections/neumaticos-scooter`
  - `/collections/neumaticos-sport-street`
  - `/collections/neumaticos-chopper-custom`
  - `/collections/neumaticos-enduro-motocross`
  - `/collections/neumaticos-para-lluvia`
- Neumáticos por medida, sujetos a datos de ventas y Search Console:
  - `120/70-17`.
  - `180/55-17`.
  - `110/70-17`.
  - `150/60-17`.
  - `90/90-21`.
- Regla: no crear páginas para todas las combinaciones; solo para medidas con inventario, demanda y variedad suficiente.
- Neumáticos por marca:
  - Michelin.
  - Dunlop.
  - Continental.
  - CEAT.
  - Anlas.
  - Maggion.
  - Eurogrip.
- Cascos:
  - Integrales.
  - Abatibles o modulares.
  - Adventure o trail.
  - Urbanos.
  - ECE 22.06.
  - Por marca.
- Servicios locales:
  - Cambio de neumáticos para moto en Santiago.
  - Instalación y balanceo.
  - Reparación de pinchazos.
  - Taller de motos en Macul.
  - Mantención preventiva.

#### 5.2 Estructura obligatoria de cada landing

- Estado: `[ ]`
- Responsable: Codex.
- Cada página tendrá:
  - Title único menor a 60 caracteres.
  - Meta description menor a 160 caracteres.
  - Un H1.
  - Introducción de 150–300 palabras.
  - Productos compatibles.
  - Explicación del tipo de uso.
  - Criterios para elegir.
  - Marcas disponibles.
  - Preguntas frecuentes visibles.
  - Enlaces a artículos relacionados.
  - Enlaces a páginas superiores e inferiores.
  - CTA de compra o asesoría.
  - Breadcrumbs.
  - Imagen con `alt` descriptivo.
  - Canonical propia.
  - Independencia de URLs con parámetros de filtros.

#### 5.3 Datos que debe entregar el propietario

- Estado: `[ ]`
- Responsable: propietario.
- Datos requeridos:
  - Categorías más rentables.
  - Productos con stock estable.
  - Marcas prioritarias.
  - Medidas más vendidas.
  - Productos que no conviene promocionar.
  - Servicios disponibles realmente.
  - Precios o promociones que cambien frecuentemente.
  - Diferenciadores reales frente a competidores.

### Fase 6 — Plan editorial

- Duración estimada: semanas 4–12 y luego continuo.
- Estado general: `[ ]`
- Responsables: Codex redacta; propietario revisa técnicamente y publica.

#### 6.1 Contenidos iniciales

1. Cómo leer la medida de un neumático de moto.
2. Cuándo cambiar los neumáticos de una moto.
3. Qué neumático elegir para lluvia y ciudad en Chile.
4. Neumáticos trail 80/20 vs. 50/50.
5. Neumáticos con cámara vs. tubeless.
6. Cómo elegir neumáticos para scooter.
7. Qué significa la certificación ECE 22.06 en un casco.
8. Casco integral, modular o adventure: diferencias.
9. Cómo saber si un repuesto es compatible con tu moto.
10. Guía de mantención preventiva antes de viajar.
11. Mejores neumáticos para conducción urbana en Santiago.
12. Cómo preparar la moto para invierno.

#### 6.2 Requisitos de cada artículo

- Una consulta principal.
- Preguntas secundarias.
- Enlaces a 2–4 categorías.
- Enlaces a productos relevantes.
- Enlaces a dos artículos relacionados.
- CTA de asesoría.
- Autor o revisor técnico.
- Fecha de revisión.
- Imágenes propias cuando sea posible.
- Ninguna afirmación técnica o legal sin fuente o revisión.

#### 6.3 Cadencia recomendada

- Primer mes: un artículo semanal.
- Meses siguientes: dos artículos mensuales.
- Actualización de artículos existentes: uno o dos por mes.

### Fase 7 — Autoridad y enlaces externos

- Duración: desde la semana 6.
- Estado general: `[ ]`
- Objetivo: conseguir menciones y enlaces legítimos que refuercen la autoridad temática y local de Bikerz.

#### 7.1 Tareas del propietario

- Solicitar a Michelin, Dunlop, Continental, CEAT y otras marcas que incluyan a Bikerz como distribuidor.
- Conseguir enlaces desde proveedores oficiales.
- Colaborar con talleres, clubes y escuelas de conducción.
- Ofrecer pruebas o comparativas de productos a medios chilenos de motos.
- Participar en eventos y rutas.
- Buscar menciones en directorios comerciales relevantes.
- Mantener coherentes el nombre, la dirección y el teléfono.
- Evitar comprar paquetes de backlinks.

#### 7.2 Apoyo de Codex

- Identificar oportunidades.
- Crear una lista de dominios.
- Evaluar la calidad de los enlaces.
- Redactar correos de contacto.
- Preparar páginas para campañas.
- Crear material editorial para colaboraciones.
- Controlar enlaces conseguidos o perdidos.

### Fase 8 — Medición y mantenimiento

- Duración: continua.
- Estado general: `[ ]`
- Objetivo: evaluar el impacto con ventanas comparables, detectar problemas y priorizar el siguiente ciclo de trabajo.

#### 8.1 Revisión semanal

- Responsables: ambos.
- Registrar:
  - Cambios publicados.
  - Fecha de publicación.
  - URL afectada.
  - Clics e impresiones.
  - CTR.
  - Posición.
  - Sesiones orgánicas.
  - Ventas orgánicas.
  - Tasa de conversión.
  - Errores de indexación.
  - PageSpeed.
  - Estado de Core Web Vitals.

#### 8.2 Revisión mensual

- Responsables: Codex analiza; propietario entrega los datos.
- Acciones:
  - Comparar 28 días con los 28 días anteriores.
  - Separar búsquedas de marca y genéricas.
  - Revisar páginas en posiciones 4–20.
  - Revisar páginas con impresiones y CTR bajo.
  - Revisar contenido que perdió tráfico.
  - Detectar canibalización.
  - Actualizar enlaces internos.
  - Actualizar precios, stock o afirmaciones obsoletas.
  - Revisar páginas indexadas con parámetros.
  - Priorizar el siguiente mes.
- Regla de interpretación: no juzgar un cambio de title después de dos días. Los cambios técnicos pueden observarse rápido, pero el contenido y las nuevas landing pages suelen requerir varias semanas de rastreo y evaluación.

## 5. Registro de decisiones

### D-001 — Hipótesis inicial de foco exclusivo en neumáticos, superada

- Fecha: 2026-08-15.
- Hipótesis inicial: orientar la home a `neumáticos para motos en Chile` porque Search Console mostraba mayor visibilidad genérica que la colección.
- Revisión: el mapa aprobado en D-009 asigna a la home una intención comercial más amplia y reserva la intención transaccional exacta de neumáticos para `/collections/neumaticos`.
- Estado: superada por D-009. Se conserva únicamente como antecedente para explicar por qué la migración debe ser gradual y medirse durante 28 días.

### D-002 — No tratar todas las alternativas con canonical como errores

- Fecha: 2026-08-15.
- Motivo: la mayoría son variantes, rutas de colección y parámetros que Google consolida en la URL limpia.
- Acción: reducir enlaces internos duplicados y vigilar cambios, sin quitar canonical correctos.

### D-003 — No desbloquear filtros y búsquedas de forma general

- Fecha: 2026-08-15.
- Motivo: pueden crear combinaciones casi infinitas y páginas delgadas.
- Acción: crear páginas estáticas solo para demandas e inventarios justificables.

### D-004 — Redirigir solo cuando exista equivalencia

- Fecha: 2026-08-15.
- Motivo: enviar todas las 404 a la home produce mala experiencia y señales poco útiles.
- Acción: mantener 404 para URLs basura y definir sustitutos reales para productos antiguos.

### D-005 — Actualizar contenido con autoridad antes de publicar en volumen

- Fecha: 2026-08-15.
- Motivo: varios artículos ya tienen decenas de miles de impresiones, posiciones aprovechables y CTR bajo.

### D-006 — Implementación únicamente mediante theme no publicado

- Fecha: 2026-08-15.
- Motivo: permitir revisión técnica y visual antes de afectar producción.

### D-007 — No mezclar modelos de atribución

- Fecha: 2026-08-25.
- Decisión: presentar por separado GA4, Shopify Analytics directo y la reconstrucción desde customer journey.
- Motivo: los reportes directos de Shopify identifican 20 órdenes desde buscadores, mientras que la reconstrucción identifica 65 órdenes bajo criterio estricto y 94 bajo criterio principal.
- Implicación: la fase 0 conservará una cifra oficial o directamente exportada y escenarios de sensibilidad separados, nunca una suma o promedio entre modelos.

### D-008 — GA4 como línea base de comportamiento orgánico

- Fecha: 2026-08-26.
- Decisión: usar GA4 con filtro `Organic Search` para sesiones, embudo, landing pages, productos y dispositivos.
- Control: usar Shopify Analytics directo para contrastar sesiones, órdenes y ventas provenientes de buscadores.
- Motivo: ambos reportes cubren 2025-08-01 a 2026-07-31 y sus compras y tasas de conversión están razonablemente alineadas.
- Restricción: las compras atribuidas a checkout, `thank-you` o contacto se conservan como anomalías de medición y no se reinterpretan como rendimiento real de esas landing.

### D-009 — Intención principal aprobada por página

- Fecha: 2026-08-26.
- Home: `tienda de neumáticos y equipamiento para motos en Chile`.
- Neumáticos: `neumáticos para motos en Chile`.
- Cascos: `cascos para motos en Chile`.
- Repuestos: `repuestos para motos en Chile`.
- Lubricantes: `aceites para motos en Chile`.
- Servicios: `cambio de neumáticos para motos en Santiago`.
- Blog: `blog de motos en Chile`.
- Regla: reforzar primero la colección de neumáticos y después ampliar la intención de la home, midiendo ambas URLs en ventanas comparables de 28 días.

### D-010 — Metadata de la home publicada y validada

- Fecha: 2026-08-29.
- Título: `Neumáticos y Repuestos para Motos en Chile | Bikerz`.
- Meta description: `Compra neumáticos, repuestos, cascos y lubricantes para motos con despacho a todo Chile. Buscador por medida, asesoría experta y taller en Santiago.`
- Validación: respuesta del servidor `HTTP 200`, metadata coincidente en HTML y DOM, canonical correcto y etiquetas Open Graph alineadas.
- Diferenciación: la colección conserva el título `Neumáticos para Motos – Bikerz` y el H1 `Neumáticos para Motos`, por lo que no existe una duplicación exacta con la home.
- Seguimiento: medir consultas, clics, impresiones, CTR y posición de ambas URLs hasta el primer corte del 2026-09-26.

### D-011 — H1 visible con presentación compacta

- Fecha: 2026-08-29.
- Decisión: mantener el H1 semántico `Neumáticos, repuestos y equipamiento para motos en Chile` dentro del bloque estable que ya existía después de las categorías.
- Presentación: 20 px en escritorio/tablet y 18 px en móvil; el tamaño visual no depende del nivel semántico del encabezado.
- Motivo: la primera propuesta, más grande y situada antes del catálogo, alteraba la estética aprobada de la home.
- Restricción: el H1 debe permanecer visible; no se permite ocultarlo con CSS ni sustituirlo por una imagen.

### D-012 — Mantener oculto `product_meta` en productos de neumáticos

- Fecha: 2026-08-31.
- Decisión: conservar desactivado el bloque `product_meta` de `templates/product.neumaticos.json`.
- Efecto visible aceptado: la ficha de neumático no muestra el bloque adicional de SKU, disponibilidad y categoría; otros indicadores de stock del producto no se modifican con esta decisión.
- Contexto: la comparación posterior al cambio de theme confirmó que el antiguo live mostraba `Categoría` y el nuevo live no la muestra.
- Aprobación: propietario.

### D-013 — No utilizar una aplicación de reseñas por ahora

- Fecha: 2026-08-31.
- Decisión: no utilizar ni conservar por ahora Opinew o Editorify como proveedor principal de reseñas.
- Motivo: ninguna de las dos aplicaciones contiene actualmente reseñas reales, se usa funcionalmente en fichas o tiene un plan pagado que deba protegerse.
- Restricción: no reactivar app embeds ni bloques históricos de Opinew o Editorify sin una nueva decisión del propietario.
- Aprobación: propietario.

### D-014 — Número oficial y reemplazo de Dondy

- Fecha: 2026-08-31.
- Número oficial de WhatsApp: `+56 9 7767 0252`.
- Decisión: reemplazar el botón gratuito de Dondy por un botón propio del theme sin JavaScript.
- Alcance: unificar todos los CTA de WhatsApp, incluir contexto de página o producto en el mensaje y conservar un botón flotante accesible.
- Despliegue: completado el 2026-09-02 en el theme live `SEO`; el app embed de Dondy quedó desactivado inmediatamente después de la publicación y la aplicación permanece instalada.
- Ajuste posterior: el propietario solicitó mejorar el trazado del ícono y poder editar los mensajes desde el theme; la versión corregida fue aprobada y publicada el 2026-09-02.
- Aprobación: propietario.

### D-015 — Google & YouTube como integración principal de GA4

- Fecha: 2026-09-02.
- Decisión: conservar **Google & YouTube**, Facebook & Instagram, Microsoft Clarity y Smart Pricing; retirar del theme únicamente el script y el `noscript` manuales de `GTM-TTT6HMPN`.
- Motivo: el contenedor publicado contiene solamente `GA4 Config - Web` para `G-PSM69XC45C` en todas las páginas y duplica la medición ya administrada por **Google & YouTube**.
- Restricción: no modificar ni eliminar el contenedor de GTM y no desconectar los píxeles de aplicaciones de Shopify.
- Estado de despliegue: publicado únicamente `layout/theme.liquid` en el theme live `SEO`; hash remoto idéntico a la copia aprobada y validación pública correcta.
- Aprobación: propietario.

### D-016 — Conservar Shopify Forms y aceptar temporalmente su coste

- Fecha: 2026-09-06.
- Decisión: mantener activo globalmente Shopify Forms para conservar el popup comercial del 10% de descuento.
- Evidencia: PageSpeed con Forms activo obtuvo 96 puntos en móvil, LCP 2,5 s, TBT 30 ms y CLS 0. En tres simulaciones móviles sin su JavaScript, la mediana Lighthouse solo subió de 58 a 59 y el TBT bajó de 3,807 s a 3,251 s, por lo que retirarlo no resuelve por sí solo el umbral local.
- Coste aceptado: aproximadamente 285,3 KiB adicionales de payload, 198,0 KiB adicionales de JavaScript no utilizado y 556 ms de TBT en la comparación de medianas locales.
- Excepción: se acepta temporalmente la inconsistencia del TBT entre el laboratorio local y PageSpeed, sin considerar que el problema esté técnicamente resuelto.
- Seguimiento: comprobar registros o ventas atribuidos al popup y revisar CrUX cuando la ventana de 28 días incluya el despliegue, con primer corte el 2026-10-04.
- Condición de reapertura: retirar o sustituir Forms si no produce valor comercial demostrable, si PageSpeed móvil cae bajo 60 o si los datos reales mantienen métricas deficientes después del periodo de observación.
- Aprobación: propietario.

### D-017 — Fallbacks de textos alternativos sin sobrescribir la configuración de la home

- Fecha: 2026-09-07.
- Decisión: resolver 3.1 mediante fallbacks de Liquid para logo móvil, marcas, categorías, hero y tarjetas de producto, manteniendo `alt=""` únicamente en el fondo redundante y las segundas imágenes de hover.
- Motivo: la configuración pública de `templates/index.json` contiene contenido más reciente que la copia local. La solución por código permite cubrir también el hero de ofertas y la quinta categoría sin sobrescribir esos cambios de Shopify.
- Control de alcance: el paquete se construyó desde una descarga inmediatamente anterior del theme live. Se excluyó un ajuste local parcial de URLs de producto que corresponde al backlog T-01 y no pertenece a 3.1.
- Despliegue: ocho archivos publicados con `--nodelete` en el theme live `SEO` (`164560142557`); descarga posterior con coincidencia SHA-256 completa.
- Resultado: Lighthouse público `image-alt` 1, 0 infracciones y puntuación total de accesibilidad 85.
- Aprobación: propietario.

### D-018 — Sincronización segura desde Shopify hacia la rama local

- Fecha: 2026-09-07.
- Decisión: antes de incorporar cambios hechos en el editor de Shopify, descargar el theme live a una carpeta aislada y comparar tres estados: último commit, working tree local y versión online.
- Aplicación inicial: se incorporaron la navegación global vigente desde `config/settings_data.json` y la configuración completa de la home desde `templates/index.json`.
- Cambios online incorporados: menú con `OFERTAS🔥`, hero de ofertas, quinta categoría `Ofertas`, promociones con fecha 2026-09-30 y bloque FAQ.
- Cambios locales preservados: seis archivos del backlog T-01 y tres archivos de configuración relacionados con Editorify/Opinew.
- Control: después de la fusión quedaron 0 cambios exclusivos de Shopify pendientes de incorporar; 351 archivos coinciden con la descarga y nueve conservan únicamente contenido local adicional.
- Recuperación: copia anterior en `.tmp/seo-local-before-live-sync-20260907/` y descarga completa del theme live en `.tmp/seo-live-full-sync-20260907/`.
- Restricción: la sincronización descendente no publica archivos ni modifica el theme online.
- Aprobación: solicitada por el propietario.

### D-019 — Buscador accesible sin cambios visuales

- Fecha: 2026-09-07.
- Decisión: conservar el diseño y la lógica comercial del buscador, incorporando IDs por sección, etiquetas vinculadas, instrucciones para tecnologías de asistencia, estados de carga, anuncios de opciones dependientes y foco visible.
- Regla comercial confirmada: Aro es obligatorio; Ancho y Perfil son opcionales.
- Control de alcance: antes de publicar se descargó el archivo vigente y se confirmó que la única diferencia correspondía al paso 3.2.
- Despliegue: únicamente `sections/tire-finder.liquid` en el theme live `SEO` (`164560142557`) con `--nodelete`.
- Verificación: hash remoto idéntico, 117 combinaciones cargadas, cero IDs duplicados dentro del buscador, orden de teclado correcto y filtro público funcional.
- Aprobación: propietario.

### D-020 — Enlaces y carruseles accesibles sin alterar el diseño

- Fecha: 2026-09-12.
- Decisión: conservar todos los destinos y la presentación comercial de la home, pero sustituir controles simulados por botones nativos, nombrar iconos y enlaces de imagen, y limitar la tabulación a elementos realmente interactivos y visibles.
- Clasificación: las instancias responsive de redes y barra móvil se conservaron porque son funcionales en otros anchos; el cierre de notificación dejó de ser un enlace `#` y pasó a botón.
- Hero: el enlace absoluto quedó dentro de su diapositiva, condicionado a un destino real y enfocable únicamente cuando su slide está activo.
- Control de alcance: los 14 archivos remotos no habían cambiado desde la copia completa del 2026-09-07; no se sobrescribió trabajo online nuevo.
- Despliegue: paquete aislado de 14 archivos en el theme live `SEO` (`164560142557`) con `--nodelete` y `--allow-live`.
- Verificación: 14 de 14 hashes remotos idénticos, cero enlaces expuestos sin nombre, navegación por teclado funcional, un H1, cero desbordamiento y cero errores de consola observados.
- Aprobación: propietario.

### D-021 — IDs únicos sin retirar clones funcionales

- Fecha: 2026-09-14.
- Decisión: eliminar de las tarjetas los IDs que no tenían consumidores y reservar identificadores únicos únicamente para elementos con relaciones o dependencias reales.
- Carruseles: se conserva el modo `loop`; sus clones continúan visibles y funcionales, pero ya no clonan IDs de tarjetas.
- Ficha: formulario, cantidad y botón de la barra fija usan el sufijo `-sticky`; el formulario principal mantiene sus identificadores para no romper las integraciones del tema.
- Localización: barra superior y menú móvil usan prefijos independientes y etiquetas ocultas válidas.
- Carrito: el encabezado conserva el único `cart-icon-bubble`; la barra móvil replica su contenido para mantener el contador actualizado.
- Cobertura: home, colección, búsqueda, ficha, carrito y contacto quedaron con cero duplicados y cero referencias rotas tanto en local como en producción.
- Control de alcance: los 21 archivos remotos no tenían cambios online nuevos; el paquete excluyó T-01 y publicó únicamente 3.4.
- Despliegue: theme live `SEO` (`164560142557`) con `--nodelete` y `--allow-live`; verificación posterior de 21 de 21 hashes idénticos.
- Aprobación: propietario.

### D-022 — Corrección selectiva de Liquid y HTML

- Fecha: 2026-09-14.
- Decisión: priorizar errores que afecten renderizado, comportamiento, accesibilidad o semántica SEO y no corregir mecánicamente toda la deuda heredada del theme.
- Línea base: 1.288 hallazgos de Theme Check, con 938 errores; 897 correspondían a diferencias entre archivos de idiomas y 41 a otros controles.
- Resultado local: 1.254 hallazgos y 903 errores; permanecen los mismos 897 errores de traducción y solo seis errores adicionales, todos en idiomas o ramas inactivas.
- Semántica: contacto, producto y artículo conservan un único H1 sin alterar la presentación visual; el contenido editorial que introduzca H1 dentro de un artículo se normaliza a H2 al renderizar.
- HTML: las plantillas probadas quedaron sin IDs duplicados, referencias rotas, imágenes sin `alt` o dimensiones, interactivos anidados, desbordamiento ni errores de consola.
- Deuda diferida: traducciones no activas, un snippet de prueba huérfano, una tarjeta opcional desactivada del carrito y estilos de secciones dinámicas insertados en el cuerpo.
- Control de alcance: dos lecturas consecutivas confirmaron que los 18 archivos públicos no habían cambiado; el paquete conservó las líneas `within: collection` y excluyó el pendiente T-01.
- Publicación: 18 archivos en el theme live `SEO` (`164560142557`) con `--nodelete` y `--allow-live`; la descarga posterior confirmó 18 de 18 hashes idénticos.
- Verificación pública: home, contacto, búsqueda, producto, blog y artículo mantienen un H1 y cero IDs duplicados, referencias rotas, imágenes sin `alt` o dimensiones, interactivos anidados, imágenes rotas, desbordamiento y errores de consola.
- Aprobación: propietario.

## 6. Bloqueos y datos pendientes del propietario

1. Fase 3: mantener editorialmente los textos alternativos particulares cuando una descripción automática no represente el contenido real; no bloquea 3.1.
2. Fase 3.5: actualizar dentro del artículo CEAT Zoom XL el texto visible del WhatsApp antiguo a `+56 9 7767 0252`; no bloquea la publicación técnica.
3. Fase 4: entregar la ficha completa del negocio solicitada en 4.1.
4. Fase 5: entregar rentabilidad por categoría, stock estable, marcas y medidas prioritarias, exclusiones comerciales, servicios y diferenciadores reales.
5. Fases 6 y 7: revisar técnicamente los contenidos y ejecutar las acciones externas que requieren representación del negocio.

## 7. Próxima acción única

**Paso actual: 4.1 — Información del negocio para SEO local.**

Responsable actual: propietario, con revisión de consistencia por Codex. El seguimiento diferido de 2.5 continúa en paralelo para el corte de CrUX del 2026-10-04.

Próxima acción:

1. `[ ]` Confirmar nombre comercial, razón social, teléfono principal, teléfono secundario y correo público.
2. `[ ]` Entregar dirección completa, código postal, comuna, región, coordenadas y URL de Google Business Profile.
3. `[ ]` Confirmar horarios por día, feriados o excepciones y existencia de retiro en tienda.
4. `[ ]` Entregar URLs definitivas de Instagram, Facebook, TikTok y YouTube.
5. `[ ]` Confirmar servicios del taller, zonas de despacho, métodos de pago y políticas de cambios, devoluciones y despacho.
6. `[ ]` Seleccionar el logotipo oficial y una fotografía representativa del local.
7. `[ ]` Revisar la coherencia de la ficha y, una vez aprobada, avanzar a 4.2 para rehacer el JSON-LD.
8. `[ ]` Revisar CrUX a partir del 2026-10-04 y cerrar 2.5 únicamente si el nuevo periodo permite una decisión fundada.

## 8. Bitácora

### 2026-08-15

- Se acordó trabajar en una copia local y un theme no publicado.
- Se creó la rama `codex/seo-home-phase-1`.
- Se analizaron los archivos de Search Console y se estableció la línea base.
- Se formuló una hipótesis inicial de foco exclusivo en neumáticos para proteger la visibilidad existente; posteriormente fue refinada y superada por el mapa aprobado en D-009.

### 2026-08-20

- Se creó esta memoria para ordenar el roadmap, los responsables, las decisiones y la evidencia de cierre.
- Se envió `https://www.bikerz.cl/sitemap.xml` en Search Console. El primer estado mostrado fue `No se ha podido obtener`, sin última lectura ni URLs descubiertas.
- Verificación externa: el sitemap canónico responde `HTTP 200`, con `Content-Type: application/xml`, y el dominio sin `www` redirige correctamente a esa URL. Se esperará el próximo procesamiento de Search Console antes de diagnosticar un bloqueo.
- Search Console procesó el sitemap correctamente: estado `Correcto`, última lectura el 2026-08-20 y 1.041 páginas descubiertas.
- Se archivó el producto discontinuado `continental-contiraceattack-2-street-200-55zr17` y se aplicó una redirección hacia `michelin-power-gp-200-55-zr-17-78w`, alternativa equivalente por medida, índice y uso.
- Se aplicaron cinco redirecciones para rutas antiguas de producto, home y blog. Las rutas técnicas o basura se mantendrán en 404; quedan tres familias de productos antiguas a la espera de sustitutos equivalentes.
- El propietario confirmó como terminada la gestión de redirecciones 404. Las tres familias antiguas sin sustituto aprobado quedan documentadas para mantenerse en 404.
- Se cerró la fase 0.3 y el roadmap avanzó al paso 0.4.
- Se corrigió el alcance del paso 0.4 para respetar el roadmap original: exportación de la línea base de GA4 o Shopify Analytics. Las auditorías técnicas no sustituyen esta medición comercial.

### 2026-08-25

- Se recibieron y validaron 14 archivos relacionados con tráfico, atribución y ventas de GA4 y Shopify.
- Los reportes de Shopify cubren ventanas cercanas a 12 meses; los reportes de GA4 cubren únicamente 59 o 62 días pese a que sus títulos mencionan 12 meses.
- El resumen GA4 es orgánico, pero los archivos detallados de landing pages, dispositivos y productos no permiten verificar el mismo filtro.
- Se documentaron por separado los resultados de GA4, Shopify Analytics directo y la reconstrucción desde órdenes.
- El paso 0.4 permanece en curso hasta recibir las cuatro exportaciones corregidas de GA4 y construir la hoja base final.

### 2026-08-26

- Se recibieron cuatro reportes GA4 corregidos y un manifiesto dentro de `outputs/ga4-seo/`.
- El manifiesto confirma 2025-08-01 a 2026-07-31 y filtro `Session default channel group = Organic Search`.
- Se consolidó la línea base: 11.487 sesiones, 215 carritos, 21 compras, conversión de 0,183% y 4.196.433 CLP de ingresos atribuidos por GA4.
- Se confirmó una brecha crítica por dispositivo: móvil aporta 57,5% de las sesiones, pero 13,1% de los ingresos; escritorio convierte 4,39 veces más.
- Se documentaron las anomalías de atribución en checkout, `thank-you`, contacto y `(not set)` sin redistribuir sus ingresos.
- Se cerraron el paso 0.4 y la fase 0. El roadmap avanzó a 1.1: definir una sola intención para cada página.
- Se contrastó la propuesta inicial de 1.1 con Search Console, GA4, las páginas publicadas y la SERP chilena.
- Se preparó y aprobó el mapa recomendado para home, neumáticos, cascos, repuestos, lubricantes, servicios y blog.
- Se auditó el roadmap contra el plan original entregado por el propietario y se restauraron las fases 1–8 con su alcance, orden, responsables, duraciones y criterios.
- Las tareas técnicas de enlaces internos, canonical, filtros y robots se movieron a un backlog derivado de la fase 0, sin eliminar sus hallazgos ni alterar la numeración principal.
- D-001 quedó registrada como hipótesis histórica superada por D-009, eliminando la contradicción sobre la intención de la home.
- Se cerró 1.1 y el roadmap avanzó a 1.2: título y meta description de la home.

### 2026-08-29

- El propietario publicó el título y la meta description aprobados para la home desde las preferencias de Shopify.
- Se verificó la respuesta HTML pública con estado `HTTP 200` y se confirmó que el servidor entrega directamente la metadata nueva.
- El título mide 51 caracteres y la meta description 148; existe un solo título SEO en `<head>` y una sola meta description.
- El canonical apunta a `https://www.bikerz.cl/` y las etiquetas Open Graph coinciden con el título y la descripción publicados.
- La colección `/collections/neumaticos` conserva un título y un H1 diferenciados, sin duplicación exacta con la home.
- Se cerró el paso 1.2 y el roadmap avanzó a 1.3: corregir el H1 de la home.
- Se implementó localmente el paso 1.3: el logo dejó de ser H1 y se creó un H1 textual estable con una introducción de 47 palabras.
- Los títulos promocionales del slider se protegen para no renderizar H1, incluso si un bloque almacenado contiene esa etiqueta.
- Se añadieron controles para que el bloque de encabezado solo pueda usar H1 en la home y conserve H2 en otros tipos de página.
- La validación estática confirmó el H1 esperado de la home, cero H1 en slides activos, H1 de colección preservado y bloque de título activo en las 10 plantillas de producto.
- La primera vista previa mostró que el H1 grande y su ubicación antes del catálogo alteraban la composición visual de la home.
- Se restauró la ubicación original del bloque después de las categorías y se redujo el H1 a 20 px en escritorio/tablet y 18 px en móvil. La etiqueta sigue siendo `<h1>` y permanece visible; solo cambió su presentación CSS.
- Se validó la home renderizada en `http://127.0.0.1:9292/`: exactamente un H1 visible en escritorio y móvil, con el texto aprobado y sin desbordamiento horizontal.
- Se verificó la misma copia en `/collections/neumaticos` y en un producto real; ambas páginas conservan exactamente un H1 visible propio.
- Se cerró el paso 1.3 y el roadmap avanzó a 1.4: corregir el copy comercial de la home.
- Se auditó el copy comercial visible de la home y se confirmaron cinco grupos de ajustes: hero, CTA de cascos, CTA de ofertas, CTA de blog y copyright.
- Se corrigió el plural de `descuentos`, se aclaró la referencia a neumáticos CEAT y se reemplazaron los CTA genéricos por etiquetas que describen su destino.
- El copyright ahora calcula el año con Liquid y muestra `© 2026 BIKERZ. Todos los derechos reservados` durante esta validación.
- La vista renderizada confirmó los textos y destinos correctos; en móvil, los cuatro CTA permanecen en una sola línea y no provocan desbordamiento horizontal.
- El propietario aprobó visualmente el copy comercial corregido.
- Se cerró el paso 1.4 y el roadmap avanzó a 1.5: ampliar la introducción SEO estable de la home.

### 2026-08-30

- Se amplió la introducción SEO estable de 47 a 106 palabras, manteniendo el H1 aprobado y evitando sobreoptimización.
- Se añadieron enlaces internos descriptivos a Neumáticos, Repuestos, Cascos y Lubricantes; se eliminaron del bloque los enlaces filtrados que abrían pestañas nuevas.
- La primera versión de 132 palabras desbordaba el bloque fijo, por lo que se compactó el texto y se ajustó únicamente el alto móvil de 300 a 380 px.
- La home se validó en 1280 × 720, 768 × 1024 y 390 × 844: un solo H1 visible, enlaces correctos y ausencia de desbordamientos.
- El paso 1.5 queda pendiente únicamente de aprobación visual y editorial del propietario.

### 2026-08-31

- El propietario aprobó el texto y la presentación visual de la introducción SEO estable.
- Se cerró el paso 1.5 y se marcó la fase 1 como completada.
- Los siete archivos de la fase 1 se desplegaron mediante Shopify CLI al theme `SEO` no publicado (`164560142557`) usando `--nodelete`.
- Se comprobó la vista remota: metadata, H1, introducción y enlaces coinciden con la implementación aprobada; producción permaneció intacta.
- Se descargaron y compararon los themes `new look` live y `SEO`: ambos contienen 360 archivos; 350 son idénticos y 10 difieren.
- Se detectaron integraciones de Opinew y Editorify presentes en live pero ausentes en SEO, además de una diferencia en el bloque `product_meta` de la plantilla de neumáticos.
- El propietario publicó el theme `SEO` como live; `new look` quedó no publicado y disponible como respaldo.
- La home publicada superó la comprobación de metadata, H1, introducción, copyright y desbordamiento horizontal.
- La comparación visual confirmó que los bloques antiguos de Opinew ya fallaban y no mostraban un widget funcional; no se confirmó una regresión nueva de reseñas.
- Se confirmó una diferencia visible en `product.neumaticos`: el antiguo theme mostraba `Categoría` y el live nuevo no la muestra porque `product_meta` está desactivado.
- El propietario decidió mantener `product_meta` oculto; la diferencia quedó aceptada y cerrada como D-012.
- El roadmap avanzó a 2.1: priorizar correctamente el hero.
- Se auditó el hero en escritorio y móvil: la implementación anterior descargaba las variantes móvil y escritorio y mantenía el LCP en lazy-loading.
- Se reemplazaron las dos imágenes por un `<picture>` responsive, se priorizó únicamente el primer slide activo y se corrigieron `width`, `height`, `srcset`, `sizes` y `decoding`.
- La validación local confirmó una sola solicitud de hero, la variante correcta por viewport, dimensiones enteras y ausencia de desbordamiento.
- Lighthouse aprobó las tres comprobaciones de descubrimiento del LCP en la copia modificada. Los reportes live anterior y local posterior quedaron guardados en `outputs/lighthouse/`.
- El propietario aprobó visualmente el cambio del hero.
- Se publicó únicamente `sections/slide.liquid` en el theme live `SEO` con `--nodelete`; el hash del archivo remoto coincide con el local.
- Lighthouse live posterior mejoró el LCP móvil de 3,81 s a 2,86 s y la puntuación de 45 a 50; el CLS permaneció en 0,161.
- La versión móvil pasó de dos solicitudes de hero a una y Lighthouse aprobó prioridad alta, descubrimiento inicial y carga eager.
- El paso 2.1 se cerró y el roadmap avanzó a 2.2: auditar aplicaciones activas.
- El propietario confirmó que ninguna aplicación contiene reseñas reales, se usa en fichas o tiene un plan pagado; no se conservará por ahora ni Opinew ni Editorify. La decisión quedó registrada como D-013.
- El theme live tiene tres app embeds activos: Dondy WhatsApp, Microsoft Clarity y Shopify Forms. No se detectaron widgets funcionales de reseñas en fichas de neumáticos o cascos.
- Dondy carga globalmente alrededor de 69 KB transferidos y 215 KB descomprimidos para mostrar únicamente el botón del plan gratuito; se recomendó reemplazarlo por un enlace propio sin JavaScript.
- El propietario confirmó `+56 9 7767 0252` como número oficial y aprobó sustituir Dondy; la decisión quedó registrada como D-014.
- Se actualizaron los tres enlaces que utilizaban un número diferente y se creó un botón flotante propio sin JavaScript.
- La implementación local se validó en home y producto, escritorio y móvil: un solo botón, Dondy ausente, URL contextual correcta, accesibilidad básica y sin desbordamiento.
- El reemplazo queda pendiente de aprobación visual y publicación coordinada con la desactivación del app embed de Dondy.

### 2026-09-02

- El propietario aprobó visualmente el botón propio de WhatsApp.
- Antes de publicar se descargaron los cuatro archivos del theme live y se confirmó que las únicas diferencias eran las aprobadas.
- Se publicaron de forma aislada `layout/theme.liquid`, `snippets/whatsapp-floating-button.liquid`, `snippets/product-form.liquid` y `templates/index.json` en el theme live `SEO` (`164560142557`).
- Se descargó la configuración remota actual, se desactivó únicamente el app embed de Dondy y se verificó el cambio remoto; no se publicó el `config/settings_data.json` local.
- Los hashes remotos de los cuatro archivos coinciden con los locales. La home y una ficha muestran un único botón, el número oficial, mensaje contextual, ausencia del número anterior y ausencia de scripts o nodos de Dondy.
- Dos corridas Lighthouse posteriores confirmaron 0 solicitudes y 0 KB de Dondy frente a 3 solicitudes y 67,2 KB antes. La variación del puntaje global se registró como ruido de laboratorio y no como mejora demostrada de Core Web Vitals.
- El paso 2.2 quedó cerrado y el roadmap avanzó a 2.3: auditar Google Tag Manager.
- Después de revisar la primera versión en producción, el propietario indicó que el trazado del ícono se veía extraño y preguntó cómo cambiar los mensajes.
- Se preparó localmente un SVG más limpio y una sección **WhatsApp** en los ajustes globales del theme con dos campos editables: mensaje del botón flotante y mensaje base de consulta de stock.
- El propietario aprobó el nuevo trazado del ícono y los mensajes configurables.
- Antes de publicar se compararon los tres archivos con el live; no existían cambios remotos ajenos.
- Se publicaron de forma aislada `config/settings_schema.json`, `snippets/whatsapp-floating-button.liquid` y `snippets/product-form.liquid`.
- Los hashes remotos coinciden con la copia aprobada, Dondy continúa desactivado y la validación pública confirmó el nuevo ícono, el mensaje general y el contexto automático en productos.
- El paso 2.2 quedó cerrado nuevamente y el roadmap avanzó a 2.3: auditar Google Tag Manager.
- Se inició 2.3 con una revisión del código, la home pública, una ficha de producto, los recursos de red y los reportes Lighthouse disponibles.
- Se confirmó `GTM-TTT6HMPN` instalado manualmente en el theme y se inventariaron GA4 `G-PSM69XC45C`, Google tag `GT-MB6TJCMM`, Google Ads `AW-16944591696`, Meta Pixel `626755473530641`, Clarity `wgxvai3ebp`, Shopify Web Pixels y Knasta.
- Una sesión extendida de la home mostró dos `page_view` hacia el mismo GA4, uno general y otro asociado a `shopify_event_name=page_viewed`.
- No se confirmó duplicación de Meta o Clarity; esos puntos quedan pendientes del JSON de GTM y del inventario de píxeles de Shopify.
- Se creó `docs/seo/GTM-AUDIT-2026-09-02.md` con evidencia, riesgos, instrucciones de exportación y criterios para la matriz final.
- El propietario entregó la exportación de la versión publicada 2 de `GTM-TTT6HMPN` y la captura de los píxeles activos en **Eventos de clientes**.
- La exportación contiene una sola etiqueta: `GA4 Config - Web` (`G-PSM69XC45C`) activada en todas las páginas; no contiene ecommerce, Google Ads, Meta ni Clarity.
- La captura confirma **Google & YouTube** con medición Web y Servidor, además de Facebook & Instagram, Microsoft Clarity y Smart Pricing.
- El cruce de ambas fuentes atribuyó los dos `page_view` de GA4 a la instalación manual de GTM y a **Google & YouTube**; no se confirmó duplicación de Meta o Clarity.
- Se completó la matriz de decisión y se recomendó retirar únicamente los dos bloques manuales de GTM del theme, conservando intactas las integraciones de Shopify; no se realizó ningún cambio de medición sin aprobación.
- El propietario aprobó la recomendación; se registró como D-015 y se retiraron únicamente los dos bloques de GTM en la copia local.
- El theme de desarrollo `165034229981` respondió `HTTP 200`: el HTML y el DOM contienen cero referencias a `GTM-TTT6HMPN`, `gtm.js` y `ns.html`.
- La vista previa conserva el administrador de Web Pixels y los scripts de Google & YouTube/GA4, Meta, Clarity y Knasta/Smart Pricing; la revisión visual no detectó cambios de layout.
- El despliegue y la comprobación final en GA4 Tiempo real quedan pendientes de aprobación visual del propietario.
- El propietario aprobó visualmente la vista previa.
- Antes del despliegue se descargó el archivo live; la comparación confirmó que la única diferencia eran los dos bloques de GTM aprobados.
- Se publicó exclusivamente `layout/theme.liquid` en el theme live `SEO` (`164560142557`) mediante Shopify CLI con `--nodelete` y `--allow-live`.
- El hash SHA-256 remoto posterior coincide con la copia local aprobada: `4FD89AC99E848DBEF1393802E7598FC2AE3F9FEDF5F42EF50D375880B9C50955`.
- La home pública, fuera del modo de vista previa, contiene cero referencias a `GTM-TTT6HMPN`, `gtm.js` y `ns.html`; conserva GA4 `G-PSM69XC45C`, Google tag `GT-MB6TJCMM`, Meta, Clarity y Knasta/Smart Pricing.
- La revisión visual pública confirmó que el layout y el H1 permanecen correctos.
- El paso 2.3 queda pendiente únicamente de la confirmación del propietario en GA4 Tiempo real.

### 2026-09-04

- Se abrió la propiedad **Bikerz** en el informe GA4 Tiempo real para comprobar la medición posterior al retiro de GTM.
- GA4 mostró 9 usuarios activos en 30 minutos, 1 usuario en 5 minutos, 7 vistas de la home `Neumáticos y Repuestos para Motos en Chile | Bikerz` y 50 eventos `page_view` agregados en la ventana.
- La actividad confirma que GA4 continúa recibiendo vistas de la home mediante la integración de Shopify después de retirar el contenedor manual.
- El paso 2.3 quedó cerrado y el roadmap avanzó a 2.4: reducir CSS y JavaScript global.
- Se creó la línea base pública de 2.4 con PageSpeed Insights: rendimiento 72 móvil y 80 escritorio en la ejecución diagnóstica; los datos reales no aprueban Core Web Vitals por CLS de 0,13 en móvil y 0,28 en escritorio.
- Lighthouse atribuyó los 239,3 KiB de JavaScript no utilizado íntegramente a Shopify Forms. La validación posterior confirmó que el app embed muestra el aviso promocional `10% de descuento`, por lo que se conserva; el bloque inline de la home tiene `form_id` vacío y no aporta contenido propio.
- Se retiraron 16 preloads explícitos de CSS sin retirar ninguna hoja de estilo, siguiendo la recomendación de Shopify de reservar los preloads para recursos críticos y no duplicar la priorización automática del `<head>`.
- `collection-main.js` y `product-grid.js` dejaron de cargarse globalmente y ahora se incluyen solo en las secciones que los utilizan; Wishlist quedó condicionado a su configuración o plantilla y se eliminó la referencia a `compare.js`, un asset inexistente con la función desactivada.
- Se limitaron las transiciones de imágenes a `transform` y `opacity` para corregir las 12 animaciones no compuestas asociadas a `aspect-ratio`.
- La home pública contiene cinco carruseles y 22 slides clonados por los loops de Marcas y Productos. No se cambió su comportamiento visible sin aprobación.
- El módulo interno de compras recientes tenía tres referencias a productos inexistentes y cargaba recursos sin poder mostrar contenido. Ahora solo se renderiza cuando contiene al menos un producto válido, sin retirar la función del theme.
- El theme de desarrollo `165034229981` quedó sincronizado con `--nodelete`. La home, colección, búsqueda y ficha de producto pasaron las verificaciones funcionales; Añadir al carrito abrió correctamente el drawer.
- Lighthouse local confirmó que las animaciones no compuestas bajaron de 12 a una. El puntaje global local no se usa como comparación por la sobrecarga del proxy de desarrollo y la variabilidad de scripts externos.
- La evidencia completa quedó en `docs/seo/PERFORMANCE-AUDIT-2026-09-04.md`; 2.4 queda pendiente de aprobación visual del propietario antes de cualquier publicación.
- El propietario aprobó visualmente la vista previa local del paso 2.4.
- El paso 2.4 quedó cerrado y el roadmap avanzó a 2.5: validación de rendimiento.
- Antes del despliegue se descargaron los ocho archivos objetivo del theme live. Siete contenían únicamente las diferencias de 2.4; en `sections/someone-purchased.liquid` se detectó además un cambio local anterior y ajeno a esta tarea, que se excluyó del paquete para preservar la versión remota.
- Los ocho archivos de 2.4 se publicaron en el theme live `SEO` (`164560142557`) con un push limitado, `--nodelete` y `--allow-live`.
- La descarga posterior confirmó que los hashes SHA-256 de los ocho archivos remotos coinciden con el paquete exacto de despliegue.
- La validación pública confirmó el theme activo `/cdn/shop/t/18/`, un solo H1 en la home, ausencia de desbordamiento y de los scripts globales retirados, 20 productos y filtros en `/collections/neumaticos`, resultados funcionales en la búsqueda `michelin` y cero errores de consola en la comprobación.
- El paso 2.5 queda pendiente: tres mediciones móviles y tres de escritorio, comparación por mediana y pruebas funcionales finales.
- Se ejecutaron tres mediciones móviles y tres de escritorio con Lighthouse 13.4.1. La mediana móvil fue 49 puntos, LCP 3,292 s, TBT 2,661 s y CLS 0,161; la mediana de escritorio fue 70 puntos, LCP 1,169 s, TBT 0,246 s y CLS 0,335.
- Una ejecución independiente de PageSpeed posterior obtuvo 80 móvil y 75 escritorio. El contraste confirma alta variabilidad en TBT, mientras CLS se mantiene desfavorable en todas las herramientas.
- Los datos reales de 28 días todavía no incluyen el despliegue: móvil no aprueba Core Web Vitals por CLS 0,13 y escritorio muestra CLS 0,28 con evaluación no aplicable por falta de LCP.
- Se aprobaron búsqueda general, buscador de neumáticos 120/70 R17, agregado al carrito, reseñas de Google, WhatsApp y continuidad técnica de los píxeles.
- Se detectó `window.loadContry is not a function` después de agregar el primer producto a un carrito vacío. El producto y subtotal aparecen correctamente, pero el calculador de despacho puede no reinicializarse.
- La evidencia completa quedó en `docs/seo/PERFORMANCE-VALIDATION-2-5-2026-09-04.md` y `outputs/lighthouse-2-5-2026-09-04/`.
- El paso 2.5 y la fase 2 permanecen abiertos. Antes de avanzar se debe corregir CLS y `loadContry`, resolver la decisión sobre Shopify Forms y repetir las seis mediciones.

### 2026-09-06

- Se continuó el ciclo de corrección de 2.5 exclusivamente sobre la copia local; no se modificó el theme activo.
- Una traza de Lighthouse demostró que el CLS principal provenía del carrusel de marcas: el breakpoint móvil de 410 px y el modo `loop` cambiaban el ancho y reordenaban los logos durante la carga y cada avance automático.
- El carrusel móvil quedó estable en dos columnas; tablet y escritorio conservan cinco y seis. Se sustituyó `loop` por `rewind`, se restauró el intervalo automático de 5 segundos y se eliminaron los clones del carrusel.
- Se reservaron los anchos de marcas y categorías antes de inicializar Swiper, se fijó la altura crítica del hero cuando usa altura personalizada y se evitó el ciclo de altura `100%` de los slides.
- Una medición local posterior obtuvo CLS 0,025 en móvil y 0,032 en escritorio, frente a las medianas públicas anteriores de 0,161 y 0,335. El proxy local impide comparar puntuación, FCP, LCP y TBT con producción.
- Se añadió un fallback seguro para `loadContry` cuando el estimador de despacho está desactivado. La prueba desde carrito vacío agregó un producto, abrió el drawer, mostró una unidad y subtotal de $248.391 sin reproducir el error.
- La validación local confirmó un solo H1, ausencia de desbordamiento horizontal, carruseles inicializados y cero errores nuevos de consola en home y ficha.
- El propietario aprobó visualmente el resultado.
- Se compararon con producción los ocho archivos correctivos; no se encontraron cambios remotos ajenos. Se publicaron únicamente `assets/brand.css`, `assets/brand.js`, `assets/collection-list.js`, `assets/section-collection-list.css`, `sections/brand.liquid`, `sections/collection-list.liquid`, `sections/slide.liquid` y `snippets/scripts-tag.liquid` en el theme live `SEO` (`164560142557`).
- La descarga posterior al despliegue confirmó coincidencia SHA-256 de los ocho archivos entre producción y la copia local.
- La validación pública de escritorio y móvil confirmó un solo H1, ausencia de desbordamiento, hero estable, nueve logos sin duplicados y cero errores de consola. La ficha y el drawer conservaron una unidad de Michelin a $248.391 sin reproducir el error `loadContry`.
- Las seis mediciones públicas posteriores dieron medianas de rendimiento 58, LCP 2,602 s, TBT 3,807 s y CLS 0,025 en móvil; y rendimiento 81, LCP 0,717 s, TBT 0,380 s y CLS 0,035 en escritorio.
- El CLS mejoró aproximadamente 85% en móvil y 90% en escritorio frente a la línea base; el LCP también mejoró en ambos perfiles. El TBT móvil continúa inestable y alto en el laboratorio local.
- PageSpeed independiente obtuvo 96 móvil con LCP 2,5 s, TBT 30 ms y CLS 0; escritorio obtuvo 98 con LCP 1,1 s, TBT 10 ms y CLS 0,033. El contraste vuelve a demostrar una gran variación en la ejecución de terceros.
- Un control de tres corridas bloqueando únicamente el JavaScript de Shopify Forms, sin cambiar la tienda, dio mediana móvil 59 y TBT 3,251 s frente a 58 y 3,807 s con Forms. Se ahorraron 285,3 KiB de payload y 198,0 KiB de JavaScript no utilizado, pero la retirada simulada no alcanzó el objetivo de TBT.
- El propietario decidió conservar Shopify Forms para mantener el popup del 10% y aceptó temporalmente el coste y la inconsistencia del TBT. La decisión quedó registrada como D-016; Clarity y Meta no se modifican.
- Los datos reales de CrUX siguen sin aprobar por CLS 0,13 móvil y 0,28 escritorio, pero su ventana de 28 días todavía contiene mayoritariamente tráfico anterior al despliegue.
- 2.5 permanece en seguimiento, sin una acción inmediata del propietario, hasta revisar Core Web Vitals reales a partir del 2026-10-04.

- Se inició 3.1 con una auditoría reproducible de la home pública: las 28 imágenes inicialmente problemáticas se explican por 17 imágenes vacías o sin atributo y 11 imágenes de producto con textos técnicos como `01`, `02` o rutas de archivos.
- Se confirmó que `templates/index.json` de la home publicada contiene cambios más recientes que la copia local. Las correcciones se implementaron como fallbacks de Liquid y no se sobrescribió esa configuración remota.
- La copia local ahora genera textos para el logo móvil, nueve marcas, categorías, banners enlazados y la imagen principal de cada tarjeta de producto. Las segundas imágenes de hover y el fondo redundante del H1 conservan `alt=""` por ser decorativos.
- La auditoría del DOM local obtuvo 0 atributos ausentes, 0 textos técnicos y 0 textos mayores de 125 caracteres. Lighthouse aprobó `image-alt` con puntuación 1 y 0 elementos infractores; la puntuación total de accesibilidad fue 85.
- Los ocho archivos modificados no presentan errores de sintaxis nuevos. El theme completo conserva errores y avisos heredados que quedan fuera del alcance de 3.1.
- El paso queda pendiente de aprobación visual y posterior despliegue aislado; el theme publicado no fue modificado.

### 2026-09-07

- El propietario aprobó visualmente la corrección local del paso 3.1.
- La comparación previa detectó en las tres plantillas de tarjeta un cambio local parcial del backlog T-01 sobre URLs de producto que no estaba en producción y no pertenecía a 3.1. El paquete se reconstruyó desde los archivos del theme live y excluyó expresamente ese cambio.
- Se publicaron únicamente ocho archivos en el theme live `SEO` (`164560142557`) con `--nodelete`; `templates/index.json` no se modificó.
- La descarga posterior confirmó coincidencia SHA-256 de los ocho archivos remotos con el paquete aislado aprobado.
- La auditoría pública obtuvo 0 atributos `alt` ausentes, 0 textos técnicos y 0 textos mayores de 125 caracteres. El hero vigente quedó como `Ofertas para motos en Bikerz`, la categoría adicional como `Ofertas` y el logo móvil como `Bikerz`.
- Lighthouse público aprobó `image-alt` con puntuación 1 y 0 infracciones; accesibilidad total 85.
- La validación estructural confirmó un H1, nueve marcas, cinco categorías, un enlace de WhatsApp y ausencia de desbordamiento horizontal.
- El paso 3.1 quedó cerrado y el roadmap avanzó a 3.2: etiquetas del buscador de neumáticos.
- A solicitud del propietario se sincronizó la rama `codex/seo-home-phase-1` con el estado actual del theme live mediante una comparación entre HEAD, working tree y Shopify.
- Se incorporaron el menú online con `OFERTAS🔥` y la configuración completa vigente de la home: hero de ofertas, quinta categoría, fechas de promociones y FAQ.
- Se conservaron los cambios locales no publicados del backlog T-01 y los bloques locales de Editorify/Opinew. Después de la fusión no quedó ningún cambio exclusivo de Shopify pendiente.
- La vista local en `http://127.0.0.1:9292/` confirmó el contenido sincronizado, un H1, cinco categorías, nueve marcas, hero con texto alternativo y FAQ.
- No se creó un commit automático porque el working tree contiene trabajo acumulado de varias fases que debe agruparse conscientemente antes de versionarlo.
- Evidencia y detalle: `docs/seo/LIVE-SYNC-2026-09-07.md`.
- Se auditó el buscador de neumáticos del paso 3.2. Las etiquetas visibles ya estaban vinculadas, pero los IDs eran globales y faltaban instrucciones, estados de carga, anuncios de dependencia y foco explícito del botón.
- Se implementaron IDs por sección, instrucciones solo para tecnologías de asistencia, regiones vivas, `aria-busy`, Aro obligatorio, elementos decorativos ocultos y foco naranja visible, sin introducir contenido visible nuevo.
- La prueba local cargó 117 combinaciones. Al elegir Aro 10 se recalcularon 5 anchos y 2 perfiles, se habilitó el botón y se abrió la colección con el filtro correcto.
- El recorrido con Tab quedó Ancho → Perfil → Aro → Buscar. La geometría del bloque y sus cuatro controles coincide exactamente con producción en escritorio.
- Una segunda comparación responsive de 919 px confirmó el mismo tamaño y la misma distribución en dos columnas entre producción y local.
- Theme Check aislado inspeccionó el archivo modificado y la traducción base con 0 infracciones. Los errores heredados del theme completo quedan fuera del alcance de 3.2.
- Producción no fue modificada. El paso 3.2 queda pendiente de revisión visual del propietario en escritorio y móvil.
- Evidencia: `docs/seo/ACCESSIBILITY-AUDIT-3-2-2026-09-07.md`.
- El propietario aprobó visualmente el paso 3.2.
- Se descargó `sections/tire-finder.liquid` desde el theme live inmediatamente antes del despliegue. La comparación mostró únicamente las diferencias accesibles aprobadas, sin cambios online ajenos.
- Se publicó solo ese archivo en `SEO` (`164560142557`) con `--nodelete`; la descarga posterior coincide con el archivo local y el paquete aislado mediante SHA-256 `0CC0696C1CAA104DD17888A37D18EC939BD345BF1D57C6892D2325B365B63CAA`.
- La web pública cargó 117 combinaciones y dejó disponibles inicialmente 20 anchos, 10 perfiles y 12 aros. No existen IDs duplicados dentro del buscador.
- Al seleccionar Aro 10 se anunciaron 5 anchos y 2 perfiles compatibles, se habilitó el botón y se abrió la colección con `filter.p.m.custom.di_metro=10`.
- La navegación pública con Tab quedó Ancho → Perfil → Aro → Buscar, con foco naranja visible de 2 px. La geometría de escritorio continúa en 1265 × 197 px.
- El paso 3.2 quedó cerrado y el roadmap avanzó a 3.3: enlaces sin nombre.
- Se reprodujo el paso 3.3 sobre la home actual: 18 enlaces sin nombre en el DOM, de los cuales 10 eran visibles y enfocables en escritorio; el número histórico de 36 correspondía a una versión anterior de la home.
- Se nombraron redes sociales, cuenta, barra móvil, categorías y cierres; el cierre de notificación pasó de enlace `#` a botón.
- El enlace absoluto del hero quedó dentro de su diapositiva, condicionado a un destino real y con el nombre `Ver ofertas para motos en Bikerz`; los enlaces de diapositivas inactivas salen de la tabulación.
- Las flechas de marcas, productos y blog quedaron como botones con nombres en español y operación por teclado. El foco dentro de marcas también revela sus flechas sin cambiar su estado visual normal.
- La medición local final registró 0 enlaces sin nombre, 0 visibles/enfocables sin nombre, 1 H1 y 0 px de desbordamiento horizontal.
- Evidencia local: `docs/seo/ACCESSIBILITY-AUDIT-3-3-2026-09-07.md`. Producción permanece sin cambios a la espera de aprobación.

### 2026-09-12

- El propietario aprobó la presentación y el funcionamiento local del paso 3.3.
- Se renovó la sesión de Shopify CLI y se descargaron exclusivamente los 14 archivos involucrados desde el theme live `SEO` (`164560142557`).
- Los 14 archivos remotos eran idénticos a la copia completa del theme obtenida el 2026-09-07; no se detectó ningún cambio online nuevo que requiriera fusión.
- Se preparó un paquete aislado de 14 archivos; todos sus hashes coincidían con la copia local y los tres scripts JavaScript superaron la validación de sintaxis.
- El paquete se publicó con `--nodelete` y `--allow-live`. Shopify confirmó el push y confirmó que `SEO` conserva el rol `live`.
- La descarga posterior obtuvo coincidencia SHA-256 en 14 de 14 archivos.
- La home pública expone cero enlaces sin nombre a tecnologías de asistencia y cero enlaces visibles/enfocables sin nombre. El enlace vacío interno de la miniatura del carrito permanece correctamente excluido mediante `aria-hidden=true` y `tabindex=-1`.
- La validación pública confirmó nombres de redes, cuenta, categorías, hero y controles; productos y marcas respondieron a `Enter`.
- Se conservaron 1 H1, 0 px de desbordamiento horizontal, hero de 1265 × 350 px, 1 WhatsApp flotante, buscador con 20 anchos, 10 perfiles y 12 aros, y 0 errores de consola observados.
- El paso 3.3 quedó cerrado y el roadmap avanzó a 3.4: IDs duplicados.
- Evidencia final: `docs/seo/ACCESSIBILITY-AUDIT-3-3-2026-09-07.md`.

### 2026-09-14

- Se reprodujo la línea base pública de 3.4: la home tenía 31 grupos de IDs duplicados, 117 duplicados adicionales y 52 relaciones accesibles rotas.
- Se separaron los identificadores de localización, carrito y formulario fijo de producto; los SVG decorativos dejaron de exponer IDs globales.
- Los IDs no consumidos de tarjetas se retiraron para que Swiper mantenga sus clones y el modo `loop` sin duplicar identificadores.
- Se corrigieron además el ID de filtros de precio, el `product-grid` anidado de búsqueda y las referencias ausentes de filtros, búsqueda predictiva y nota del carrito.
- La home, colección, búsqueda, ficha, carrito y contacto quedaron con 0 IDs duplicados y 0 referencias rotas en la copia local.
- Se probaron buscador predictivo, selector de idioma, filtro AJAX, carrusel, compra principal, compra fija, drawer, eliminación y sincronización de los dos contadores de carrito.
- No se observaron errores de consola en las comprobaciones finales y `git diff --check` quedó limpio para los archivos del alcance.
- El propietario aprobó visualmente el paso 3.4.
- Los 21 archivos remotos coincidían con la línea base pública; no se detectaron cambios online nuevos que requirieran fusión.
- Se preparó un paquete aislado que excluyó de cinco snippets el cambio pendiente de T-01 sobre `within: collection`.
- El paquete se publicó en el theme live `SEO` (`164560142557`) con `--nodelete` y `--allow-live`; la descarga posterior confirmó 21 de 21 hashes SHA-256 idénticos.
- En producción, home, colección, búsqueda, ficha, carrito y contacto mantienen 0 IDs duplicados y 0 referencias rotas. El filtro AJAX 2.50, los 16 resultados de búsqueda, los formularios principal/fijo, el buscador predictivo y el selector de idioma conservaron su operación.
- No se observaron errores ni advertencias de consola en la validación pública. El carrito existente no fue modificado durante esta comprobación.
- El paso 3.4 quedó cerrado y el roadmap avanzó a 3.5: errores Liquid y HTML.
- Evidencia: `docs/seo/ID-AUDIT-3-4-2026-09-14.md`.
- Se ejecutó la línea base de Theme Check para 3.5: 1.288 hallazgos, 938 errores y 350 advertencias; 897 errores correspondían a archivos de traducción heredados.
- Se corrigieron 35 errores no relacionados con traducciones, incluidos fallos de sintaxis Liquid, cierres HTML inválidos, assets inexistentes, dimensiones de imágenes y jerarquía de encabezados.
- Contacto recibió un H1 visualmente oculto; producto y artículo mantienen un solo H1; el artículo dejó de duplicar `popular-articles` y sus controles sociales tienen nombre accesible.
- La repetición de Theme Check produjo 1.254 hallazgos, 903 errores y 351 advertencias. De los errores, 897 siguen siendo traducciones y seis pertenecen a idiomas o ramas inactivas.
- Home, contacto, búsqueda, producto, blog y artículo quedaron con un H1 y cero IDs duplicados, referencias rotas, imágenes sin `alt`, imágenes sin dimensiones, interactivos anidados y desbordamiento; no se observaron errores de consola.
- Se detectó un texto de WhatsApp antiguo dentro del contenido remoto del artículo CEAT Zoom XL; el propietario debe corregirlo desde el editor de Shopify al número oficial `+56 9 7767 0252`.
- El paso 3.5 queda implementado y validado en local, pendiente de aprobación visual y publicación aislada.
- Evidencia: `docs/seo/LIQUID-HTML-AUDIT-3-5-2026-09-14.md`.
- El propietario aprobó visualmente el paso 3.5 y autorizó un despliegue que preservara expresamente los cambios productivos.
- Dos descargas consecutivas confirmaron que los 18 archivos del alcance no tenían cambios online nuevos.
- Se detectaron cambios locales pendientes de T-01 en dos snippets; el paquete de despliegue conservó `within: collection`, igual que producción, y excluyó ese alcance sin modificar la copia local.
- Los 18 archivos se publicaron en el theme live `SEO` (`164560142557`) con `--nodelete` y `--allow-live`.
- La descarga posterior confirmó coincidencia SHA-256 en 18 de 18 archivos.
- La validación pública confirmó un H1 y cero IDs duplicados, referencias rotas, imágenes sin `alt` o dimensiones, interactivos anidados, imágenes rotas, desbordamiento y errores de consola en home, contacto, búsqueda, producto, blog y artículo.
- El paso 3.5 quedó cerrado y el roadmap avanzó a 4.1: información del negocio para SEO local.
