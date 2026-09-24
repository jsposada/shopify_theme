# Plan de implementación — landings de neumáticos y repuestos con buscadores

**Creado:** 2026-09-24  
**Estado:** propuesta pendiente de aprobación e implementación  
**Proyecto Shopify:** `C:\JS\shopify`  
**Motor de compatibilidad:** `C:\JS\bikerz_app\ymm`  
**Documento principal relacionado:** `docs/seo/SEO-ROADMAP.md`

## 1. Objetivo

Convertir las dos colecciones comerciales principales en landings útiles, indexables y orientadas a conversión:

1. `/collections/neumaticos`: landing de neumáticos con el buscador por medida que ya existe.
2. `/collections/repuestos`: landing de repuestos con un nuevo buscador Marca → Modelo → Año basado en la arquitectura YMM existente.

Las dos landings deben permitir comprar desde la misma categoría, mantener una intención SEO única y evitar páginas duplicadas.

## 2. Decisión de arquitectura propuesta

### 2.1 URLs principales

| Landing | URL canónica propuesta | Intención principal |
| --- | --- | --- |
| Neumáticos | `/collections/neumaticos` | `neumáticos para motos en Chile` |
| Repuestos | `/collections/repuestos` | `repuestos para motos en Chile` |

No se crearán páginas duplicadas como `/pages/buscador-neumaticos` o `/pages/buscador-repuestos`.

### 2.2 Acceso para el usuario

Las landings seguirán siendo accesibles desde:

- Menú principal: `NEUMÁTICOS` y `REPUESTOS`.
- Tarjetas de categorías de la home.
- Enlaces internos desde productos, artículos y otras colecciones pertinentes.
- Resultados orgánicos de Google.

### 2.3 Relación con las cinco landings SEO del paso 5.2

Las colecciones Trail/Adventure, Sport/Street y las medidas `120/70-17`, `160/60-17` y `90/90-21` son un trabajo separado.

Por ahora:

- Permanecen sin enlaces internos y sin autorización de publicación.
- Sus imágenes reales continúan pendientes.
- No condicionan la construcción de las dos landings principales.
- No se marcará el paso 5.2 como terminado hasta registrar la decisión definitiva sobre esas cinco páginas.

## 3. Situación actual verificada

### 3.1 Neumáticos

- Existe `sections/tire-finder.liquid`.
- Actualmente se utiliza en la home.
- Consulta la colección de neumáticos y trabaja con:
  - `custom.ancho`.
  - `custom.aspecto`.
  - `custom.di_metro`.
- El flujo actual es Ancho → Perfil → Aro.
- Redirige a `/collections/neumaticos` con los filtros seleccionados.
- Ya fue revisado en accesibilidad y funcionamiento.
- La colección principal conserva grilla, filtros, ordenamiento y paginación.

### 3.2 Repuestos

- Existe `sections/part-finder.liquid`, pero es un prototipo incompleto.
- Ese prototipo consulta una compatibilidad genérica y no implementa la arquitectura YMM vigente.
- No debe publicarse ni reutilizarse sin corregir su lógica.
- El motor YMM tiene PostgreSQL como fuente de verdad y Shopify como proyección comercial.

Datos documentados actualmente en YMM:

- 178 marcas.
- 10.408 modelos.
- 103.733 vehículos por año.
- 347 productos administrados en PostgreSQL.
- 19.466 reglas de compatibilidad.
- 56.865 metaobjetos `moto` administrados.
- 7.443 metaobjetos `moto_model`.
- 307 productos Shopify sincronizados en la primera carga.
- 279 productos encontrados con compatibilidades.
- 40 SKU de PostgreSQL sin correspondencia en Shopify, pendientes de revisión.

La compatibilidad anual puede estar fragmentada en cinco metacampos:

1. `custom.motos_compatibles`.
2. `custom.motos_compatibles_2`.
3. `custom.motos_compatibles_3`.
4. `custom.motos_compatibles_4`.
5. `custom.motos_compatibles_5`.

La compatibilidad sin año utiliza:

- Metaobjeto `moto_model`.
- Metacampo `custom.modelos_compatibles_sin_year`.

Solo se deben exponer reglas con `review_status=approved`.

## 4. Alcance funcional propuesto

### 4.1 Landing de neumáticos

La landing deberá contener, en este orden general:

1. Breadcrumbs.
2. Un único H1: `Neumáticos para motos en Chile`.
3. Introducción corta y útil antes del buscador.
4. Buscador completo por Ancho → Perfil → Aro.
5. Estado de carga y mensajes de validación.
6. Grilla de productos de la colección.
7. Ayuda para identificar la medida correcta.
8. Marcas disponibles, construidas con datos reales.
9. Información sobre instalación y taller.
10. Preguntas frecuentes visibles.
11. Enlaces internos pertinentes.

### 4.2 Landing de repuestos

La landing deberá contener:

1. Breadcrumbs.
2. Un único H1: `Repuestos para motos en Chile`.
3. Introducción breve sobre compatibilidad.
4. Buscador Marca → Modelo → Año.
5. Opción explícita `No conozco el año`.
6. Tipo de repuesto como filtro opcional posterior a la moto.
7. Resumen de la selección del usuario.
8. Resultados compatibles.
9. Indicador del nivel de certeza de la compatibilidad.
10. Acción para cambiar la moto.
11. Ayuda por WhatsApp cuando no existan resultados o haya dudas.
12. Contenido SEO y preguntas frecuentes después de los productos.

## 5. Reglas funcionales del buscador MMY

Aunque el proyecto interno se denomina YMM, la interfaz en español utilizará el orden Marca → Modelo → Año.

### 5.1 Selección exacta con año

Cuando el usuario seleccione marca, modelo y año:

- La búsqueda será estricta para el vehículo seleccionado.
- Se consultará la unión de los cinco metacampos `custom.motos_compatibles*` o su equivalente en la fuente de verdad.
- El resultado podrá mostrar `Compatible con tu moto` únicamente cuando la regla aprobada respalde ese año.
- No se usarán compatibilidades `unspecified` como garantía anual.

### 5.2 Selección sin año

Cuando el usuario elija `No conozco el año`:

- Se consultará la compatibilidad por `moto_model`.
- Se utilizará la información equivalente a `custom.modelos_compatibles_sin_year`.
- El resultado deberá advertir: `Compatible con el modelo. Confirma el año antes de comprar`.
- Se ofrecerá ayuda para confirmar la compatibilidad antes de finalizar la compra.

### 5.3 Sin resultados

El estado sin resultados debe:

- Mantener visible la moto seleccionada.
- Permitir cambiar marca, modelo o año.
- Ofrecer navegación manual por categorías de repuestos.
- Mostrar el WhatsApp oficial `+56 9 7767 0252`.
- Registrar el caso en analítica sin enviar datos personales.
- No afirmar que el repuesto no existe; debe indicar que no se encontró una coincidencia publicada.

### 5.4 Productos y disponibilidad

- Solo se mostrarán productos publicados y comercializables en Shopify.
- Precio, disponibilidad e imagen deben obtenerse de Shopify o validarse contra Shopify en tiempo real.
- PostgreSQL resolverá la compatibilidad, pero no será la fuente final de precio o stock.
- Los 40 SKU sin correspondencia en Shopify no podrán aparecer hasta resolver su estado.

## 6. Arquitectura técnica recomendada para MMY

### 6.1 Principio

No se descargarán al navegador todas las referencias de compatibilidad. Algunos productos tienen miles de referencias y uno de los casos documentados ocupa los cinco fragmentos anuales.

La solución recomendada es:

```text
Tema Shopify
  → servicio de consulta YMM
  → PostgreSQL resuelve la compatibilidad aprobada
  → Shopify confirma producto publicado, precio y disponibilidad
  → tema muestra los resultados
```

### 6.2 Decisión técnica pendiente

Antes de desarrollar se compararán estas alternativas:

1. Shopify App Proxy hacia `bikerz_app`, opción preferida si la aplicación actual permite configurarlo.
2. Endpoint público controlado en `bikerz_app`, con CORS restringido a Bikerz.
3. Proyección precomputada y cacheada como respaldo, solo si el hosting no permite consultas en línea.

No se recomienda resolver el buscador exclusivamente con JavaScript leyendo todos los metafields de todos los productos.

### 6.3 Contrato preliminar del servicio

El contrato definitivo se documentará antes de programar. Como punto de partida:

```text
GET /api/ymm/makes
GET /api/ymm/models?make_id={id}
GET /api/ymm/years?model_id={id}
GET /api/ymm/products?model_id={id}&year={year}&part_type={tipo}
```

Requisitos del servicio:

- Validar parámetros y limitar tamaños de respuesta.
- Entregar identificadores estables, no credenciales.
- Excluir reglas pendientes o rechazadas.
- Distinguir coincidencia anual exacta de compatibilidad solo por modelo.
- Implementar caché para marcas, modelos y años.
- Aplicar límites de uso y registro de errores.
- No exponer credenciales de PostgreSQL ni del Admin API en el navegador.
- Devolver únicamente los datos necesarios para construir los resultados.

### 6.4 Decisión técnica de la fase 0

La integración recomendada es un servicio HTTPS de solo lectura dentro de
`bikerz_app`, expuesto al storefront mediante Shopify App Proxy. El navegador
consultará rutas del mismo dominio, por ejemplo `/apps/ymm/makes`, y Shopify
reenviará la solicitud firmada al servicio. El backend validará la firma del
proxy antes de consultar PostgreSQL.

La aplicación actual no incluye un servidor HTTP ni una configuración de App
Proxy utilizable. Por ello, el servicio se implementará como módulo aislado,
sin convertir `main.py` ni el proceso nocturno en servidor web. La propuesta es
usar FastAPI, Uvicorn y el cliente PostgreSQL ya adoptado por el proyecto, con
dependencias y punto de entrada separados del proceso por lotes.

Superficie prevista:

```text
GET /apps/ymm/makes
GET /apps/ymm/models?make_id={id}
GET /apps/ymm/years?model_id={id}
GET /apps/ymm/part-types?model_id={id}&year={year_opcional}
GET /apps/ymm/products?model_id={id}&year={year_opcional}&part_type={tipo}&cursor={cursor}
```

Reglas del contrato:

- La ausencia de `year` representa explícitamente una búsqueda solo por modelo;
  no se utilizará un año centinela.
- Cada resultado declarará `match_level=exact_year` o
  `match_level=model_only`.
- Solo se consultarán reglas `approved`, productos activos y productos con
  identificador Shopify conocido.
- La respuesta comercial se validará en lote contra Shopify antes de devolver
  título, URL, imagen, precio y disponibilidad.
- La primera página tendrá un máximo definido de resultados y continuará con
  cursor; no se enviará el catálogo completo al navegador.
- Marcas, modelos y años tendrán caché larga; los resultados comerciales usarán
  caché corta para no presentar stock o precio obsoleto.
- Se aplicarán validación estricta de parámetros, límites de uso, tiempos de
  espera, registro técnico sin datos personales y respuestas de error estables.
- Marca, modelo, año y tipo de repuesto serán estado de interfaz, no nuevas URLs
  indexables.

Si el hosting o la configuración de la aplicación no permiten App Proxy, el
mismo servicio podrá publicarse temporalmente como endpoint controlado con CORS
restringido, límites de uso y protección equivalente. La proyección estática se
mantiene como último recurso, no como primera implementación.

### 6.5 Categorías iniciales recomendadas

La consulta de solo lectura del 2026-09-24 encontró estos seis grupos con mayor
cobertura comercial útil y compatibilidades aprobadas:

| Categoría visible | `part_type` | Productos comerciales | SKU con compatibilidad aprobada |
| --- | --- | ---: | ---: |
| Pastillas de freno | `Brake Pads` | 141 | 154 |
| Filtros de aceite | `Oil Filter` | 74 | 82 |
| Baterías | `Battery` | 23 | 16 |
| Filtros de aire | `Air Filter` | 18 | 19 |
| Cadenas | `Chain` | 16 | 9 |
| Kits de transmisión | `Transmission Kit` | 13 | 17 |

Los conteos de SKU aprobados pueden superar los productos comerciales porque
algunas referencias todavía no tienen correspondencia publicable en Shopify.
La interfaz solo mostrará el subconjunto comercial validado.

La primera versión se limitará a estas seis categorías. Agregar más categorías
queda registrado como pendiente y se evaluará usando inventario comercial,
compatibilidades aprobadas, demanda observada y calidad de los resultados.

## 7. Plan de ejecución

### Fase 0 — Inicio seguro y decisiones

**Objetivo:** iniciar la otra conversación con información suficiente y sin sobrescribir cambios productivos.

#### Tareas de Codex

- `[x]` Leer completamente este documento.
- `[x]` Revisar `docs/seo/SEO-ROADMAP.md` y el estado de Git antes de editar.
- `[x]` Revisar el theme live y compararlo con la copia local antes de cualquier despliegue.
- `[x]` Confirmar qué cambios locales pertenecen al trabajo SEO anterior.
- `[x]` Inspeccionar la infraestructura ejecutable de `C:\JS\bikerz_app`, no solo los documentos YMM.
- `[x]` Proponer el método de integración definitivo: App Proxy, endpoint controlado o proyección cacheada.
- `[x]` Definir un plan de ramas y commits separado para Shopify y `bikerz_app`: `codex/landings-neumaticos-repuestos` y `codex/ymm-query-api`.

#### Decisiones del propietario

- `[x]` Aprobar el uso de las URLs existentes de las colecciones.
- `[x]` Aprobar el orden visible Marca → Modelo → Año.
- `[x]` Aprobar que el año sea opcional mediante `No conozco el año`.
- `[x]` Aprobar que el buscador de neumáticos siga también en la home.
- `[x]` Definir las categorías iniciales de repuestos visibles después de seleccionar la moto: seis categorías aprobadas con conteos reales; ampliar el listado queda como pendiente posterior.

#### Criterio de término

- Arquitectura de integración documentada y aprobada.
- No se ha modificado ni desplegado el theme live.
- Riesgos y archivos afectados están identificados.

**Estado al 2026-09-24:** fase completada. La auditoría, sincronización segura,
arquitectura, categorías iniciales y separación de ramas están aprobadas. No se
modificó ni desplegó el theme live.

### Fase 1 — Especificación visual y funcional

**Objetivo:** aprobar el comportamiento antes de programar.

#### Tareas de Codex

- `[x]` Crear wireframe de escritorio y móvil para ambas landings.
- `[x]` Definir estados del buscador de neumáticos: inicial, cargando, incompleto, válido, sin resultados y error.
- `[x]` Definir estados MMY: inicial, marca elegida, modelo elegido, año exacto, sin año, buscando, resultados, sin resultados y error.
- `[x]` Redactar todos los textos de interfaz y compatibilidad.
- `[x]` Definir el comportamiento sin JavaScript: las colecciones, categorías, filtros y productos siguen siendo navegables debajo del buscador.
- `[x]` Definir cómo se mostrará el tipo de repuesto: cuarto selector, habilitado después de elegir el modelo y opcional por defecto.
- `[x]` Definir dónde aparecerá `Cambiar moto`: dentro del resumen persistente de la selección, antes de los resultados.
- `[x]` Definir el enlace y mensaje de ayuda por WhatsApp: `wa.me/56977670252` con una solicitud breve de confirmación de repuesto.

#### Tareas del propietario

- `[ ]` Revisar la jerarquía y apariencia en escritorio.
- `[ ]` Revisar la experiencia móvil.
- `[ ]` Aprobar los textos que prometen compatibilidad.
- `[ ]` Confirmar los tipos de repuesto prioritarios.

#### Criterio de término

- Todos los estados tienen diseño y texto aprobado.
- No quedan decisiones funcionales críticas para comenzar el código.

**Estado al 2026-09-24:** propuesta visual y funcional preparada en escritorio y
móvil, con todos los estados interactivos. Pendiente de revisión y aprobación
del propietario antes de comenzar código de las landings.

### Fase 2 — Landing de neumáticos

**Objetivo:** convertir `/collections/neumaticos` en la landing completa sin esperar el buscador MMY.

#### Tareas de Codex

- `[ ]` Crear una plantilla específica para la colección de neumáticos o extender la plantilla actual sin afectar otras colecciones.
- `[ ]` Reutilizar `tire-finder.liquid` sin duplicar su lógica.
- `[ ]` Permitir configuración independiente para home y colección.
- `[ ]` Mantener Ancho → Perfil → Aro y la colección de destino.
- `[ ]` Mantener las mejoras de accesibilidad ya aprobadas.
- `[ ]` Añadir introducción superior concisa.
- `[ ]` Mantener filtros, ordenamiento, paginación y grilla actuales.
- `[ ]` Añadir contenido extendido después de los productos.
- `[ ]` Añadir enlaces al servicio de instalación y artículos pertinentes.
- `[ ]` Confirmar canonical, robots y tratamiento de parámetros.
- `[ ]` Añadir medición del uso del buscador.

#### Tareas del propietario

- `[ ]` Aprobar el texto introductorio y el contenido inferior.
- `[ ]` Aprobar la posición y tamaño del buscador.
- `[ ]` Probar al menos tres medidas reales con productos.
- `[ ]` Probar una combinación sin resultados.
- `[ ]` Aprobar escritorio y móvil.

#### Criterios de aceptación

- Un único H1.
- La búsqueda dirige a la colección con los filtros correctos.
- La grilla y los filtros continúan funcionando por AJAX.
- No hay desbordamiento horizontal en móvil.
- El teclado sigue el orden lógico.
- No hay errores nuevos en consola.
- La colección puede navegarse aunque falle el buscador.
- No se generan nuevas URLs indexables para cada filtro.

### Fase 3 — Contrato y pruebas del motor MMY

**Objetivo:** demostrar que la consulta produce resultados correctos antes de conectarla al theme.

#### Tareas de Codex en `bikerz_app`

- `[ ]` Documentar las consultas necesarias en PostgreSQL.
- `[ ]` Implementar el contrato del servicio aprobado en la fase 0.
- `[ ]` Filtrar siempre por `review_status=approved`.
- `[ ]` Resolver correctamente `all_years`, `range`, `unspecified` y `exact_vehicle`.
- `[ ]` Devolver coincidencia exacta o solo por modelo de forma explícita.
- `[ ]` Cruzar los resultados con los identificadores Shopify disponibles.
- `[ ]` Excluir SKU sin correspondencia comercial.
- `[ ]` Implementar caché, validación, manejo de errores y registro técnico.
- `[ ]` Crear pruebas automatizadas del servicio.

#### Casos de prueba obligatorios

- `[ ]` Marca con múltiples modelos.
- `[ ]` Modelo con múltiples años.
- `[ ]` Regla `all_years`.
- `[ ]` Rango cerrado.
- `[ ]` Rango con inicio o fin abierto.
- `[ ]` Compatibilidad `unspecified` sin promesa anual.
- `[ ]` Producto con referencias distribuidas en los cinco fragmentos.
- `[ ]` SKU inexistente o no publicado en Shopify.
- `[ ]` Moto válida sin productos compatibles.
- `[ ]` Parámetros inválidos o manipulados.

#### Criterio de término

- Las pruebas demuestran que no hay falsos positivos en los casos conocidos.
- El servicio no expone secretos.
- La respuesta distingue de forma inequívoca la compatibilidad exacta y la compatibilidad solo por modelo.

### Fase 4 — Buscador MMY en la landing de repuestos

**Objetivo:** integrar la búsqueda real en `/collections/repuestos`.

#### Tareas de Codex

- `[ ]` Crear un componente nuevo; no publicar el prototipo actual sin corregirlo.
- `[ ]` Cargar marcas y modelos de forma progresiva.
- `[ ]` Mostrar únicamente años válidos para el modelo.
- `[ ]` Incluir `No conozco el año`.
- `[ ]` Ejecutar la consulta al servicio MMY.
- `[ ]` Mostrar resumen de la moto seleccionada.
- `[ ]` Mostrar y cambiar el tipo de repuesto.
- `[ ]` Renderizar resultados con información comercial vigente de Shopify.
- `[ ]` Mostrar el nivel correcto de compatibilidad.
- `[ ]` Implementar estados de carga, error y cero resultados.
- `[ ]` Conservar navegación manual por la colección.
- `[ ]` Añadir medición de cada paso del embudo.

#### Tareas del propietario

- `[ ]` Probar motos reales frecuentes en la tienda.
- `[ ]` Verificar manualmente una muestra de resultados con conocimiento comercial.
- `[ ]` Probar el flujo sin conocer el año.
- `[ ]` Aprobar los mensajes de compatibilidad y advertencia.
- `[ ]` Aprobar escritorio y móvil.

#### Criterios de aceptación

- Modelo y año dependen correctamente de la selección anterior.
- No se promete compatibilidad anual para reglas `unspecified`.
- Los resultados no incluyen productos ocultos o no comercializables.
- Precio y disponibilidad coinciden con Shopify.
- El usuario puede cambiar su moto sin recargar toda la experiencia.
- El estado sin resultados tiene una salida útil.
- La colección sigue siendo utilizable si el servicio MMY no responde.

### Fase 5 — Compatibilidad en la ficha de producto

**Objetivo:** mantener coherencia entre lo que afirma el buscador y la ficha del producto.

#### Tareas de Codex

- `[ ]` Auditar todos los snippets de compatibilidad de repuestos.
- `[ ]` Corregir los componentes que actualmente leen solo `custom.motos_compatibles`.
- `[ ]` Unir los cinco metacampos anuales cuando corresponda.
- `[ ]` Incorporar el tratamiento de compatibilidad solo por modelo.
- `[ ]` Mostrar la moto elegida y la confirmación de compatibilidad en la ficha.
- `[ ]` Permitir cambiar o eliminar la moto seleccionada.
- `[ ]` Evitar duplicados al unir fragmentos.
- `[ ]` Definir si la selección se conserva durante la sesión.

#### Tareas del propietario

- `[ ]` Aprobar la presentación de compatibilidad en la ficha.
- `[ ]` Confirmar si desea recordar la última moto en futuras visitas.
- `[ ]` Validar una muestra de fichas de cada categoría de repuesto prioritaria.

#### Criterio de término

- La ficha no contradice al buscador.
- Se identifican claramente las coincidencias exactas y las que requieren confirmación de año.

### Fase 6 — SEO, accesibilidad, rendimiento y analítica

#### SEO

- `[ ]` Confirmar title y meta description únicos para ambas colecciones.
- `[ ]` Confirmar un único H1 por página.
- `[ ]` Mantener canonical propia en las dos colecciones.
- `[ ]` Evitar indexar estados dinámicos Marca/Modelo/Año.
- `[ ]` Evitar crear miles de páginas automáticas por vehículo.
- `[ ]` Revisar breadcrumbs y datos estructurados existentes.
- `[ ]` Mantener preguntas frecuentes visibles sin prometer resultados enriquecidos.
- `[ ]` Revisar enlaces internos y ausencia de canibalización.

#### Accesibilidad

- `[ ]` Asociar cada etiqueta con su control.
- `[ ]` Anunciar cargas, errores y cantidades de resultados.
- `[ ]` Mantener foco visible y orden lógico de teclado.
- `[ ]` Llevar el foco al resumen o a los resultados después de buscar.
- `[ ]` No depender solo del color para indicar compatibilidad.
- `[ ]` Validar lector de pantalla y uso sin mouse.

#### Rendimiento

- `[ ]` Medir la colección antes de implementar.
- `[ ]` Evitar descargar el catálogo YMM completo al cliente.
- `[ ]` Cargar datos progresivamente.
- `[ ]` Usar caché para taxonomías estables.
- `[ ]` Evitar nuevas solicitudes por cada tarjeta cuando pueda resolverse en lote.
- `[ ]` Comparar métricas móviles antes y después.

#### Eventos propuestos

- `tire_finder_start`.
- `tire_finder_submit`.
- `tire_finder_no_results`.
- `ymm_make_selected`.
- `ymm_model_selected`.
- `ymm_year_selected`.
- `ymm_unknown_year_selected`.
- `ymm_search_submit`.
- `ymm_results_view`.
- `ymm_no_results`.
- `ymm_product_click`.
- `compatibility_help_click`.

No se enviarán nombres, teléfonos ni otra información personal a GA4.

#### Criterio de término

- Auditoría SEO, accesible y de rendimiento documentada.
- Eventos visibles en modo de depuración.
- No hay regresiones comerciales en la colección, carrito o navegación.

### Fase 7 — Publicación controlada

#### Tareas de Codex

- `[ ]` Volver a comparar el theme live con el repositorio inmediatamente antes de publicar.
- `[ ]` Incorporar primero cualquier cambio productivo que no exista en local.
- `[ ]` Revisar el diff exacto de archivos a desplegar.
- `[ ]` Subir inicialmente a un theme no publicado.
- `[ ]` Entregar enlaces de vista previa para ambas landings.
- `[ ]` Ejecutar pruebas de humo en escritorio y móvil.
- `[ ]` Publicar solo después de la aprobación explícita del propietario.
- `[ ]` Verificar las URLs públicas inmediatamente después.
- `[ ]` Conservar el theme anterior disponible para reversión.

#### Tareas del propietario

- `[ ]` Aprobar la vista previa final.
- `[ ]` Autorizar explícitamente la publicación.
- `[ ]` Comprobar búsquedas reales después del despliegue.

#### Criterio de término

- No se reemplazaron cambios productivos ajenos.
- Las dos URLs públicas funcionan.
- Existe una ruta clara de reversión.
- Los repositorios quedan con commits identificables y sin archivos accidentales.

### Fase 8 — Seguimiento posterior

#### Primera revisión: 24–72 horas

- `[ ]` Errores del servicio MMY.
- `[ ]` Búsquedas sin resultados.
- `[ ]` Eventos de analítica.
- `[ ]` Productos incorrectos reportados.
- `[ ]` Comportamiento móvil.

#### Revisión SEO y comercial: 28 días

- `[ ]` Sesiones orgánicas de ambas colecciones.
- `[ ]` Uso y finalización de cada buscador.
- `[ ]` Tasa de cero resultados.
- `[ ]` Clics a productos después de buscar.
- `[ ]` Adiciones al carrito.
- `[ ]` Compras e ingresos asistidos.
- `[ ]` Consultas y posición de cada colección en Search Console.
- `[ ]` Diferencia entre coincidencias exactas y búsquedas sin año.

#### Revisión estratégica: 8–12 semanas

- `[ ]` Evaluar páginas SEO manuales para modelos de motos con demanda demostrada.
- `[ ]` No crear esas páginas si no tienen inventario, variedad, demanda y contenido propio.
- `[ ]` Revaluar las cinco landings pendientes del paso 5.2.

## 8. Distribución de responsabilidades

| Área | Codex | Propietario |
| --- | --- | --- |
| Auditoría técnica | Ejecuta y documenta | Aporta contexto comercial |
| Arquitectura | Propone e implementa | Aprueba decisiones de alcance |
| Diseño funcional | Prepara wireframes y estados | Revisa y aprueba |
| Contenido SEO | Redacta y configura | Confirma exactitud comercial |
| Landing neumáticos | Implementa y prueba | Prueba medidas y aprueba |
| Servicio MMY | Implementa y prueba | Entrega casos reales de control |
| Landing repuestos | Implementa y prueba | Verifica compatibilidades |
| Despliegue | Prepara vista previa y publica con autorización | Autoriza publicación |
| Seguimiento | Analiza datos | Confirma calidad de ventas y consultas |

## 9. Riesgos y controles

| Riesgo | Control obligatorio |
| --- | --- |
| Sobrescribir cambios del theme live | Comparación live/local antes de cada publicación |
| Falsos positivos de compatibilidad | Solo reglas aprobadas y pruebas con casos reales |
| Leer solo el primer fragmento anual | Consulta unificada de los cinco fragmentos o de PostgreSQL |
| Prometer un año no verificado | Mensaje diferente para compatibilidad solo por modelo |
| Catálogo demasiado pesado en el navegador | Consulta del lado del servicio y carga progresiva |
| Precio o stock desactualizado | Shopify como fuente comercial final |
| Crear URLs duplicadas o canibalización | Usar las dos colecciones existentes como URLs canónicas |
| Crear miles de páginas YMM pobres | Estados dinámicos no indexables; landings manuales solo con evidencia |
| Fallo del servicio MMY | Mantener navegación manual por la colección |
| Resultados con productos no publicados | Validación contra estado comercial de Shopify |

## 10. Fuera de alcance inicial

- Crear una cuenta de usuario para guardar varias motos.
- Crear automáticamente una landing SEO por cada marca, modelo o año.
- Garantizar compatibilidad para reglas `unspecified`.
- Resolver los 40 SKU sin correspondencia como parte del frontend.
- Cambiar la fuente de verdad desde PostgreSQL.
- Publicar las cinco landings secundarias del paso 5.2.
- Reemplazar el buscador general de Shopify.

## 11. Definición global de terminado

El proyecto se considerará terminado cuando:

1. Las dos colecciones funcionan como landings visibles y útiles.
2. El buscador de neumáticos filtra correctamente por medida.
3. El buscador MMY devuelve compatibilidades verificables.
4. La experiencia distingue año exacto de modelo sin año.
5. Las fichas de producto no contradicen los resultados.
6. No se crean páginas duplicadas ni combinaciones YMM indexables automáticamente.
7. SEO, accesibilidad, rendimiento y analítica están validados.
8. El propietario aprobó escritorio, móvil y publicación.
9. Los cambios productivos previos fueron preservados.
10. Los repositorios quedan documentados y con commits limpios.

## 12. Instrucción para retomar en una conversación nueva

Usar este mensaje inicial:

> Trabajaremos el plan `C:\JS\shopify\docs\seo\PLAN-LANDINGS-NEUMATICOS-REPUESTOS-MMY.md`. Lee el documento completo y comienza únicamente por la Fase 0. Mantén separados el theme Shopify en `C:\JS\shopify` y el motor YMM en `C:\JS\bikerz_app`. No publiques ni modifiques el theme live sin entregarme primero una vista previa y recibir mi aprobación explícita. Registra en el mismo archivo cada decisión, avance, evidencia y pendiente.

## 13. Registro de decisiones y avances

Agregar aquí las decisiones de la conversación futura, sin depender de su contexto:

| Fecha | ID | Decisión o avance | Responsable | Evidencia |
| --- | --- | --- | --- | --- |
| 2026-09-24 | LMMY-001 | Se creó el plan independiente; no se modificó el theme ni el roadmap principal. | Codex | Este documento |
| 2026-09-24 | LMMY-002 | Se aprobaron las URLs `/collections/neumaticos` y `/collections/repuestos`, el orden Marca → Modelo → Año, la opción `No conozco el año` y la permanencia del buscador de neumáticos en la home. | Propietario | Confirmación `vamos` después de presentar el paquete de decisiones |
| 2026-09-24 | LMMY-003 | El trabajo SEO local anterior se preservó en `c771fde` y se creó la rama `codex/landings-neumaticos-repuestos`. | Codex | Git local |
| 2026-09-24 | LMMY-004 | Se descargó el theme live `SEO` (`164560142557`) a una carpeta aislada y se comparó con HEAD y el working tree. Se detectaron 16 archivos con estado remoto más reciente; 15 producían diferencias reales y se incorporaron sin reemplazar los archivos locales de las previews SEO. | Codex | `.tmp/landings-phase0-live-20260924/` y commit `f7c55d2` |
| 2026-09-24 | LMMY-005 | Después de sincronizar producción, las únicas diferencias frente al live son cuatro archivos locales modificados para las previews y ocho archivos nuevos de las landings SEO no publicadas. No se modificó ni desplegó el theme live. | Codex | Comparación SHA-256 local/live |
| 2026-09-24 | LMMY-006 | `bikerz_app` contiene un ETL por lotes y consultas YMM, pero no un servidor HTTP ni configuración desplegable de App Proxy. Las 11 pruebas YMM existentes pasan. | Codex | `python -m unittest discover -s ymm/tests -p "test_*.py"` |
| 2026-09-24 | LMMY-007 | Arquitectura recomendada: crear un servicio HTTPS de solo lectura en `bikerz_app`, exponerlo al storefront mediante Shopify App Proxy y resolver allí compatibilidad aprobada y validación comercial contra Shopify. Un endpoint con CORS restringido queda solo como contingencia si el hosting o la app no admiten App Proxy. | Codex | Auditoría de infraestructura y arquitectura YMM |
| 2026-09-24 | LMMY-008 | La primera inspección pospuso la creación de `codex/ymm-query-api` al detectar la eliminación local previa de `dev/app.log`; el archivo se mantuvo intacto hasta recibir confirmación del propietario. | Codex | `git -C C:\JS\bikerz_app status --short --branch` |
| 2026-09-24 | LMMY-009 | Una consulta PostgreSQL de solo lectura permitió proponer las seis categorías iniciales: pastillas de freno, filtros de aceite, baterías, filtros de aire, cadenas y kits de transmisión. | Codex | Conteos documentados en 6.5; aprobación del propietario pendiente |
| 2026-09-24 | LMMY-010 | El propietario aprobó las seis categorías como alcance inicial. Agregar más categorías queda como pendiente posterior, sujeto a inventario, demanda y compatibilidad publicada. | Propietario | Confirmación en esta conversación |
| 2026-09-24 | LMMY-011 | Se preservó la eliminación aprobada de `dev/app.log` en el commit `d8d29a4` y se creó `codex/ymm-query-api`. La Fase 0 quedó completada. | Codex | Git de `C:\JS\bikerz_app` |
| 2026-09-24 | LMMY-012 | Se preparó el prototipo interactivo de escritorio y móvil para neumáticos y repuestos, con seis estados del buscador por medida y nueve estados MMY, fallback navegable, resumen de moto, mensajes de certeza y salida por WhatsApp. | Codex | `landing-wireframes.html`; aprobación visual pendiente |

