# Plan de métricas para buscadores de neumáticos y repuestos

- **Fecha:** 2026-09-27
- **Estado:** Pendiente para una fase posterior
- **Objetivo:** identificar qué medidas de neumáticos, motos y tipos de repuesto buscan los visitantes, incluyendo búsquedas sin resultados y su avance hacia producto, carrito y compra.

## 1. Resultado esperado

Disponer de un informe que permita responder, por período:

- Cuáles son las medidas de neumáticos más buscadas.
- Cuáles son las marcas, modelos y años de moto más buscados.
- Cuáles son los tipos de repuesto más buscados.
- Qué combinaciones no tienen resultados publicados.
- Cuántas búsquedas terminan en visita a producto, carrito y compra.

La primera versión debe priorizar búsquedas totales, visitantes únicos y búsquedas sin resultados. La relación con carrito y compra puede incorporarse como segunda etapa.

## 2. Arquitectura propuesta

```text
Buscadores de las landings
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

Se debe contar una búsqueda cuando el visitante presiona el botón de buscar, no cada vez que cambia un selector.

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

## 7. Fases de implementación

### Fase 1: capturar búsquedas

1. Enriquecer los eventos de repuestos con valores reales.
2. Normalizar la medida completa de neumáticos.
3. Generar un `search_id` por búsqueda.
4. Suscribir el Web Pixel a los eventos personalizados necesarios.
5. Enviar eventos sanitizados al receptor de Easypanel.
6. Guardarlos de forma idempotente en PostgreSQL.

### Fase 2: resultados y ausencia de inventario

1. Registrar `result_count` y `has_results`.
2. Crear rankings de búsquedas sin resultados.
3. Validar que las cantidades coincidan con lo mostrado en las landings.

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

## 11. Primera entrega recomendada

La primera entrega debería incluir únicamente:

1. Captura de búsquedas completas en ambos buscadores.
2. Cantidad de resultados y detección de cero resultados.
3. Ranking por 7, 30 y 90 días.
4. Prueba controlada en el theme de vista previa antes de activar la medición en producción.

La atribución a carrito y compra debe implementarse después de validar que los rankings de búsqueda sean correctos.
