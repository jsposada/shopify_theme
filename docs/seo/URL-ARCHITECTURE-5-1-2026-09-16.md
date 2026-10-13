# Arquitectura de colecciones SEO — Paso 5.1

Fecha de corte inicial: 2026-09-16  
Última comprobación técnica del catálogo: 2026-09-18  
Estado: `[x]` primera tanda aprobada por el propietario el 2026-09-21.  
Alcance: definir la primera tanda de URLs limpias. En este paso todavía no se crean colecciones ni se modifica el tema.

## 1. Fuentes contrastadas

- Google Search Console, consultas de los últimos 16 meses:
  - `GSC-consultas-16-meses.xlsx`.
  - `GSC-neumaticos-consultas-16-meses.xlsx`.
  - `GSC-cascos-consultas-16-meses.xlsx`.
  - `GSC-repuestos-consultas-16-meses.xlsx`.
- GA4, tráfico orgánico del 2025-08-01 al 2026-07-31:
  - `outputs/ga4-seo/GA4-SEO-landing-pages-2025-08-01_2026-07-31.csv`.
  - `outputs/ga4-seo/GA4-SEO-productos-2025-08-01_2026-07-31.csv`.
- Catálogo público y sitemaps de Shopify revisados el 2026-09-16:
  - `https://www.bikerz.cl/sitemap.xml`.
  - `https://www.bikerz.cl/collections/neumaticos`.
  - `https://www.bikerz.cl/collections/cascos`.
  - `https://www.bikerz.cl/collections/repuestos`.

Las exportaciones de GSC contienen como máximo las primeras 1.000 consultas. Por eso sus cifras sirven para priorizar, pero no representan todo el universo de búsquedas. Los datos de GA4 indican rendimiento comercial observado, no margen ni estabilidad futura del stock.

## 2. Diagnóstico de la arquitectura actual

### 2.1 Colecciones existentes

El sitemap público contiene 16 colecciones. Ya existen las categorías principales de neumáticos, cascos, repuestos y lubricantes, además de colecciones de marca para Michelin, Bridgestone, Dunlop, Continental, Timsun, CEAT y Eurogrip.

No existen colecciones permanentes e indexables para:

- Neumáticos por uso.
- Neumáticos por medida.
- Cascos por tipo o marca.
- Pastillas de freno o filtros de aceite como landings SEO independientes.

Sí existen `/collections/cadenas` y `/collections/sistema-electrico`, por lo que no deben duplicarse con handles alternativos.

### 2.2 Rendimiento de las categorías principales

| Landing orgánica | Sesiones | Carritos | Compras | Ingresos atribuidos | Conversión |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/collections/neumaticos` | 388 | 15 | 3 | $517.800 | 0,77 % |
| `/collections/lubricantes` | 49 | 0 | 0 | $0 | 0,00 % |
| `/collections/cascos` | 36 | 0 | 0 | $0 | 0,00 % |
| `/collections/repuestos` | 6 | 0 | 0 | $0 | 0,00 % |

La colección de neumáticos es la única categoría principal que ya demuestra adquisición y conversión orgánica. Por eso la primera tanda debe concentrarse allí, sin abandonar la preparación posterior de cascos y repuestos.

### 2.3 Profundidad de catálogo observada

- Neumáticos: 580 productos publicados en la lectura pública del 2026-09-18.
- Usos visibles en filtros: Trail 139, Mixto 83, Sport 104, Street 80, Chopper 69, Scooter 50 y Enduro 35.
- Cascos: 147 productos; Nolan concentra 110 según el filtro público.
- Repuestos: 239 productos; destacan pastillas de freno 115, filtros de aceite 61 y baterías 23.

Estos conteos acreditan amplitud del catálogo publicado, pero el propietario debe confirmar cuáles grupos mantienen stock y reposición estables.

## 3. Primera tanda recomendada

Se recomienda comenzar con cinco URLs. Es una tanda suficientemente pequeña para controlar calidad, indexación y canibalización, pero cubre las señales comerciales y de búsqueda más claras.

| Prioridad | URL propuesta | Intención principal | Evidencia | Condición antes de crearla |
| ---: | --- | --- | --- | --- |
| 1 | `/collections/neumaticos-trail-adventure` | neumáticos trail y adventure | 139 productos con uso Trail; clúster de GSC con 3.325 impresiones; varios productos Trail/Anakee/TKC aparecen entre los artículos orgánicos con compra | Confirmar rentabilidad y stock estable; no incorporar automáticamente los 83 productos Mixto |
| 2 | `/collections/neumaticos-sport-street` | neumáticos sport y street | 104 productos Sport y 80 Street; clúster de GSC con 3.278 impresiones; combinar ambas etiquetas evita dos páginas solapadas | Confirmar que ambas líneas deben compartir landing y que mantienen stock estable |
| 3 | `/collections/neumaticos-120-70-17` | neumáticos 120/70-17 | 31 publicados, 25 disponibles y 9 marcas en la revisión del 2026-09-18; 4 unidades compradas, 16 adiciones al carrito, $908.100 y 173 impresiones | Confirmar reposición habitual |
| 4 | `/collections/neumaticos-160-60-17` | neumáticos 160/60-17 | 19 publicados, 17 disponibles y 5 marcas; 3 unidades compradas, 11 adiciones al carrito, $687.400 y 181 impresiones | Confirmar reposición habitual |
| 5 | `/collections/neumaticos-90-90-21` | neumáticos 90/90-21 | 31 publicados, 23 disponibles y 16 marcas; 2 unidades compradas, 16 adiciones al carrito, $292.200 y 345 impresiones | Confirmar reposición habitual |

### Decisión de nomenclatura

- Usar siempre guiones y la medida sin barras en el handle.
- Mantener la palabra `neumaticos` al inicio para que el tema y la jerarquía sean comprensibles.
- Conservar `sport-street` como una sola intención durante la primera implementación. Solo se separará si GSC, stock y contenido demuestran que cada página puede sostenerse por sí sola.
- No crear URLs a partir de parámetros de filtros. Cada landing aprobada debe ser una colección permanente con canonical propia.

### Auditoría técnica de las reglas

La colección pública ya expone metacampos estructurados que deben reutilizarse como fuente de verdad:

- `custom.uso`.
- `custom.ancho`.
- `custom.aspecto`.
- `custom.di_metro`.
- `custom.marca`.
- `custom.motos_compatibles`.

No se deben construir estas colecciones leyendo fragmentos del título ni usando las etiquetas antiguas: las etiquetas tienen variaciones de mayúsculas, acentos y nombres, mientras que los metacampos sostienen los filtros actuales.

| URL | Regla técnica prevista |
| --- | --- |
| `/collections/neumaticos-trail-adventure` | `custom.uso = Trail` |
| `/collections/neumaticos-sport-street` | `custom.uso = Sport` **o** `custom.uso = Street` |
| `/collections/neumaticos-120-70-17` | `custom.ancho = 120`, `custom.aspecto = 70` **y** `custom.di_metro = 17` |
| `/collections/neumaticos-160-60-17` | `custom.ancho = 160`, `custom.aspecto = 60` **y** `custom.di_metro = 17` |
| `/collections/neumaticos-90-90-21` | `custom.ancho = 90`, `custom.aspecto = 90` **y** `custom.di_metro = 21` |

Shopify admite metacampos de producto como condiciones de colecciones automáticas cuando la definición está habilitada para usarse como condición. Antes de crear las colecciones se deben consultar sus identificadores internos y verificar esa habilitación. La creación requiere permiso `write_products`; no se ha solicitado ni utilizado ese permiso.

Referencia técnica oficial: `https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectionCreate`.

## 4. Segunda tanda candidata

Estas oportunidades tienen evidencia, pero deben esperar el resultado de la primera tanda o una validación comercial adicional.

| URL candidata | Motivo para conservarla | Motivo para no incluirla aún |
| --- | --- | --- |
| `/collections/neumaticos-140-70-17` | 20 publicados, 19 disponibles y 10 marcas; 2 unidades compradas; $267.400; 256 impresiones | Menor valor comercial observado que las tres medidas priorizadas |
| `/collections/neumaticos-150-70-17` | 26 publicados, 18 disponibles y 12 marcas; 21 adiciones al carrito; 270 impresiones | No registra compra en el corte de GA4 |
| `/collections/neumaticos-180-55-17` | 17 publicados, 15 disponibles y 4 marcas; 1 unidad comprada; 243 impresiones | Solo 6 adiciones al carrito en el corte |
| `/collections/neumaticos-110-70-17` | 23 publicados, 18 disponibles y 12 marcas; 300 impresiones; 10 adiciones al carrito | No registra compra en el corte |
| `/collections/neumaticos-scooter` | 50 productos y una compra observada en un producto scooter | La colección raíz apenas captura consultas de esta intención; falta validar margen y reposición |
| `/collections/cascos-nolan` | 110 productos; 511 impresiones de consultas de marca; una compra observada | Primero se debe confirmar si los 110 productos son activos, vendibles y de reposición estable |
| `/collections/pastillas-freno-moto` | 115 productos en el filtro público y 141 coincidencias de título en sitemap | Repuestos solo registra 6 sesiones orgánicas; falta sanear compatibilidades y taxonomía |
| `/collections/filtros-aceite-moto` | 61 productos en el filtro y una compra de Hiflofiltro observada | Falta validar compatibilidades, stock estable y reglas de colección |

También conviene evaluar futuras colecciones de Rinaldi, Heidenau y Anlas. Rinaldi y Heidenau muestran más demanda de marca en GSC que varias marcas incluidas en la propuesta inicial del roadmap. Maggion no debe priorizarse todavía: solo se observaron 9 productos publicados y 172 impresiones de marca.

## 5. URLs que no se deben crear todavía

- `/collections/neumaticos-para-lluvia`: las consultas detectadas son principalmente de accesorios o indumentaria para lluvia, no de neumáticos.
- `/collections/neumaticos-enduro-motocross`: hay 35 productos Enduro, pero la exportación analizada solo muestra 10 impresiones y 3 clics en el clúster.
- `/collections/neumaticos-chopper-custom`: el volumen observado procede sobre todo del artículo informativo sobre motos custom/chopper; todavía no demuestra intención transaccional para una colección.
- `/collections/neumaticos-150-60-17`: tiene 13 productos publicados y 9 disponibles, pero no registró compra o carrito en el reporte de GA4 analizado.
- Cascos modulares, trail/adventure y ECE 22.06: los títulos publicados no permiten confirmar una taxonomía suficientemente completa. Primero se deben normalizar tipo y certificación en datos de producto.
- Combinaciones de marca + medida: fragmentarían el catálogo y multiplicarían páginas delgadas.

## 6. Tratamiento de las colecciones de marca existentes

No se deben crear duplicados como `/collections/neumaticos-michelin`. Se conservarán y optimizarán las URLs actuales:

- `/collections/michelin`.
- `/collections/dunlop`.
- `/collections/continental`.
- `/collections/ceat`.
- `/collections/eurogrip`.
- `/collections/bridgestone`.
- `/collections/timsun`.

Michelin, Dunlop y Continental son las primeras a optimizar. En el reporte orgánico de productos suman, respectivamente, 10, 9 y 2 unidades compradas, con $1.629.078, $1.335.000 y $538.000 de ingresos atribuidos. Esto es una acción de contenido y enlazado sobre URLs existentes, no una creación de arquitectura.

## 7. Reglas de control antes de publicar una colección

Cada URL propuesta deberá cumplir todos estos puntos:

1. El propietario confirma stock estable, reposición y rentabilidad aceptable.
2. La landing genérica contiene al menos dos marcas activas; no depende de un solo producto.
3. La regla automática de Shopify se basa en campos consistentes, no en títulos escritos de forma variable.
4. Los productos incluidos corresponden exactamente a la intención y se excluyen falsos positivos.
5. Existe un H1, title, meta description, introducción útil, preguntas frecuentes y enlaces internos únicos.
6. La URL responde 200, es indexable, tiene canonical propia y aparece en el sitemap.
7. Los filtros y ordenamientos con parámetros no compiten como páginas indexables.
8. La colección se enlaza desde `/collections/neumaticos`, navegación contextual, productos y artículos relacionados.
9. Si el surtido deja de ser sostenible, se actualiza la colección o se redirige; no se abandona como página vacía.

## 8. Datos que debe confirmar el propietario

Confirmaciones de la primera tanda:

- `[x]` Trail/Adventure es una línea rentable y con reposición estable.
- `[x]` Sport/Street es una línea rentable y con reposición estable.
- `[x]` Las medidas `120/70-17`, `160/60-17` y `90/90-21` mantienen oferta habitual.
- `[x]` No se informaron marcas, líneas o productos que deban excluirse de promoción.
- `[x]` Marcas prioritarias: Dunlop, Bridgestone, Michelin y Continental.
- `[x]` El criterio de colección se apoyará en los metacampos actuales de uso y medida; la auditoría técnica confirmó que son adecuados.

La prioridad de marca influirá en el orden comercial, los ejemplos y el contenido de las landings, pero no excluirá otras marcas compatibles ni modificará por sí sola las reglas automáticas.

## 9. Secuencia de implementación posterior a la aprobación

1. Auditar etiquetas, tipo de producto y metacampos que alimentarán cada colección.
2. Corregir la clasificación de productos antes de exponer la URL.
3. Crear las cinco colecciones sin enlazarlas todavía desde la navegación principal.
4. Preparar la estructura y el contenido definidos en el paso 5.2.
5. Validar productos, canonical, robots, sitemap, breadcrumbs y datos estructurados.
6. Revisar la vista previa en móvil y escritorio con el propietario.
7. Publicar y añadir enlazado interno.
8. Solicitar indexación y medir durante 28 días impresiones, clics, posición, sesiones, carritos, compras e ingresos.

## 10. Criterio de término del paso 5.1

El paso 5.1 quedó cerrado el 2026-09-21. El propietario aprobó las cinco URLs, confirmó rentabilidad y reposición para los dos usos, oferta habitual para las tres medidas y priorización de Dunlop, Bridgestone, Michelin y Continental. No se informaron exclusiones. La creación de colecciones se ejecutará de forma controlada junto con la estructura de contenido del paso 5.2.
