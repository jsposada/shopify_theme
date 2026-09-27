# Cierre técnico — landings de neumáticos y repuestos

- **Fecha de cierre técnico:** 2026-09-27
- **Fecha de publicación y cierre en producción:** 2026-09-27
- **Proyecto:** Bikerz.cl
- **Repositorio:** `C:\JS\shopify`
- **Rama:** `codex/landings-neumaticos-repuestos`
- **Commit funcional final:** `f66ca04`
- **Commit documental previo a la publicación:** `2e3a121`
- **Estado:** desarrollo, revisión, publicación y verificación en producción completados.

## 1. Resultado

Se terminaron las dos landings comerciales previstas:

- `/collections/neumaticos`: búsqueda por medida sobre la colección de neumáticos.
- `/collections/repuestos`: búsqueda por Marca, Modelo y Año conectada al motor de compatibilidad MMY.

Las dos páginas comparten el mismo sistema visual, conservan la navegación nativa de Shopify y mantienen una salida útil cuando no hay selección, no existen resultados o un servicio no responde.

Este documento reemplaza como cierre definitivo a `CIERRE-LANDING-NEUMATICOS-Y-SIGUIENTE-PASO-2026-09-24.md`. El archivo anterior se conserva como registro cronológico detallado.

## 2. Estado de los entornos

| Elemento | Estado al cierre técnico |
| --- | --- |
| Theme publicado | `SEO` — ID `164560142557`; paquete final publicado y verificado el 2026-09-27 |
| Theme de revisión | `Codex landings 2026-09-24` — ID `166033588445` |
| Rama remota | Código funcional y documentación de cierre sincronizados |
| Servicio MMY | Operativo en Easypanel |
| App Proxy | Operativo bajo `/apps/ymm` |
| Publicación final | Completada con autorización explícita del propietario |

Enlaces públicos:

- Neumáticos: <https://www.bikerz.cl/collections/neumaticos?view=neumaticos>
- Repuestos: <https://www.bikerz.cl/collections/repuestos?view=repuestos>

El theme de revisión se conserva como respaldo:

- Neumáticos: <https://www.bikerz.cl/collections/neumaticos?preview_theme_id=166033588445&view=neumaticos>
- Repuestos: <https://www.bikerz.cl/collections/repuestos?preview_theme_id=166033588445&view=repuestos>

## 3. Landing de neumáticos

### Experiencia terminada

- Hero SEO compacto con H1 `Neumáticos para motos en Chile`.
- Tres badges editables desde el editor visual de Shopify.
- Buscador por ancho, perfil, aro y tipo de uso.
- Validación de combinaciones incompletas.
- Barra de estado con medida destacada y cantidad disponible.
- Filtros, ordenamiento, paginación y vistas de grilla o lista nativos.
- Guía compacta para interpretar la medida.
- Preguntas frecuentes editables y ordenables.
- Marcado estructurado `FAQPage` generado desde las preguntas visibles.
- Eventos de analítica personalizados, pendientes de conectar al informe de búsquedas.

### Comportamiento comprobado

- Las búsquedas forman parámetros sobre la colección existente.
- La medida seleccionada permanece destacada en la barra de estado.
- Se manejan singular, plural, cero resultados y selección incompleta.
- La colección sigue siendo navegable si el buscador no puede ejecutarse.
- El canonical permanece en la colección principal; no se crean páginas indexables por cada combinación.

## 4. Landing de repuestos

### Experiencia terminada

- Hero SEO compacto con H1 `Repuestos para motos en Chile`.
- Tres badges editables desde el editor visual de Shopify.
- Buscador progresivo Marca → Modelo → Año → Tipo de repuesto.
- Año opcional mediante `No conozco el año` o campo vacío.
- Resultados consultados mediante Shopify App Proxy y el servicio MMY.
- Compatibilidad exacta diferenciada de las búsquedas realizadas solo por modelo.
- Barra de estado con la moto seleccionada y cantidad disponible.
- Acción `Cambiar moto` sin perder la experiencia de la colección.
- Filtros locales por marca y tipo, ordenamiento y vistas de grilla o lista.
- Estado sin resultados con cambio de selección, catálogo general y WhatsApp.
- Catálogo nativo de Shopify como respaldo si el servicio no responde.
- Preguntas frecuentes editables y ordenables con `FAQPage` opcional.

### Motor MMY

La compatibilidad se resuelve en un servicio FastAPI independiente desplegado en Easypanel:

```text
bikerz.cl
   ↓
Shopify App Proxy /apps/ymm
   ↓
bikerz-ymm-api
   ├── PostgreSQL: reglas de compatibilidad aprobadas
   └── Shopify Storefront API: precio, disponibilidad, imagen y URL
```

La primera cobertura aprobada incluye:

1. Pastillas de freno.
2. Filtros de aceite.
3. Baterías.
4. Filtros de aire.
5. Cadenas.
6. Kits de transmisión.

Agregar más categorías queda como mejora posterior.

## 5. Sistema visual compartido

Ambas landings quedaron unificadas con:

- hero de igual altura y escala tipográfica;
- buscador blanco superpuesto, con borde naranja y sin ícono decorativo de lupa;
- mismo ancho útil que filtros y resultados;
- fondo exterior gris técnico continuo entre buscador y catálogo;
- barra de estado azul de igual altura y tipografía;
- medida o moto destacada con mayor peso tipográfico;
- separación de 40 px hacia resultados en escritorio y 30 px en móvil;
- panel lateral de filtros común, ampliado aproximadamente 15 %;
- títulos internos de filtros reducidos y signos `+` junto al título;
- controles equivalentes de grilla, lista y ordenamiento;
- cuatro productos por fila en computador y dos en móvil como valores iniciales;
- cantidades de columnas configurables desde Shopify;
- nueva tarjeta de producto Bikerz para los catálogos nativos.

## 6. Configuración administrable en Shopify

El propietario puede modificar sin editar código:

- los textos de los tres badges de cada hero;
- preguntas y respuestas de cada landing;
- orden, creación y eliminación de hasta 12 preguntas;
- activación del marcado `FAQPage`;
- cantidad de productos por fila en computador y móvil;
- diseño de tarjeta `Original` o `Nuevo Bikerz`.

Los datos de compatibilidad y la lógica de búsqueda no se administran desde estos textos del theme.

## 7. Archivos principales

### Compartidos

- `assets/seo-collection-results.css`
- `assets/product-card-bikerz.css`
- `sections/main-collection-product-grid.liquid`
- `sections/seo-landing-faq.liquid`
- `snippets/product-card-bikerz.liquid`
- `snippets/product-card-selector.liquid`
- `config/settings_schema.json`

### Neumáticos

- `templates/collection.neumaticos.json`
- `sections/seo-tire-hero.liquid`
- `sections/tire-finder.liquid`
- `sections/seo-tire-guide.liquid`
- `assets/seo-tire-landing.css`

### Repuestos

- `templates/collection.repuestos.json`
- `sections/seo-parts-hero.liquid`
- `sections/ymm-part-finder.liquid`
- `assets/seo-parts-landing.css`

## 8. Validación de cierre

### Validación local del 2026-09-27

- `collection.neumaticos.json`: JSON válido.
- `collection.repuestos.json`: JSON válido.
- Theme Check sobre los archivos Liquid propios de las landings: **0 errores**.
- Theme Check informó 12 advertencias en tres archivos compartidos; corresponden a detección estática de snippets y objetos dinámicos, no a errores bloqueantes.
- El análisis global del theme heredado mantiene 903 errores y 371 advertencias en 134 archivos, principalmente traducciones y código histórico fuera del alcance de las landings.

### Validaciones funcionales registradas

- Un único H1 por landing.
- Sin desbordamiento horizontal en la revisión a 390 px.
- Búsqueda de neumáticos con resultados y sin resultados.
- Flujo de repuestos con año y sin año.
- Resultado MMY exacto y resultado solo por modelo.
- Filtros, orden, grilla, lista y botones operativos.
- Servicio MMY y App Proxy con respuestas correctas.
- Sin errores nuevos de consola durante las revisiones registradas.

### Publicación y verificación en producción del 2026-09-27

- Publicación realizada en el theme live `SEO`, ID `164560142557`.
- Se subieron únicamente los 12 archivos necesarios para las dos landings, con protección contra borrado de archivos remotos.
- Se excluyeron los nueve archivos modificados del proyecto que no pertenecían a este trabajo.
- Descarga posterior del paquete desde Shopify: **12 de 12 archivos presentes**.
- Comparación SHA-256 entre el paquete local y el descargado desde producción: **12 de 12 coincidencias**.
- Respuesta pública de `/collections/neumaticos?view=neumaticos`: HTTP 200, H1, buscador y hoja de estilos correctos.
- Respuesta pública de `/collections/repuestos?view=repuestos`: HTTP 200, H1, buscador y hoja de estilos correctos.
- Prueba real de neumáticos: medida `120/70-17`, con 31 neumáticos disponibles.
- Prueba real de repuestos: `Honda CB 500 · 2026` + `Filtros de aceite`, con un repuesto compatible y disponible.
- Ambas pruebas mantuvieron un solo H1, no presentaron desbordamiento horizontal y no registraron errores de consola.

## 9. Decisiones finales

- Se conservan las colecciones existentes como URLs canónicas.
- No se crean páginas automáticas indexables por medida o vehículo.
- Shopify sigue siendo la fuente comercial de productos, precios y disponibilidad.
- PostgreSQL y el servicio MMY resuelven únicamente compatibilidades aprobadas.
- La navegación manual por las colecciones se mantiene como respaldo.
- La compatibilidad exacta requiere un año seleccionado y una regla aprobada.
- Los cambios se probaron primero en un theme no publicado.

## 10. Pendientes fuera del cierre de las landings

Estos puntos no impiden considerar terminado el desarrollo de las landings:

- Agregar más categorías al motor MMY.
- Implementar métricas y rankings de lo más buscado según `PLAN-METRICAS-BUSCADORES-NEUMATICOS-REPUESTOS.md`.
- Evaluar compatibilidad coherente dentro de las fichas de producto.
- Resolver la deuda histórica de Theme Check del theme base en un proyecto separado.
- Medir resultados SEO y comerciales después de la publicación.

## 11. Procedimiento de publicación y reversión

Antes de publicar:

1. Descargar una copia aislada de los archivos involucrados desde el theme live.
2. Comparar la copia con el paquete aprobado para detectar cambios remotos recientes.
3. Probar ambas vistas previas en computador y móvil.
4. Publicar únicamente los archivos del paquete, con protección contra borrados.
5. Verificar inmediatamente las dos URLs públicas y una búsqueda real en cada landing.
6. Descargar los archivos publicados y comprobar su coincidencia con el paquete local.

Reversión:

- conservar la descarga previa del theme live;
- mantener disponible el theme anterior;
- si aparece una regresión, restaurar únicamente los archivos del paquete y repetir las pruebas de humo.

## 12. Definición de cierre

### Cierre técnico

Se considera completado cuando:

- este documento y el plan de métricas están versionados;
- la rama remota contiene el código aprobado;
- las plantillas son válidas;
- no existen errores de Theme Check en los archivos propios de las landings;
- los pendientes quedan separados del alcance terminado.

### Cierre en producción

Completado el 2026-09-27:

- [x] El propietario autorizó explícitamente la publicación.
- [x] El paquete se publicó sin sobrescribir cambios ajenos.
- [x] Ambas URLs públicas superaron las pruebas de humo.
- [x] Se registraron la evidencia de publicación y la ruta de reversión.
