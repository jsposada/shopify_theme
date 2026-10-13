# Auditoría de datos estructurados — paso 4.2

- Fecha: 2026-09-14.
- Estado: `[x]` implementación, publicación aislada y validación pública terminadas.
- Theme público actual: `SEO` (`164560142557`).
- Theme de desarrollo: `165034229981`.
- Fuente de datos: `docs/seo/LOCAL-BUSINESS-PROFILE-4-1.md`.

## 1. Problemas de la implementación anterior

- El marcado `Organization` se repetía en todas las páginas desde cada variante del encabezado.
- La URL de la organización dependía de la página visitada, por lo que no representaba una entidad estable.
- `sameAs` incluía cadenas vacías para redes no configuradas.
- No se declaraban dirección, coordenadas, horario, área servida ni contacto estructurado.
- La identidad dependía únicamente de `shop.name` y no distinguía `Bikerz.cl`, `Bikerz` y la razón social.
- `WebSite` no estaba conectado a la organización mediante identificadores estables.

## 2. Implementación nueva

El snippet `snippets/structured-data-business.liquid` se carga una sola vez desde `layout/theme.liquid` y solo genera el grafo en la home.

### Nodo principal

- Tipo específico: `TireShop`.
- `@id`: `https://www.bikerz.cl#organization`.
- Nombre: `Bikerz.cl`.
- Nombre alternativo: `Bikerz`.
- Razón social y RUT.
- URL canónica y logotipo oficial.
- Único teléfono público: `+56977670252`.
- Correo: `hola@bikerz.cl`.
- `PostalAddress` con `Local 3` y código postal `7810107`.
- `GeoCoordinates` con latitud y longitud verificadas.
- Enlace directo a Google Maps.
- Cobertura: Chile.
- Moneda y métodos de pago confirmados.
- `ContactPoint` de servicio al cliente.
- Dos franjas de lunes a viernes y una franja de sábado.
- Cuatro perfiles sociales, sin valores vacíos.

### Nodo del sitio

- Tipo: `WebSite`.
- `@id`: `https://www.bikerz.cl#website`.
- Nombre principal y alternativo.
- Idioma `es-CL`.
- `publisher` enlazado al `TireShop` mediante `@id`.
- Acción de búsqueda conectada al buscador real de Shopify.

## 3. Decisiones preventivas

- No se publica el número legado terminado en `9915`.
- No se declara un teléfono secundario.
- No se usa `aggregateRating` con reseñas de Google.
- No se declara fotografía hasta disponer de una imagen real aprobada.
- No se inventan horarios especiales de feriados; se gestionarán cuando exista una excepción concreta.
- No se representa el taller como una segunda empresa independiente; `TireShop` es el subtipo principal coherente con la categoría pública actual.

## 4. Archivos modificados

- `layout/theme.liquid`.
- `sections/header.liquid`.
- `sections/header-layout-2.liquid`.
- `snippets/structured-data-business.liquid`.

## 5. Validación local

- `[x]` Home local: HTTP 200.
- `[x]` Un solo bloque JSON-LD en la home.
- `[x]` JSON válido mediante análisis del HTML renderizado.
- `[x]` Tipos obtenidos: `TireShop` y `WebSite`.
- `[x]` Cuatro redes sociales y ningún valor vacío.
- `[x]` Tres especificaciones de horario.
- `[x]` Teléfono `+56977670252`.
- `[x]` Código postal `7810107`.
- `[x]` Ninguna aparición del teléfono legado en el HTML de la home.
- `[x]` Ficha representativa: su JSON-LD `Product` continúa válido.
- `[x]` Artículo representativo: su JSON-LD `Article` continúa válido.
- `[x]` Contacto no duplica el grafo de la home.
- `[x]` `git diff --check` sin errores.
- `[x]` Theme Check no añadió errores; conserva 903 errores heredados ya clasificados.
- `[~]` Theme Check reporta un aviso `OrphanedSnippet` falso positivo sobre el nuevo snippet, aunque `layout/theme.liquid` lo referencia de forma directa.

## 6. Publicación aislada

- `[x]` El propietario aprobó la vista previa local.
- `[x]` Se descargaron desde el theme público únicamente los cuatro archivos del alcance antes de publicar.
- `[x]` Los tres archivos que ya existían en producción coincidían con la base de Git; el snippet nuevo aún no existía. No había cambios productivos que fusionar.
- `[x]` Se publicó un paquete aislado de cuatro archivos en el theme `SEO` (`164560142557`) con protección contra borrados.
- `[x]` Una descarga posterior confirmó que los cuatro archivos públicos coinciden con la copia local.

Hashes SHA-256 normalizados verificados después del despliegue:

| Archivo | SHA-256 |
| --- | --- |
| `layout/theme.liquid` | `9AFFFDFE6DFD2BFFE1E8EB629BF873A9EB32159FB9A8881BCF0E10F807D3B2F5` |
| `sections/header.liquid` | `F053A1D6949015E767CDCAE24F8E8E5906B56A6A8585D18A28D01B09EAB08E73` |
| `sections/header-layout-2.liquid` | `66C9F2CF2087F0BB2A6CA291DEE79FEBEAFC7CFD30E0A14DDC4B304904B83F98` |
| `snippets/structured-data-business.liquid` | `BE0F4241B4B53EE41059526CD8AD980A26906035E6FE2A698E1CF6A788024469` |

## 7. Validación pública

- `[x]` Home pública: HTTP 200.
- `[x]` DOM público: un único bloque JSON-LD, JSON válido, tipos `TireShop` y `WebSite`, teléfono oficial, código postal, cuatro perfiles sociales y tres franjas de horario.
- `[x]` El teléfono legado no aparece en el HTML público de la home.
- `[x]` Schema.org Validator: un elemento `WebSite` con la entidad `TireShop` enlazada, 0 errores y 0 advertencias.
- `[x]` Google Rich Results Test: 2 elementos válidos (`Empresa local` y `Organización`).
- `[x]` Google solo informa 2 problemas no críticos en `Empresa local`: faltan `priceRange` e `image`, ambos opcionales.
- `[x]` PageSpeed Insights móvil: rendimiento 86, accesibilidad 88, prácticas recomendadas 92 y SEO 100.
- `[x]` Métricas de laboratorio móviles: FCP 2,2 s, LCP 3,1 s, TBT 220 ms y CLS 0,029.
- `[~]` Los datos de campo de los últimos 28 días aún no aprueban Core Web Vitals por CLS 0,12; esta medición histórica pertenece al seguimiento diferido del paso 2.5 y no bloquea 4.2.

Enlaces de comprobación:

- [Schema.org Validator](https://validator.schema.org/#url=https%3A%2F%2Fwww.bikerz.cl%2F)
- [Google Rich Results Test](https://search.google.com/test/rich-results/result?id=WDdtbkgiatyNkBF8F0Xu7g)
- [PageSpeed Insights móvil](https://pagespeed.web.dev/analysis/https-www-bikerz-cl/qdp5b77qio?form_factor=mobile)

## 8. Decisión de cierre

El paso 4.2 queda cerrado. No se inventará un rango de precios y no se usará el logotipo como sustituto de una fotografía del establecimiento. Ambos campos opcionales se reconsiderarán en 4.3 cuando el propietario defina el rango comercial y seleccione una foto real aprobada.
