# Formulario de evaluación de compra — Bikerz

Actualizado el 5 de noviembre de 2026. Alcance confirmado por el propietario: una nota conjunta de atención y profesionalismo para el vendedor, otra para el mecánico, datos personales opcionales y captura de UTM del enlace enviado por correo. Las respuestas deben llegar al correo configurado en Shopify.

## Implementación

- `sections/service-evaluation.liquid`: formulario nativo de contacto de Shopify, con confirmación y errores del servidor. Las preguntas de calificación se pueden editar, ordenar y marcar como obligatorias desde el editor del tema.
- `assets/service-evaluation.css`: estilos aislados, adaptables a escritorio y celular, con selección y foco visibles.
- `assets/service-evaluation.js`: captura las UTM de la URL y utiliza el correo opcional del participante cuando se indica.
- `templates/page.evaluacion-servicio.json`: plantilla con las dos calificaciones de 1 a 5 y la alternativa «No aplica: no recibí esta atención» en ambas. Se exige elegir una respuesta por persona, que puede ser «No aplica».
- `sections/evaluation-thank-you.liquid`: sección compartida por los dos destinos de agradecimiento.
- `templates/page.gracias-evaluacion.json`: agradecimiento y compromiso de mejorar, sin enlace de Maps.
- `templates/page.gracias-evaluacion-excelente.json`: agradecimiento y enlace a escribir una reseña en Google Maps.

Se retiró «¿Dónde compraste?». Nombre, correo, pedido o boleta y comentarios son opcionales. Los datos personales están dentro de un bloque desplegable cerrado por defecto; no se autocompletan desde la cuenta de Shopify ni se solicitan como condición para responder. El formulario no suscribe al participante al newsletter.

El formulario nativo de Shopify exige `contact[email]`. Para una respuesta sin correo del participante, se utiliza la dirección pública de Bikerz `hola@bikerz.cl` como remitente técnico, nunca como identidad de quien respondió. La dirección es configurable en el editor del tema. Si se indica un correo opcional, el script lo utiliza como dirección para responder y también se conserva como campo independiente. Sin JavaScript, el envío sigue utilizando el correo técnico y cualquier correo opcional aparece en su campo independiente.

El destinatario es el definido por Shopify en Configuración → Notificaciones → Correo electrónico del remitente. No se cambió esa configuración ni se verificó su dirección en el administrador.

## Campañas y UTM

Se recogen únicamente `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` y `utm_id` del enlace actual. Se adjuntan como campos de la respuesta. Los valores vacíos se omiten, se retiran caracteres de control y se limita cada valor a 200 caracteres. No se conserva la URL completa ni se usan cookies, almacenamiento local, datos de la cuenta o parámetros ajenos a esa lista para identificar al participante.

Ejemplo para el enlace final, después de publicar: `https://www.bikerz.cl/pages/evaluacion-servicio?utm_source=postventa&utm_medium=email&utm_campaign=evaluacion_servicio`.

Usar valores de campaña compartidos y evitar nombres, correos o identificadores individuales dentro de las UTM cuando se quiera mantener las respuestas sin identificación. La captura de UTM requiere JavaScript; la tienda puede tener analítica propia independiente de este formulario.

Documentación oficial: [campos y envío nativo](https://shopify.dev/docs/storefronts/themes/customer-engagement/add-contact-form), [destino de las respuestas](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/common-customizations/add-contact-page).

## Destino después del envío

El formulario utiliza el parámetro nativo `return_to` de Shopify. El script actualiza su destino según las notas; no navega al pulsar Enviar ni sustituye el envío nativo por una confirmación simulada. La redirección real y la recepción del correo siguen pendientes de una prueba de envío.

Regla de selección:

- Todas las notas numéricas aplicables son 5 y hay al menos una: página de experiencia excelente, con enlace a Google Maps.
- Alguna nota es 1, 2, 3 o 4: agradecimiento con compromiso de mejorar.
- Ambas respuestas son «No aplica»: agradecimiento general con compromiso de mejorar.
- «No aplica» se excluye del cálculo: 5 + «No aplica» lleva al destino excelente; 5 + 4 lleva al agradecimiento de mejora.

Sin JavaScript, el formulario usa el destino de agradecimiento general. Los dos destinos pueden asignarse a páginas independientes desde el editor de la encuesta. Mientras esas páginas no existan, se utilizan las plantillas alternativas de la página actual, que también permiten revisar el diseño en el tema de desarrollo.

Enlace oficial obtenido el 5 de noviembre desde el Perfil de Negocio de Bikerz, opción «Solicita opiniones»: `https://g.page/r/CQEVf_GfkwkXEBM/review`. No se preseleccionan estrellas ni se escribe o publica una reseña en nombre del cliente.

Se informó al propietario de que Google prohíbe solicitar reseñas positivas selectivamente y se ofreció incluir Maps para todas las respuestas. Eligió explícitamente «Mantener Maps solo con 5 estrellas». La implementación en el tema de prueba refleja esa decisión. Fuente: [política de valoraciones de Google Maps](https://support.google.com/contributionpolicy/answer/7400114?hl=es).

Referencia técnica: [parámetro return_to de Shopify](https://shopify.dev/docs/api/liquid/tags/form#form-return_to).

## Publicación y vistas de prueba

El propietario autorizó «publícala» y, antes de continuar, solicitó sustituir «Volver a la tienda» por «Ver más ofertas», enlazado a `/collections/ofertas`. El cambio se aplicó en ambos agradecimientos y en la confirmación de respaldo del formulario antes de publicar.

Los siete archivos se publicaron el 5 de noviembre de 2026 en el tema `189814309085` («Bikerz MVP integrado 2026-10-23»), usando `--only` y `--nodelete`.

Páginas públicas creadas y visibles:

- [Encuesta de servicio](https://www.bikerz.cl/pages/evaluacion-servicio), página Shopify `166615122141`, plantilla `evaluacion-servicio`.
- [Gracias por tu evaluación](https://www.bikerz.cl/pages/gracias-evaluacion), página Shopify `166615023837`, plantilla `gracias-evaluacion`.
- [Gracias por tu confianza](https://www.bikerz.cl/pages/gracias-evaluacion-excelente), página Shopify `166615089373`, plantilla `gracias-evaluacion-excelente`.

La plantilla de la encuesta tiene asignadas las dos páginas mediante `improvement_page` y `excellent_page`. Se verificó que el HTML público devuelve las direcciones independientes como destinos.

Vistas anteriores del tema de desarrollo `190293868765`:

[Vista previa del formulario](https://www.bikerz.cl/pages/contacto?preview_theme_id=190293868765&view=evaluacion-servicio).

[Agradecimiento y mejora](https://www.bikerz.cl/pages/contacto?preview_theme_id=190293868765&view=gracias-evaluacion).

[Agradecimiento con Maps](https://www.bikerz.cl/pages/contacto?preview_theme_id=190293868765&view=gracias-evaluacion-excelente).

Las vistas de prueba usan la página de contacto existente con plantillas alternativas. Para compartir la encuesta se debe usar la dirección pública `/pages/evaluacion-servicio`.

La primera revisión automática había rechazado publicar por falta de autorización explícita. Esa condición quedó resuelta con «publícala»; la corrección posterior del enlace se incorporó antes del despliegue autorizado.

## Verificación realizada

- Shopify Theme Check no reportó problemas en los archivos nuevos. La revisión completa devuelve errores previos en otros archivos del repositorio; no se presenta como una validación global aprobada.
- Shopify aceptó la subida y renderizó la plantilla, incluido el formulario nativo con acción POST a `/contact`.
- Revisión visual en escritorio y con un ancho de ventana de 393 px. Sin desbordamiento horizontal; los botones de notas superan 44 px.
- Las dos calificaciones respondidas, incluida la opción «No aplica», producen un formulario válido con nombre, correo, pedido y comentarios vacíos.
- Todos los campos personales están vacíos inicialmente y carecen de `required`. El bloque de contacto está cerrado inicialmente.
- Se verificó en el navegador que un correo opcional mal formado impide el envío y abre el bloque de contacto para poder corregirlo.
- La captura inicial de los campos UTM está activa en los enlaces de campaña; sin parámetros, todos se omiten. El navegador de verificación oculta los valores de inputs de contacto, por lo que las comparaciones de valores se verificaron ejecutando el archivo JS real con datos sintéticos.
- La prueba aislada del JS verificó remitente técnico, uso y retirada del correo opcional, lista permitida de UTM, actualización antes del envío, omisión de valores ausentes, límite de longitud, retirada de caracteres de control, visita sin campaña y limpieza de eventos al retirar la sección. Todas las comprobaciones pasaron.
- Las pruebas de destinos verificaron 5+5, un solo 5 aplicable, 1+5, 5+4, 4+4, una nota 2 y ninguna nota numérica. Se verificó también la actualización del destino antes del envío.
- Shopify renderizó el campo nativo `return_to`. Se verificó visualmente el contenido de ambos destinos: el general no tiene enlace externo de reseñas y el excelente contiene el enlace oficial de Bikerz.
- En producción se verificaron las tres direcciones sin barra de vista previa, los destinos configurados en la encuesta, la ausencia de datos personales obligatorios y «Ver más ofertas» en ambos agradecimientos. Se hizo clic en el enlace de ofertas y se confirmó la navegación a `https://www.bikerz.cl/collections/ofertas`.
- Comparación del respaldo anterior y la descarga posterior: 407 archivos anteriores idénticos, siete añadidos y ninguno borrado. Los cuatro archivos de código coinciden byte por byte con el código local; las tres plantillas JSON tienen contenido equivalente, con el formato y encabezado que agrega Shopify. Evidencia: `output/service-evaluation-2026-11-05/publication-verification.json`.
- No se envió una evaluación real. La entrega al correo y la respuesta de éxito después de un envío real quedan pendientes de una prueba.

Capturas actualizadas `mobile-v2.jpg`, `desktop-v2.jpg` y `preview-v2.jpg` en `output/service-evaluation-2026-11-05/`. Las capturas sin sufijo corresponden a la primera propuesta.
Los nuevos destinos están en `thanks-improvement.jpg`, `thanks-excellent.jpg` y `thanks-excellent-mobile.jpg`.
Las capturas de producción con el enlace de ofertas son `published-survey.jpg` y `published-thanks-excellent.jpg`.

## Procedimiento de publicación realizado

1. Se guardó un respaldo completo del tema publicado en `.tmp/service-evaluation-publish-20261105/live-before/`.
2. Se subieron exclusivamente los siete archivos y se crearon las dos páginas de agradecimiento antes de crear la encuesta.
3. Se asignaron las tres plantillas y los destinos del formulario.
4. Se salió de la vista previa y se verificaron las tres páginas públicas y el enlace de ofertas.
5. La descarga posterior está en `.tmp/service-evaluation-publish-20261105/live-after/` y la comparación quedó guardada como evidencia.

La recepción del correo y la redirección después de un envío real siguen pendientes de una evaluación de prueba autorizada. No se envió ningún correo de prueba ni se publicó ninguna reseña en Google.

No hace falta reemplazar el tema completo ni modificar los menús para disponer de un enlace compartible.

## Incidencia: aparece la promoción de limpieza de cadena

El 5 de noviembre el propietario mostró una captura de `/pages/evaluacion-servicio` con la promoción de limpieza de cadena y el menú antiguo «CONTACTO».

La consulta HTTP sin cookies devolvió 200 y el contenido correcto de las tres páginas: encuesta en la principal y agradecimientos en las otras dos, sin el bloque de promoción. El tema publicado seguía siendo `189814309085`.

Se reprodujo exactamente la promoción al abrir la página con la vista previa del tema antiguo `190009835741` («Bikerz carrito descuentos 2026-10-27»), que no contiene las plantillas nuevas y utiliza su plantilla de página predeterminada. Esto explica la diferencia entre la captura y la página pública; la sesión del navegador de la captura no se inspeccionó directamente.

Se comprobó que este enlace cambia una sesión con esa vista previa al tema publicado y muestra las dos preguntas correctas: `https://www.bikerz.cl/pages/evaluacion-servicio?preview_theme_id=189814309085`.

El parámetro es para recuperar la sesión del navegador afectado. El enlace normal para compartir sigue siendo `https://www.bikerz.cl/pages/evaluacion-servicio`. Si se muestra la barra de Shopify, «Exit preview» vuelve a la versión pública; ese paso también se verificó y se dejó el navegador de trabajo sin vista previa activa.

No se modificó el código ni la configuración de producción por esta incidencia. Captura de verificación: `output/service-evaluation-2026-11-05/survey-recovery-published.jpg`.

## Corrección: no se muestran los campos de contacto opcionales

El 5 de noviembre se reprodujo el fallo del desplegable «¿Quieres dejarnos tus datos?»: el elemento `details` quedaba abierto, pero conservaba una altura fija de 57 px y `overflow: hidden`, por lo que recortaba los tres campos existentes.

La función global del tema `initializeAnimationSummaries` mide un elemento hijo con la clase `.content-animation`. El bloque de contacto no tenía esa clase; la animación fallaba después de fijar la altura inicial. Se añadió `content-animation` al contenedor existente en `sections/service-evaluation.liquid`, junto con un comentario que explica la dependencia.

Se respaldó la sección publicada en `.tmp/service-evaluation-contact-fix-20261105/live-before/` y se confirmó que coincidía con la versión local antes del cambio. Se publicó exclusivamente esa sección en el tema activo `189814309085`, con `--only`, `--allow-live` y `--nodelete`.

La comprobación en producción verificó apertura, cierre y reapertura, incluida la apertura con Enter. En escritorio (1280 × 900), el panel abierto mide 346 px; en celular (393 × 852), 493 px. La animación limpia la altura fija y los tres campos quedan completamente dentro del panel. Se escribió y borró contenido sintético en nombre, pedido/boleta y correo en ambos tamaños. Todos siguen siendo opcionales y no hay desbordamiento horizontal en celular. No se envió el formulario.

Evidencia: `output/service-evaluation-2026-11-05/contact-details-fix-verification.json`. Capturas: `contact-details-fixed.jpg` y `contact-details-fixed-mobile.jpg` en la misma carpeta.

## Ajuste del agradecimiento del 9 de noviembre de 2026

Se actualizó el mensaje de `/pages/gracias-evaluacion-excelente` para agradecer el tiempo y la confianza del cliente e invitar con un tono más cercano: «Si tienes un momento, nos serviría mucho que nos dejaras tu opinión en Google Maps». El texto explica cómo ayuda su experiencia a otros motociclistas y al equipo de Bikerz.

Se respaldó la plantilla activa en `.tmp/service-evaluation-copy-20261109/live-before/`. La comparación del JSON confirmó que solo cambió `sections.main.settings.message`. Se publicó exclusivamente `templates/page.gracias-evaluacion-excelente.json` en el tema activo `189814309085` y se verificó visualmente el texto público y los destinos de los enlaces de Maps y ofertas. Captura: `output/service-evaluation-2026-11-09/thanks-empathy-published.jpg`.
