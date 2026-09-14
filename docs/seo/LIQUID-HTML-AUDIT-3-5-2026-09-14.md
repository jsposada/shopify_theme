# Auditoría Liquid y HTML — paso 3.5

- Fecha: 2026-09-14.
- Alcance: copia local y theme público de Shopify.
- Estado: cerrado; implementado, aprobado, publicado y validado en producción.
- Theme de desarrollo: `165034229981`.
- Theme público: `SEO`, ID `164560142557`.

## 1. Objetivo

Corregir errores Liquid y HTML con impacto real en renderizado, accesibilidad, semántica SEO o comportamiento. No se aplicaron correcciones mecánicas a toda la deuda heredada del theme.

## 2. Línea base

La primera ejecución global de Theme Check produjo:

| Indicador | Línea base |
| --- | ---: |
| Archivos con hallazgos | 131 |
| Hallazgos totales | 1.288 |
| Errores | 938 |
| Advertencias | 350 |
| Errores `MatchingTranslations` | 897 |
| Errores distintos de traducciones | 41 |

Los 897 errores `MatchingTranslations` corresponden a diferencias entre archivos de idiomas heredados. Se separaron de los problemas de ejecución para evitar una modificación masiva sin beneficio para la tienda en español.

La revisión del DOM cubrió home, contacto, búsqueda, producto, blog y artículo. Se evaluaron H1, IDs, referencias `for` y ARIA, imágenes, elementos interactivos anidados, desbordamiento y consola.

## 3. Correcciones realizadas

### 3.1 Renderizado Liquid

- `snippets/horizontal-menu.liquid`: se sustituyeron variables de logo inexistentes y se dejó un `<picture>` responsive con dimensiones, carga diferida y fuente válida.
- `sections/banner-with-text.liquid`, `sections/banner-image.liquid` y `sections/banner-masonry.liquid`: se corrigió la sintaxis inválida en llamadas `render`.
- `sections/main-search.liquid`: se retiró una coma sobrante en los argumentos de `render`.
- `sections/main-product.liquid`: se corrigió una rama `when` mal formada y llamadas a iconos inexistentes.
- `snippets/product-item-compare.liquid` y `snippets/product-item-upsell-bundle.liquid`: se corrigieron nueve llamadas `render` incompatibles.
- `snippets/breadcrumbs.liquid`: se sustituyó una condición inválida dentro de `when` por una condición Liquid válida.
- `config/settings_schema.json`: se añadió la etiqueta obligatoria al selector de disposición general.

### 3.2 HTML, accesibilidad y semántica

- `snippets/product-form.liquid`: se retiró un cierre `label` huérfano y se reorganizaron los cierres del formulario para producir HTML válido sin alterar la compra dinámica.
- `snippets/gift-card-recipient-form.liquid`: el campo de mensaje pasó de un `input` cerrado incorrectamente a `textarea`; se corrigió la etiqueta de carga y se retiraron declaraciones XML/DOCTYPE embebidas del SVG.
- `sections/contact.liquid`: se añadió un H1 visualmente oculto con el título de la página. El diseño visible no cambia.
- `sections/main-product.liquid`: los títulos de modales informativos pasaron de H1 a H2 para proteger el H1 único del producto.
- `sections/main-article.liquid`: se conserva el título del artículo como único H1 y los H1 introducidos dentro del contenido editorial se normalizan a H2; también se eliminó el ID duplicado de artículos populares y se nombraron los tres controles sociales.
- `snippets/icon-with-text.liquid`: las imágenes decorativas ahora exponen `alt=""`, `role="presentation"` y dimensiones numéricas reales.
- `sections/main-article.liquid`: la imagen de artículo popular usa `image_url`, carga diferida y dimensiones explícitas.
- `snippets/product-thumbnail.liquid` y `templates/gift_card.liquid`: se sustituyeron referencias a snippets de iconos inexistentes por el renderizador de iconos del theme.
- `sections/main-blog.liquid`: se retiró la carga de un asset inexistente.

## 4. Resultado de Theme Check

Después de las correcciones:

| Indicador | Antes | Después | Variación |
| --- | ---: | ---: | ---: |
| Archivos con hallazgos | 131 | 130 | -1 |
| Hallazgos totales | 1.288 | 1.254 | -34 |
| Errores | 938 | 903 | -35 |
| Advertencias | 350 | 351 | +1 |
| Errores `MatchingTranslations` | 897 | 897 | 0 |
| Errores distintos de traducciones | 41 | 6 | -35 |

Los seis errores no relacionados con `MatchingTranslations` que permanecen son:

1. Cuatro claves ausentes únicamente en `locales/en.default.json`, repartidas entre `sections/back_top.liquid`, `sections/main-login.liquid` y `sections/main-register.liquid`. No afectan la versión activa en español; deberán completarse antes de activar inglés.
2. `snippets/cart-drawer.liquid` puede intentar renderizar `card-collection`, snippet que no existe, solo si se configura una colección promocional. La opción `cart_drawer_collection` está vacía en ambas configuraciones guardadas, por lo que esa rama no se ejecuta actualmente.
3. `snippets/test.liquid` contiene una imagen sin dimensiones, pero el snippet está huérfano y no se utiliza en el theme.

Las advertencias restantes son principalmente convenciones de nombre, snippets huérfanos, asignaciones sin uso y rutas heredadas. No se tocaron porque una corrección masiva puede introducir regresiones sin aportar valor SEO inmediato.

## 5. Validación del navegador local

| Plantilla | H1 | IDs duplicados | Referencias rotas | Imágenes sin `alt` | Imágenes sin dimensiones | Interactivos anidados | Desbordamiento |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| Contacto | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| Búsqueda | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| Producto Michelin | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| Blog | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| Artículo CEAT Zoom XL | 1 | 0 | 0 | 0 | 0 | 0 | 0 |

- No se observaron imágenes rotas ni errores o advertencias de consola en las comprobaciones finales.
- El producto conserva sus formularios principal, fijo y de cuotas de Shopify.
- El artículo conserva su apariencia; la jerarquía comienza con el título H1 y continúa con H2/H3.
- Los estilos incluidos dentro del cuerpo provienen de secciones dinámicas de Shopify. Se aplaza moverlos porque hacerlo sin reestructurar cada sección puede interferir con el editor y la carga dinámica.

## 6. Revisión requerida del propietario

El propietario revisó y aprobó visualmente:

1. Home: `http://127.0.0.1:9292/`.
2. Contacto: `http://127.0.0.1:9292/pages/contacto`.
3. Producto: `http://127.0.0.1:9292/products/michelin-pilot-street-2-50-17-43p`.
4. Artículo: `http://127.0.0.1:9292/blogs/motos-chile/analisis-de-rendimiento-urbano-y-compatibilidad-tecnica-del-neumatico-ceat-zoom-xl-en-chile-1`.

Hallazgo editorial pendiente fuera del repositorio: el artículo revisado todavía muestra el texto `WhatsApp +56 9 5770 9915`, aunque su enlace apunta al número oficial. Ese texto vive en el contenido del artículo en Shopify y debe reemplazarse por `+56 9 7767 0252` desde el editor de contenido.

## 7. Publicación y validación

La publicación se realizó de forma aislada sobre el theme live `SEO`, ID `164560142557`:

1. Se hicieron dos descargas consecutivas de los 18 archivos públicos antes del push; ambas coincidieron 18 de 18 y no mostraron cambios online nuevos.
2. Se detectó que `snippets/product-item-compare.liquid` y `snippets/product-item-upsell-bundle.liquid` también contenían localmente el cambio pendiente T-01. El paquete se reconstruyó para conservar `within: collection`, igual que en producción, y excluir T-01 sin modificar el repositorio local.
3. El paquete exacto tuvo 18 archivos, con 77 inserciones y 64 eliminaciones frente a producción.
4. Se publicó con protección contra borrados mediante `--nodelete` y autorización explícita para el theme live.
5. La descarga posterior confirmó que los hashes SHA-256 de los 18 archivos remotos coinciden exactamente con el paquete aprobado.
6. El theme `SEO` conservó su condición de theme público.

La validación posterior en `https://www.bikerz.cl/` confirmó:

- Home, contacto, búsqueda, producto, blog y artículo tienen un único H1.
- Las seis páginas tienen cero IDs duplicados, referencias rotas, imágenes sin `alt`, imágenes sin dimensiones, interactivos anidados, imágenes rotas y desbordamiento horizontal.
- Contacto conserva sus dos formularios y la ficha conserva los formularios de compra.
- El artículo expone los nombres `Compartir en Facebook`, `Compartir en X` y `Compartir en Pinterest` y mantiene una jerarquía H1/H2/H3 válida.
- No se observaron errores ni advertencias de consola en la comprobación final.

## 8. Archivos del paquete 3.5

- `config/settings_schema.json`
- `sections/banner-image.liquid`
- `sections/banner-masonry.liquid`
- `sections/banner-with-text.liquid`
- `sections/contact.liquid`
- `sections/main-article.liquid`
- `sections/main-blog.liquid`
- `sections/main-product.liquid`
- `sections/main-search.liquid`
- `snippets/breadcrumbs.liquid`
- `snippets/gift-card-recipient-form.liquid`
- `snippets/horizontal-menu.liquid`
- `snippets/icon-with-text.liquid`
- `snippets/product-form.liquid`
- `snippets/product-item-compare.liquid`
- `snippets/product-item-upsell-bundle.liquid`
- `snippets/product-thumbnail.liquid`
- `templates/gift_card.liquid`
