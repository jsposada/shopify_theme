# Comparación del theme live contra el theme SEO

Fecha de auditoría: 2026-08-31.

## Alcance

- Theme live: `new look`, ID `164296949981`.
- Theme de revisión: `SEO`, ID `164560142557`.
- Método: descarga completa de ambos themes mediante Shopify CLI y comparación local por ruta y hash SHA-256.
- La auditoría fue de solo lectura: no se modificó ningún theme remoto.

## Resumen

| Control | Resultado |
| --- | ---: |
| Archivos en live | 360 |
| Archivos en SEO | 360 |
| Archivos solo en live | 0 |
| Archivos solo en SEO | 0 |
| Archivos idénticos | 350 |
| Archivos con contenido distinto | 10 |

No faltan archivos completos en ninguno de los themes. Las diferencias están concentradas en configuración y plantillas.

## Diferencias esperadas de la fase 1

Estos archivos difieren porque contienen los cambios SEO aprobados y desplegados únicamente al theme `SEO`:

1. `sections/banner-with-text.liquid`
2. `sections/footer-2.liquid`
3. `sections/footer.liquid`
4. `sections/slide.liquid`
5. `snippets/logo.liquid`
6. `templates/index.json`
7. `config/settings_data.json`, parcialmente por la corrección del copyright.

## Configuración presente en live y ausente en SEO

### 1. App embeds de reseñas

En `config/settings_data.json`, el theme live tiene siete app embeds activos y el theme SEO conserva tres.

Los tres embeds comunes son:

- Dondy WhatsApp.
- Microsoft Clarity.
- Shopify Forms.

El theme live tiene además cuatro embeds que no aparecen en la copia remota de SEO:

- Editorify: estrellas en colecciones.
- Editorify: carga global de la aplicación.
- Editorify: estrellas en producto.
- Opinew: código global.

La copia local combina el copyright corregido con estos siete embeds, pero Shopify no conservó los cuatro embeds de reseñas al hacer el push al theme SEO. Antes de publicar será necesario revisar los **App embeds** del theme SEO desde el editor de Shopify.

### 2. Página general de reseñas de Opinew

Archivo: `templates/page.opinew_all_reviews.json`.

- Live: contiene el bloque `opinew-reviews-all-reviews-code`.
- SEO: la sección de aplicaciones existe, pero no contiene el bloque de Opinew.
- La copia local coincide con live.

### 3. Plantilla de producto predeterminada

Archivo: `templates/product.json`.

Live contiene dos integraciones que no están en SEO:

- Bloque de estrellas `opinew-stars-plugin-product`, situado después del título.
- Widget de reseñas `opinew-reviews-widget`, situado al final de la plantilla.

La copia local coincide con live.

### 4. Metadatos visibles en productos de neumáticos

Archivo: `templates/product.neumaticos.json`.

- Live: el bloque `product_meta` está activo y muestra SKU, disponibilidad y categoría.
- SEO: el mismo bloque está desactivado y ubicado más abajo en el orden de bloques.
- La copia local coincide con SEO.

Esta diferencia no pertenece a la fase 1 y fue revisada separadamente después de la publicación.

Decisión del propietario del 2026-08-31: mantener `product_meta` desactivado en la plantilla de neumáticos. La ausencia de `Categoría` se considera intencional y no requiere restauración.

## Verificación posterior a la publicación

El propietario publicó el theme `SEO` como live el 2026-08-31. Shopify confirmó el cambio de roles:

- `SEO` (`164560142557`): live.
- `new look` (`164296949981`): no publicado y disponible como respaldo.

Controles realizados en producción:

- La home muestra el título aprobado, un solo H1, la introducción nueva y el copyright dinámico.
- No hay desbordamiento horizontal en la home.
- La ficha comprobada de neumático no carga elementos ni recursos de Opinew o Editorify.
- La misma ficha en el antiguo theme tampoco mostraba widgets de reseñas.
- En una ficha que usa la plantilla de producto predeterminada, el antiguo theme generaba el comentario `Failed to render app block` porque la ruta del bloque de Opinew ya no existe; no había un widget visible o funcional que se perdiera con la publicación.
- El bloque `product_meta` sí produce una diferencia visible: el antiguo theme mostraba `Categoría`, mientras que el live nuevo no la muestra. En el producto revisado no apareció un valor de SKU en ninguno de los dos themes.

Conclusión posterior a la publicación:

- No se confirmó una regresión nueva de reseñas: la integración anterior ya estaba rota o inactiva en las páginas comprobadas.
- La ausencia de Opinew y Editorify sigue siendo una deuda de configuración que debe resolverse en 2.2.
- La diferencia visible confirmada es el bloque de metadatos de la plantilla `product.neumaticos`; el propietario decidió mantenerlo oculto.

## Recomendación

1. Mantener `new look` como respaldo no publicado hasta completar la verificación posterior al despliegue.
2. Mantener `product_meta` desactivado en `product.neumaticos`, según la decisión del propietario.
3. En la fase 2.2, confirmar cuál proveedor se conservará: Opinew o Editorify.
4. Si Opinew es el proveedor principal, reinstalar o regenerar bloques válidos; copiar las referencias antiguas no es suficiente porque Shopify informa que su ruta ya no existe.
5. Desactivar Editorify únicamente después de confirmar que no contiene reseñas o funciones que deban conservarse.
6. Repetir la comparación antes de futuros cambios de theme, porque la auditoría refleja el estado remoto del 2026-08-31 y no determina por sí sola la cronología de cada cambio.
