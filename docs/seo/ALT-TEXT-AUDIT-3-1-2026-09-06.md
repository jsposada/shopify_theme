# Auditoría de textos alternativos — paso 3.1

- Fecha: 2026-09-06.
- Alcance: home de Bikerz.
- Producción evaluada: `https://www.bikerz.cl/`.
- Copia corregida: `http://127.0.0.1:9292/`.
- Estado: aprobado, publicado y validado en producción el 2026-09-07.

## 1. Línea base pública

La home pública renderizó 100 elementos `<img>`. El inventario inicial de 28 problemas se descompone así:

1. 17 imágenes vacías o sin una descripción útil:
   - 1 logo del menú móvil sin atributo `alt`.
   - 1 banner principal con `alt=""`.
   - 9 logos de marcas con `alt=""`.
   - 5 imágenes de categorías con `alt=""`.
   - 1 fondo visual del bloque H1 con `alt=""`.
2. 11 imágenes de productos con descripciones técnicas o derivadas del archivo:
   - valores como `01` y `02`;
   - rutas internas con marca, nombre del producto y número de imagen.

El fondo del bloque H1 se clasificó como decorativo porque el título y el texto adyacentes ya comunican toda la información. No constituye una infracción y debe conservar `alt=""`.

## 2. Solución aplicada en la copia local

| Grupo | Solución |
| --- | --- |
| Logo móvil | Usa el texto del recurso y, si falta, el nombre de la tienda. |
| Marcas | Usa el texto editorial, el nombre del recurso o el nombre de marca extraído del filtro. Ejemplo: `Neumáticos MICHELIN`. |
| Categorías | Usa el título visible de la categoría. Ejemplo: `Cascos`. |
| Banner principal | Permite un texto editorial; si falta, usa título o botón y finalmente un fallback según el destino. Para `/collections/ofertas`: `Ofertas para motos en Bikerz`. |
| Tarjeta de producto | La imagen principal usa el título real del producto, sin depender del nombre del archivo. |
| Segunda imagen de hover | Usa `alt=""` porque duplica el mismo producto y solo produce el cambio visual al pasar el cursor. |
| Fondo del H1 | Conserva `alt=""` porque es decorativo y redundante con el contenido visible. |

Los campos editoriales añadidos al banner y a las marcas permiten reemplazar el fallback desde el editor de Shopify sin modificar código ni mostrar texto nuevo en pantalla.

## 3. Resultado local

- Imágenes renderizadas: 99 en la configuración local actual.
- Sin atributo `alt`: 0.
- Textos técnicos `01`, `02` o rutas internas: 0.
- Textos de más de 125 caracteres: 0.
- `alt=""`: únicamente fondos redundantes y segundas imágenes de hover.
- Lighthouse `image-alt`: 1, aprobado.
- Elementos infractores en Lighthouse: 0.
- Puntuación total de accesibilidad local: 85.

Evidencia automática: `outputs/lighthouse-3-1-alt-local-2026-09-06.json`.

## 4. Archivos del paquete 3.1

- `sections/brand.liquid`
- `sections/slide.liquid`
- `snippets/horizontal-menu.liquid`
- `snippets/list-collection-item.liquid`
- `snippets/product-item-horizontal.liquid`
- `snippets/product-item-layout-1.liquid`
- `snippets/product-item-layout-2.liquid`
- `snippets/responsive-image.liquid`

`templates/index.json` no forma parte del paquete. La versión publicada tiene contenido más reciente y no debe ser sobrescrita por la copia local.

## 5. Validación de producción

1. El propietario aprobó visualmente la home local.
2. Los ocho archivos se compararon contra el theme live inmediatamente antes del despliegue.
3. El paquete se reconstruyó desde producción para excluir un cambio local parcial del backlog T-01 sobre URLs de producto que no pertenecía a 3.1.
4. Se publicaron exclusivamente los ocho archivos documentados, con protección contra borrado y sin incluir `templates/index.json`.
5. La descarga posterior coincidió por SHA-256 con el paquete aprobado en los ocho archivos.
6. La home pública obtuvo:
   - 100 imágenes renderizadas;
   - 0 atributos `alt` ausentes;
   - 0 textos técnicos o rutas internas;
   - 0 textos mayores de 125 caracteres;
   - hero `Ofertas para motos en Bikerz`;
   - categoría `Ofertas` cubierta;
   - nueve marcas cubiertas;
   - logo móvil `Bikerz`.
7. Lighthouse público obtuvo `image-alt` 1, 0 elementos infractores y accesibilidad total 85.
8. La estructura conservó un H1, cinco categorías, nueve marcas, WhatsApp y ausencia de desbordamiento horizontal.

Evidencia pública: `outputs/lighthouse-3-1-alt-live-2026-09-07.json`.

## 6. Cierre

El paso 3.1 cumple su criterio técnico y visual. Los futuros banners, fotografías de taller, artículos o productos deberán recibir revisión editorial cuando los fallbacks no describan suficientemente el contenido, pero ese mantenimiento no bloquea el cierre actual.
