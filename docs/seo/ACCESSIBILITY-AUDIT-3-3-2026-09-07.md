# Auditoría de accesibilidad 3.3 — enlaces sin nombre

Fecha de implementación local: 2026-09-07

Fecha de publicación: 2026-09-12

Sitios revisados: home local `http://127.0.0.1:9292/` y pública `https://www.bikerz.cl/`
Estado: publicado y validado.

## 1. Objetivo

Eliminar los enlaces sin nombre accesible de la home, corregir controles que solo exponían un icono, ordenar el enlace superpuesto al hero y permitir el uso de los carruseles con teclado sin cambiar la presentación visual ni los destinos comerciales.

## 2. Línea base reproducida

El roadmap conservaba el hallazgo histórico de 36 enlaces vacíos. Como la home cambió desde esa medición, se repitió el inventario antes de editar:

- 183 enlaces presentes en el DOM durante la medición inicial.
- 18 enlaces sin nombre accesible.
- 10 de esos enlaces eran visibles y enfocables en escritorio.
- Los 10 casos visibles correspondían a cuatro redes sociales superiores, cuenta, hero y cuatro redes sociales del footer.
- Los ocho restantes pertenecían a componentes responsive o condicionales: segunda instancia de redes sociales, barra móvil y cierre de una notificación.
- Cinco enlaces de imagen de categorías tenían el nombre genérico `links`, que técnicamente no estaba vacío pero no describía su destino.
- Los controles de marcas y productos se dibujaban como `div`; algunos no tenían nombre ni operación nativa por teclado.

Los enlaces repetidos de redes sociales y barra móvil no son duplicados decorativos: son las instancias funcionales de otros anchos de pantalla. Se conservaron y se nombraron. El cierre de notificación, en cambio, no es una navegación y se convirtió correctamente en botón.

## 3. Cambios locales

### Iconos y enlaces funcionales

- Redes sociales: nombres explícitos `Bikerz en Instagram`, `Bikerz en Facebook`, `Bikerz en YouTube`, `Bikerz en TikTok` y equivalentes para las redes opcionales.
- Cuenta: nombre dinámico `Iniciar sesión` o `Mi cuenta`.
- Barra móvil: `Inicio` y `Ver todos los productos`.
- Cierre de búsqueda: botón `Cerrar búsqueda`.
- Cierre de notificación: se reemplazó el enlace `#` por un botón `Cerrar mensaje`.

### Categorías

El texto genérico `links` se sustituyó por nombres derivados de cada categoría:

- `Ver colección Neumáticos`.
- `Ver colección Repuestos`.
- `Ver colección Cascos`.
- `Ver colección Lubricantes`.
- `Ver colección Ofertas`.

### Hero

- El enlace absoluto dejó de ser un elemento vacío situado directamente bajo el contenedor de todas las diapositivas.
- Ahora vive dentro de su diapositiva y solo se genera cuando existe `image_link`.
- Conserva el destino `/collections/ofertas` y el área clicable del hero.
- Su nombre actual es `Ver ofertas para motos en Bikerz`.
- El script deja en la tabulación solo el enlace de la diapositiva activa; los enlaces de diapositivas inactivas reciben `tabindex=-1`.
- El único punto de paginación, oculto porque solo existe una diapositiva, quedó con `aria-hidden=true` y `tabindex=-1`.

### Carruseles

- Las flechas compartidas y las específicas de productos y blog ahora son botones nativos.
- Los nombres se expresan en español: `Siguiente elemento`, `Elemento anterior`, `Productos anteriores`, `Productos siguientes`, `Artículos anteriores` y `Artículos siguientes`.
- Las flechas de marcas continúan ocultas visualmente en reposo, pero aparecen también con `:focus-within` cuando un usuario entra al carrusel con teclado.
- La navegación de cada slider se vinculó a su instancia local para evitar que una flecha controle accidentalmente otro bloque.

## 4. Validación local

Resultado final del DOM renderizado:

| Control | Resultado |
| --- | ---: |
| Enlaces totales en la medición final | 174 |
| Enlaces sin nombre accesible | 0 |
| Enlaces visibles y enfocables sin nombre | 0 |
| H1 en la home | 1 |
| Desbordamiento horizontal | 0 px |

Pruebas funcionales:

- Productos: la tecla `Enter` sobre `Productos siguientes` cambió la posición del carrusel y `Productos anteriores` permitió regresar.
- Marcas: al enfocar `Neumáticos XCELINK`, las flechas pasaron de ocultas a visibles; `Enter` sobre `Siguiente elemento` movió el carrusel de `0 px` a `-183,4 px`.
- Blog: `Enter` sobre `Artículos siguientes` movió el carrusel de `0 px` a `-429,5 px`.
- Hero: el enlace sigue apuntando a `/collections/ofertas`, conserva el tamaño del banner y es hijo de la diapositiva activa.
- Presentación: revisión visual local a 904 px de ancho sin desplazamientos de layout ni cambios perceptibles en los controles de 44 × 44 px.

Comprobaciones de código:

- Sintaxis JavaScript válida en `slide.js`, `product-slider.js` y `blog-post.js`.
- `git diff --check` sin errores en los archivos del paso 3.3.
- El verificador global de Shopify no ofrece una línea base limpia: informa 1.268 incidencias acumuladas en 130 archivos, principalmente configuración y traducciones ajenas a este paso. Por eso el cierre se apoya también en el render real, el inventario del DOM y las pruebas de teclado dirigidas.

## 5. Archivos pertenecientes al paso 3.3

- `assets/blog-post.js`
- `assets/product-slider.js`
- `assets/slide.js`
- `sections/blog-posts.liquid`
- `sections/brand.liquid`
- `sections/mobile-stickybar.liquid`
- `sections/product-slider.liquid`
- `sections/slide.liquid`
- `snippets/form-infor.liquid`
- `snippets/header-search.liquid`
- `snippets/list-collection-item.liquid`
- `snippets/my-account.liquid`
- `snippets/social-icons.liquid`
- `snippets/swiper-control.liquid`

## 6. Despliegue

- El propietario aprobó la presentación y el funcionamiento local.
- Inmediatamente antes del push se descargaron los 14 archivos vigentes del theme live.
- Los 14 archivos remotos coincidían con la copia completa de producción del 2026-09-07: no existían cambios online nuevos que fusionar.
- Las diferencias entre el paquete y producción correspondían exclusivamente a las correcciones documentadas en 3.3.
- Se publicó únicamente el paquete de 14 archivos en `SEO` (`164560142557`) con `--nodelete` y `--allow-live`.
- Shopify confirmó el push exitoso y que `SEO` mantiene el rol `live`.
- La descarga posterior coincidió con el paquete en los 14 hashes SHA-256; no hubo discrepancias.

## 7. Validación pública

| Control | Resultado público |
| --- | ---: |
| Archivos remotos iguales al paquete | 14 de 14 |
| Enlaces expuestos sin nombre accesible | 0 |
| Enlaces visibles y enfocables sin nombre | 0 |
| H1 en la home | 1 |
| Desbordamiento horizontal | 0 px |
| Errores de consola observados | 0 |
| WhatsApp flotante | 1 |

- Las 12 instancias responsive de redes sociales exponen sus nombres correctos.
- Las cinco imágenes de categorías anuncian `Ver colección` seguido del nombre correspondiente.
- El hero anuncia `Ver ofertas para motos en Bikerz`, apunta a `/collections/ofertas`, es hijo de la diapositiva activa y conserva una geometría de 1265 × 350 px.
- El único punto de paginación del hero continúa oculto con `aria-hidden=true` y `tabindex=-1`.
- `Enter` sobre `Productos siguientes` desplazó el carrusel público.
- Al enfocar `Neumáticos XCELINK`, las flechas de marcas aparecieron; `Enter` sobre `Siguiente elemento` desplazó el carrusel.
- Los controles conservan 44 × 44 px. En escritorio, las flechas del blog quedan deshabilitadas y fuera de la tabulación porque sus tres artículos caben simultáneamente; en el ancho local menor ya se comprobó su funcionamiento.
- Con un producto en el carrito existe un enlace vacío bruto usado como capa visual de la miniatura. Está correctamente marcado con `aria-hidden=true` y `tabindex=-1`: no aparece en el árbol accesible, no recibe Tab y no constituye una infracción de nombre accesible.
- El buscador de neumáticos siguió cargando 20 anchos, 10 perfiles y 12 aros, sin regresión del paso 3.2.
