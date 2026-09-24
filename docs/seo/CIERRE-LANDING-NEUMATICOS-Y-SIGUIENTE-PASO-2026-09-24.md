# Cierre de la landing de neumáticos y siguiente paso

**Fecha:** 24 de septiembre de 2026  
**Proyecto:** Bikerz.cl  
**Plan maestro:** `docs/seo/PLAN-LANDINGS-NEUMATICOS-REPUESTOS-MMY.md`  
**Rama Shopify:** `codex/landings-neumaticos-repuestos`  
**Estado:** landing de neumáticos terminada y aprobada visualmente en escritorio; servicio MMY implementado, probado y preparado como servicio independiente para Easypanel; ninguno de los dos componentes está publicado.

## 1. Resumen ejecutivo

Se completó la nueva landing de neumáticos en `/collections/neumaticos`. La página conserva la colección, filtros, ordenamiento, paginación y grilla nativos de Shopify, y agrega un encabezado SEO, un buscador por medida, estados de resultado, una guía compacta para interpretar la medida y preguntas frecuentes.

Durante la revisión visual se redujeron tipografías, alturas y espacios para mostrar productos antes; se eliminaron bloques repetidos y se amplió el área útil de resultados. El theme live no fue modificado.

El siguiente bloque de trabajo es la **Fase 3: contrato y pruebas del motor Marca–Modelo–Año (MMY)** en `C:\JS\bikerz_app`. Este servicio debe estar validado antes de construir la landing de repuestos, para que el diseño se conecte desde el inicio a compatibilidades reales y no a datos simulados.

## 2. Estado de publicación y vista previa

| Elemento | Estado |
| --- | --- |
| Theme live | `SEO` — ID `164560142557`; no fue modificado |
| Theme de vista previa | `Codex landings 2026-09-24` — ID `166033588445` |
| Plantilla | `collection.neumaticos.json` |
| Colección | `/collections/neumaticos` |
| Publicación | Pendiente de autorización explícita del propietario |

Vista previa general:

<https://www.bikerz.cl/collections/neumaticos?preview_theme_id=166033588445&view=neumaticos>

Ejemplo con medida `140/70-17`:

<https://www.bikerz.cl/collections/neumaticos?preview_theme_id=166033588445&filter.p.m.custom.ancho=140.0&filter.p.m.custom.aspecto=70&filter.p.m.custom.di_metro=17&view=neumaticos>

## 3. Contenido y estructura finales

### 3.1 Encabezado

- H1: **Neumáticos para motos en Chile**.
- Introducción: **Encuentra la medida correcta, compara marcas y compra con despacho a todo Chile o instalación en nuestro taller de Santiago.**
- Tres tarjetas de respaldo con check:
  - Amplia variedad de medidas.
  - Las marcas líderes.
  - Instalación profesional.

### 3.2 Buscador

- Título: **Encuentra tu neumático**.
- Ayuda: **Ingresa la medida que aparece en el costado de tu neumático.**
- Flujo: Ancho → Perfil → Aro.
- Filtro adicional opcional por tipo de uso.
- Botón: **Ver neumáticos**.
- La colección continúa siendo navegable si el buscador no carga o JavaScript falla.

### 3.3 Estados

- Selección incompleta: solicita completar perfil y aro.
- Selección válida: muestra la medida y el total disponible en la misma barra de estado.
- Singular: `Medida seleccionada: 2.75-10. Mostrando 1 neumático disponible.`
- Plural: `Medida seleccionada: 140/70-17. Mostrando 20 neumáticos disponibles.`
- Sin resultados: permite cambiar la medida o continuar navegando por el catálogo.
- Error: informa el problema sin bloquear la colección ni sus filtros.

### 3.4 Contenido posterior

- Guía compacta **Cómo identificar la medida correcta**.
- Cuatro conceptos: ancho, perfil, construcción y aro, y carga y velocidad.
- Consejo del taller con dos verificaciones esenciales.
- Preguntas frecuentes visibles.
- Se eliminaron las cajas promocionales de marcas e instalación por ser repetitivas y aumentar innecesariamente el largo de la página.

## 4. Ajustes visuales realizados

| Área | Resultado final |
| --- | --- |
| Hero | Altura aproximada de 330 px en un viewport de 1280 px |
| H1 | Aproximadamente 43,52 px en escritorio |
| Título del buscador | Aproximadamente 20,48 px |
| Tarjetas superiores | Más compactas; se conservaron los checks y se reemplazaron los textos |
| Barra azul de estado | Altura aproximada de 44 px |
| Separación hacia los resultados | Reducida de aproximadamente 132 px a 20 px |
| Título redundante de resultados | Eliminado |
| Contador de la grilla | Eliminado; el total vive ahora en la barra azul |
| Guía de medida | Reducida de aproximadamente 797 px a 371 px, cerca de 53 % |
| Títulos de guía y FAQ | Reducidos de 36 px a 28 px |
| FAQ | Contenedor ampliado de 980 px a 1240 px; cajas cerca de 28 % más anchas |
| Barra lateral de filtros | Reducida exactamente 30 % en escritorio: de 333 px a 233 px |
| Área de productos | Aumentó de 704 px a 804 px en la medición de referencia |

La reducción de la barra lateral está limitada a la landing de neumáticos y a escritorio; no altera las demás colecciones.

## 5. Decisiones de experiencia y SEO

- Se mantiene un único H1.
- Las búsquedas usan parámetros sobre la colección existente.
- Las combinaciones filtradas no crean nuevas landings indexables.
- El canonical continúa apuntando a `/collections/neumaticos`.
- Se conservaron filtros, ordenamiento, paginación y actualización AJAX de la grilla.
- El contenido de ayuda aparece después del catálogo para priorizar la compra.
- La página conserva una salida útil ante selección incompleta, cero resultados o error.
- El buscador publica eventos sin datos personales mediante `Shopify.analytics.publish`:
  - `bikerz:tire_finder_search`.
  - `bikerz:tire_finder_incomplete`.

## 6. Implementación técnica

Archivos principales de la landing:

- `templates/collection.neumaticos.json`: composición y configuración de la página.
- `sections/seo-tire-hero.liquid`: encabezado y tarjetas superiores.
- `sections/tire-finder.liquid`: buscador, estados, conteo y analítica.
- `sections/main-collection-product-grid.liquid`: integración con la grilla y control del contador.
- `sections/seo-tire-guide.liquid`: guía compacta de lectura de medidas.
- `assets/seo-tire-landing.css`: estilos aislados de la landing.
- `sections/faq.liquid`: ajustes configurables de ancho y tipografía usados por la página.
- `sections/breadcrumbs.liquid` y `snippets/breadcrumbs.liquid`: soporte de navegación contextual.
- `sections/seo-collection-intro.liquid`: soporte del contenido SEO reutilizable.

La plantilla configura `show_product_count: false`, ya que el total se comunica en la barra de estado del buscador.

## 7. Validaciones realizadas

### 7.1 Medidas reales

| Medida | Productos comprobados |
| --- | ---: |
| `120/70-17` | 31 |
| `160/60-17` | 18 |
| `90/90-21` | 33 |
| `140/70-17` en la revisión visual final | 20 |

También se probó una combinación inexistente: devolvió cero productos sin error HTTP.

### 7.2 Validación visual y funcional

- Un solo H1.
- Sin desbordamiento horizontal a 390 px.
- Sin errores nuevos en consola durante las comprobaciones.
- La plantilla se conserva al navegar desde el buscador.
- Los filtros continúan formando las URL esperadas.
- El resultado singular y plural se muestra correctamente.
- La grilla y el área de filtros conservan su funcionamiento.

El propietario cerró la revisión visual de escritorio con la indicación **“Listo terminado esto”**. Antes de publicar se recomienda una última revisión manual móvil del estado final, porque varias reducciones de espaciado se aprobaron durante la revisión de escritorio posterior a la prueba técnica móvil.

## 8. Historial de commits de la landing

| Commit | Cambio |
| --- | --- |
| `ca5e1d2` | Construcción inicial de la landing de neumáticos |
| `ebab681` | Adaptación al mockup aprobado |
| `82951fd` | Reducción de escala tipográfica |
| `09d4cb7` | Compactación del hero |
| `e8b8eb4` | Ajuste de las tarjetas de respaldo |
| `3e5a964` | Eliminación del título redundante de resultados |
| `18b5fdd` | Traslado del conteo a la barra de estado |
| `8627965` | Reducción del espacio antes de resultados |
| `26a82a0` | Eliminación de tarjetas promocionales de la guía |
| `a12c914` | Compactación de la guía de medida |
| `ac9b4aa` | Ajuste de títulos de guía y preguntas frecuentes |
| `08db42e` | Reducción de 30 % del ancho de filtros |

## 9. Pendientes antes de publicar

La landing está terminada, pero no autorizada para producción. Para publicarla se debe:

1. Comparar nuevamente el theme live con el repositorio para evitar sobrescribir cambios recientes.
2. Confirmar o asignar `collection.neumaticos.json` a la colección `neumaticos`.
3. Realizar una última prueba rápida en escritorio y móvil.
4. Validar una medida con resultados, una sin resultados, filtros, ordenamiento y paginación.
5. Recibir autorización explícita del propietario para publicar.
6. Mantener el theme anterior disponible como reversión.

## 10. Siguiente paso: motor MMY para repuestos

### 10.1 Objetivo inmediato

Trabajar la **Fase 3** en `C:\JS\bikerz_app`, rama `codex/ymm-query-api`: exponer y probar un servicio HTTPS de solo lectura que consulte compatibilidades aprobadas de Marca–Modelo–Año y entregue productos comercializables de Shopify.

No conviene construir todavía la interfaz final de repuestos. Primero se debe probar que el motor responde correctamente y evita falsos positivos; después la landing se diseña con el contrato y los estados reales.

### 10.2 Contrato previsto

```text
GET /apps/ymm/makes
GET /apps/ymm/models?make_id={id}
GET /apps/ymm/years?model_id={id}
GET /apps/ymm/part-types?model_id={id}&year={opcional}
GET /apps/ymm/products?model_id={id}&year={opcional}&part_type={tipo}&cursor={cursor}
```

El servicio debe:

- Filtrar siempre por `review_status=approved`.
- Incluir únicamente productos activos y con identificadores Shopify conocidos.
- Distinguir explícitamente `exact_year` de `model_only`.
- Resolver reglas `all_years`, rangos, límites abiertos, `unspecified` y `exact_vehicle`.
- Unir correctamente los cinco metacampos anuales `custom.motos_compatibles` a `custom.motos_compatibles_5` cuando corresponda.
- Excluir SKU sin correspondencia comercial.
- Incorporar validación, paginación, caché, manejo de errores, registro técnico y pruebas automatizadas.
- Mantener secretos y acceso a PostgreSQL fuera del navegador y del theme.

### 10.3 Categorías iniciales aprobadas

La primera versión cubrirá:

1. Pastillas de freno.
2. Filtros de aceite.
3. Baterías.
4. Filtros de aire.
5. Cadenas.
6. Kits de transmisión.

**Agregar más categorías queda pendiente** y se evaluará posteriormente según inventario, demanda y calidad de las compatibilidades publicadas.

### 10.4 Criterio para pasar a la landing de repuestos

La Fase 3 termina cuando las pruebas demuestren que el servicio:

- No produce falsos positivos en los casos conocidos.
- Diferencia compatibilidad exacta y compatibilidad solo por modelo.
- No muestra productos ocultos, inactivos o sin correspondencia comercial.
- Responde de forma segura ante parámetros inválidos y casos sin resultados.
- No expone secretos ni detalles internos de PostgreSQL.

Después se inicia la **Fase 4**, que integrará el buscador MMY en `/collections/repuestos`, con selección de marca, modelo, año opcional, tipo de repuesto, resumen de la moto, resultados, estados de error y salida por WhatsApp.

## 11. Orden recomendado para retomar

1. Abrir `C:\JS\bikerz_app` en la rama `codex/ymm-query-api`.
2. Confirmar que las 11 pruebas YMM existentes siguen pasando.
3. Documentar las consultas PostgreSQL y fijar esquemas de respuesta.
4. Implementar los cinco endpoints de solo lectura.
5. Crear las pruebas obligatorias del contrato.
6. Probar resultados contra muestras comerciales conocidas.
7. Volver a Shopify únicamente cuando el contrato MMY esté estable.

## 12. Avance de la Fase 3 — Servicio MMY

La implementación local de la Fase 3 quedó terminada en `C:\JS\bikerz_app`, rama `codex/ymm-query-api`. Se creó un servicio FastAPI independiente de `main.py` y del proceso nocturno, con estos componentes:

- Cinco endpoints de lectura en `/apps/ymm/*` y un endpoint de salud.
- Consultas PostgreSQL parametrizadas dentro de transacciones `READ ONLY`.
- Validación HMAC-SHA256 de solicitudes del Shopify App Proxy.
- Validación de tienda y expiración de la solicitud.
- Límite de uso en memoria sin conservar direcciones IP en texto claro.
- Caché larga de navegación y caché corta de información comercial.
- Paginación con cursor y un máximo de 24 productos por página.
- Validación comercial en lote mediante Shopify Storefront API antes de devolver precio, imagen, URL y disponibilidad.
- Dependencias en un entorno virtual aislado mediante `requirements-ymm-api.txt`.
- Contrato técnico en `C:\JS\bikerz_app\ymm\docs\query_api_contract.md`.

### 12.1 Evidencia automatizada

- 39 pruebas YMM pasan.
- Las 11 pruebas históricas del importador y el ETL continúan pasando.
- Se probaron firma válida, manipulación de parámetros, expiración, tienda incorrecta y solicitud sin firma.
- Se probaron cursores, categorías permitidas, coincidencia `exact_year`, coincidencia `model_only`, año inexistente, producto retirado de Shopify y resultado vacío estable.
- Las pruebas verifican que la búsqueda con año contempla `all_years`, `range` y `exact_vehicle`, y excluye `unspecified`.
- La búsqueda sin año no utiliza ningún año centinela.

### 12.2 Evidencia con datos reales

- 134 marcas con cobertura comercial dentro de las seis categorías iniciales.
- Honda devuelve 664 modelos con al menos un producto elegible.
- Honda CB 500 devuelve 30 años con compatibilidad comercial.
- Un rango cerrado devolvió cuatro productos exactos.
- Un rango con límite abierto devolvió dos productos exactos.
- Una regla `all_years` devolvió tres productos exactos para el año probado.
- Una regla `unspecified` devolvió un producto al buscar solo por modelo.
- Un tipo de repuesto válido sin coincidencias devolvió cero productos sin error.
- Se detectaron 40 productos activos de PostgreSQL sin IDs Shopify completos; el servicio los excluye.
- La consulta comercial real mediante Storefront API devolvió una coincidencia exacta y cinco coincidencias por modelo, todas con el nivel correcto; la exacta incluyó URL pública, precio CLP y disponibilidad vigente.

La arquitectura comercial quedó ajustada después de la revisión del propietario: `bikerz_app` resuelve únicamente la compatibilidad y Shopify Storefront API entrega los datos visibles del producto. Admin API ya no participa en las búsquedas de clientes. El servicio usa el token privado Storefront existente y reenvía la IP validada del comprador; conserva como respaldo el token público y el acceso tokenless soportado por la tienda.

La prueba de extremo a extremo del endpoint local respondió HTTP 200 para Honda CB 500 2026 / filtro de aceite, con una coincidencia `exact_year`, precio CLP y URL pública. El servicio permaneció local y no se configuró todavía ningún App Proxy público.

La base actual contiene 1.406 reglas `all_years`, 17.987 reglas `range` —1.593 con algún límite abierto— y 77 reglas `unspecified`. No contiene reglas `exact_vehicle`; el camino está implementado y probado estructuralmente, pero su primera validación productiva queda pendiente hasta que exista una regla aprobada de ese tipo.

### 12.3 Estado y siguiente paso

El código y las pruebas de la Fase 3 están listos. Todavía no existe un servicio público ni se configuró el App Proxy. Para exponerlo se requiere:

1. Elegir el hosting del proceso Uvicorn con HTTPS.
2. Guardar `SHOPIFY_APP_SECRET` en el gestor de secretos del hosting.
3. Configurar el App Proxy de Shopify para `/apps/ymm/*`.
4. Ejecutar una prueba firmada desde el storefront.
5. Confirmar monitoreo y reinicio automático del proceso.

Después de esa prueba integrada se puede iniciar la Fase 4: construir la landing de repuestos sobre este contrato real.

## 13. Arquitectura de despliegue acordada

Se revisó `C:\JS\inventarioNeumaticosV2`, que en Easypanel ya utiliza dos
procesos separados sobre la misma base PostgreSQL:

- `app.bikerz.cl`: aplicación Flask interna.
- `bikerz-worker`: worker combinado de pedidos y sincronizaciones.

El buscador público no se añadirá a ninguno de esos procesos. Se preparó un
tercer servicio, `bikerz-ymm-api`, desde el repositorio `bikerz_app`. Será un
contenedor FastAPI independiente, conectado al mismo PostgreSQL y a Shopify
Storefront API.

```text
bikerz.cl -> Shopify App Proxy -> bikerz-ymm-api
                                      |       |
                                      v       v
                                 PostgreSQL  Storefront API

app.bikerz.cl --------------------> PostgreSQL
bikerz-worker --------------------> PostgreSQL
```

Esta separación evita que el tráfico de clientes, los despliegues o los
reinicios del buscador afecten la aplicación interna o los procesos nocturnos.

La preparación local quedó en `C:\JS\bikerz_app` e incluye:

- `Dockerfile.ymm-api`: imagen pequeña con solo las dependencias del API.
- `.dockerignore`: excluye archivos locales, credenciales y artefactos.
- `ymm/docs/easypanel_service.md`: variables, despliegue, comprobaciones y reversión.
- Configuración por variables `DB_*` y `SHOPIFY_*`; no es necesario copiar el
  archivo compartido `dev/files/credentials.yml` al contenedor.
- Ejecución como usuario sin privilegios, puerto interno `8000`, soporte de
  cabeceras del proxy y comprobación `GET /healthz`.

La suite completa del módulo YMM pasa con **39 pruebas**. Docker no está
instalado en el equipo local, por lo que la construcción real de la imagen se
validará en el primer despliegue de Easypanel.

### Pendientes operativos

1. Revisar y fusionar o desplegar la rama `codex/ymm-query-api`.
2. Crear `bikerz-ymm-api` en el mismo proyecto de Easypanel.
3. Cargar las variables mínimas de PostgreSQL, Storefront y App Proxy.
4. Asignar un dominio HTTPS técnico al servicio y comprobar `/healthz`.
5. Configurar el App Proxy de Shopify para `/apps/ymm`.
6. Probar una búsqueda firmada desde `bikerz.cl`.

No se ha creado ni modificado ningún servicio remoto de Easypanel y el App
Proxy continúa sin configurar.

Este documento funciona como registro de cierre de la landing de neumáticos y punto de continuidad del buscador de repuestos sin depender del historial de la conversación.
