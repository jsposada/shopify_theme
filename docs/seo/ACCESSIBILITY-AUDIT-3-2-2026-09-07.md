# Auditoría de accesibilidad 3.2 — buscador de neumáticos

Fecha: 2026-09-07
Estado: aprobado, publicado y validado en producción.
Archivo modificado: `sections/tire-finder.liquid`.

## Objetivo

Mejorar la identificación y el uso con tecnologías de asistencia de los controles Ancho, Perfil y Aro, sin alterar el diseño del buscador ni su lógica comercial.

## Línea base

Antes del cambio:

- Los tres selectores ya tenían una etiqueta visible asociada.
- Los IDs eran globales (`select-ancho`, `select-aspecto`, `select-aro`) y podían colisionar si la sección se reutilizaba.
- No existía una instrucción accesible que explicara que Aro es obligatorio y Ancho y Perfil son opcionales.
- El estado de carga no tenía `role="status"`, `aria-live` ni `aria-busy`.
- Los cambios de opciones dependientes no se anunciaban.
- El botón no declaraba `type="button"` ni tenía un estilo explícito de foco.
- Los números de paso, flechas de selector y flecha del botón se exponían como contenido pese a ser decorativos.

## Implementación local

- Se generaron IDs únicos a partir de `section.id` para la sección, los tres selectores, el botón, las instrucciones y los estados.
- Cada `<label for>` apunta al ID único de su `<select>`.
- Se añadió una instrucción solo para tecnologías de asistencia: Aro obligatorio; Ancho y Perfil opcionales; las opciones se actualizan según la selección.
- El conjunto se identifica como una zona de búsqueda con el nombre `Buscar neumáticos por medida`.
- Se declara `aria-required="true"` únicamente en Aro.
- La carga expone `aria-busy="true"` y cambia a `false` al finalizar, incluso cuando ocurre un error.
- Los mensajes de carga y error usan una región viva cortés.
- Una segunda región viva anuncia cuántas opciones dependientes quedan disponibles después de cada cambio.
- Los símbolos decorativos se excluyeron del árbol de accesibilidad.
- Se agregó un foco naranja visible de 2 px a selectores y botón.
- El JavaScript quedó limitado a la instancia actual de la sección y puede reinicializarse correctamente cuando Shopify vuelve a cargar la sección en el editor.

## Validación funcional

Pruebas realizadas en `http://127.0.0.1:9292/`:

- Carga terminada: 117 combinaciones disponibles y `aria-busy="false"`.
- Etiquetas: Ancho, Perfil (opcional) y Aro apuntan a sus controles únicos.
- IDs duplicados dentro del buscador: 0.
- Opciones iniciales útiles: 20 anchos, 10 perfiles y 12 aros.
- Al seleccionar Aro 10: quedaron 5 anchos y 2 perfiles compatibles; el botón se habilitó.
- Anuncio accesible generado: `Opciones actualizadas después de cambiar el aro. 5 opciones de ancho, 2 opciones de perfil y 12 opciones de aro disponibles.`
- Destino comprobado: `/collections/neumaticos?filter.p.m.custom.di_metro=10`.
- Orden de teclado comprobado: Ancho → Perfil → Aro → Buscar neumáticos.
- El botón enfocado mostró contorno sólido naranja de 2 px con separación de 2 px.

## Control visual

En el mismo viewport de escritorio, producción y local conservaron exactamente la misma geometría:

- Buscador completo: 1265 × 197 px.
- Campos Ancho, Perfil y Aro: 314 × 61 px cada uno.
- Botón: 250 × 40 px.
- Posiciones horizontales y verticales: sin diferencias.

También se repitió la comparación en un viewport responsive de 919 px de ancho:

- Buscador completo: 904 × 318 px en producción y local.
- Ancho y Perfil: primera fila, 423 × 61 px cada uno.
- Aro: segunda fila, 423 × 61 px.
- Botón: segunda fila, 856 × 40 px.
- Tamaños y distribución interna: sin diferencias.

Las nuevas instrucciones permanecen fuera del layout visual. Los breakpoints y estilos de móvil no fueron modificados. El propietario confirmó la revisión visual antes de publicar.

## Validación de código

- `git diff --check`: sin errores en el archivo.
- Theme Check aislado: 2 archivos inspeccionados, 0 infracciones.
- El Theme Check completo conserva errores heredados de configuración y traducciones que no pertenecen al paso 3.2.

## Publicación y validación pública

- Theme: `SEO` (`164560142557`).
- Archivo publicado: únicamente `sections/tire-finder.liquid`, con `--nodelete` y autorización explícita para el theme live.
- La comparación previa con Shopify mostró exclusivamente las diferencias aprobadas de 3.2; no había cambios online ajenos.
- SHA-256 local, paquete y descarga posterior: `0CC0696C1CAA104DD17888A37D18EC939BD345BF1D57C6892D2325B365B63CAA`.
- Carga pública: 117 combinaciones; 20 anchos, 10 perfiles y 12 aros iniciales.
- Estado final de carga: `aria-busy="false"`.
- IDs duplicados dentro del buscador: 0.
- Regiones vivas: 2.
- Elementos decorativos expuestos: 0.
- Al elegir Aro 10 quedaron 5 anchos y 2 perfiles compatibles y se habilitó el botón.
- Orden público con Tab: Ancho → Perfil → Aro → Buscar neumáticos.
- Foco público: contorno sólido naranja de 2 px y separación de 2 px.
- Destino público comprobado: `https://www.bikerz.cl/collections/neumaticos?filter.p.m.custom.di_metro=10`.
- Geometría pública de escritorio: 1265 × 197 px, igual a la versión aprobada.
- Control de la home: un H1, un buscador, un enlace de WhatsApp, cero imágenes sin `alt` y ningún desbordamiento horizontal.
