# Contenido y estructura de landings SEO — Paso 5.2

Fecha: 2026-09-21  
Estado: `[~]` textos aprobados por el propietario el 2026-09-21 y cargados el 2026-09-22 en cinco colecciones no publicadas; vista previa local funcional preparada el 2026-09-24 y pendiente de aprobación visual.  
Publicación: no autorizada.

## 1. Implementación común

Las cinco colecciones usarán la plantilla local `templates/collection.seo-landing.json`.

La plantilla separa el contenido para mantener una buena experiencia de compra:

1. Breadcrumbs y H1 nativo de la colección.
2. Introducción de 150–300 palabras antes de los productos, almacenada en el metacampo de colección `custom.seo_intro`.
3. Filtros, ordenamiento y grilla de productos.
4. Guía, preguntas frecuentes, enlaces internos y CTA después de los productos, almacenados en la descripción de la colección.

El theme ya genera la canonical con `canonical_url`, y la plantilla conserva breadcrumbs, paginación y filtros. Las URLs con parámetros no se usarán como landings ni se enlazarán como destinos SEO.

### Requisitos administrativos

- Crear un metacampo de colección `custom.seo_intro` de tipo texto enriquecido.
- Habilitar los metacampos de producto utilizados en reglas como condiciones de colecciones automáticas.
- Asignar la plantilla `seo-landing` únicamente a las cinco colecciones aprobadas.
- Cargar SEO title y meta description en los campos nativos de Shopify.
- No publicar ni enlazar una colección antes de validar su listado de productos.

## 2. `/collections/neumaticos-trail-adventure`

### Configuración SEO

- Nombre de colección y H1: `Neumáticos trail y adventure para motos`
- SEO title: `Neumáticos Trail y Adventure para Moto | Bikerz`
- Meta description: `Compra neumáticos trail y adventure para moto en Chile. Encuentra Dunlop, Bridgestone, Michelin y Continental con asesoría especializada.`
- Regla automática prevista: `custom.uso = Trail`.
- Imagen sugerida: motocicleta trail real sobre una ruta mixta, sin texto incrustado.
- Alt sugerido: `Neumáticos trail y adventure para motos disponibles en Bikerz`.
- Categoría superior: `/collections/neumaticos`.

### Introducción — `custom.seo_intro`

Encuentra neumáticos trail y adventure para motos pensados para combinar estabilidad en carretera, confianza en caminos de tierra y resistencia durante viajes largos. En esta colección reunimos alternativas para distintos estilos de conducción, desde rutas principalmente asfaltadas hasta recorridos mixtos donde el dibujo y la capacidad de evacuación adquieren mayor importancia.

Antes de elegir, revisa la medida indicada por el fabricante de tu moto, el eje de montaje, los índices de carga y velocidad, y si tu llanta utiliza sistema tubeless o cámara. La proporción entre carretera y uso fuera de pavimento también es clave: un neumático orientado al asfalto suele entregar una conducción más suave en ciudad y carretera, mientras que un diseño con tacos más marcados favorece la tracción en superficies sueltas.

Aquí podrás comparar opciones de Dunlop, Bridgestone, Michelin, Continental y otras marcas compatibles disponibles en Bikerz. Si no sabes qué modelo corresponde a tu moto o al tipo de viaje que estás preparando, podemos ayudarte a revisar medida, uso y compatibilidad antes de comprar, con despacho a todo Chile y servicio de instalación en Santiago.

### Contenido después de productos — descripción de colección

## Cómo elegir neumáticos trail o adventure

Considera estos cinco puntos antes de decidir:

1. **Tipo de ruta:** define cuánto conducirás por asfalto, ripio, tierra o superficies sueltas.
2. **Medida homologada:** confirma ancho, perfil y diámetro en el manual o en la especificación del fabricante.
3. **Eje correcto:** verifica si el neumático corresponde a posición delantera, trasera o a ambas según la ficha del producto.
4. **Carga y velocidad:** utiliza índices iguales o superiores a los exigidos por la motocicleta.
5. **Cámara o tubeless:** la construcción del neumático debe ser compatible con la llanta y el sistema de montaje.

Las líneas de Dunlop, Bridgestone, Michelin y Continental tienen prioridad comercial dentro de esta categoría, sin excluir otras alternativas compatibles. La disponibilidad puede cambiar, por lo que la decisión final debe considerar el producto actualmente en stock y la recomendación para tu modelo de moto.

## Preguntas frecuentes

### ¿Trail y adventure significan exactamente lo mismo?

Se utilizan para describir motos y neumáticos capaces de circular en más de un tipo de superficie, pero cada modelo puede estar más orientado a carretera o a uso fuera de pavimento. Revisa siempre el diseño, la ficha técnica y la proporción de uso recomendada.

### ¿Puedo instalar un neumático más agresivo que el original?

Solo si la medida, construcción, índices y compatibilidad con la llanta cumplen las especificaciones de la moto. Un dibujo más agresivo también puede cambiar el comportamiento y el confort sobre asfalto.

### ¿Debo usar la misma línea adelante y atrás?

La opción más predecible suele ser emplear una combinación delantera y trasera diseñada para trabajar en conjunto. Si necesitas mezclar líneas, confirma compatibilidad técnica y tipo de uso antes del montaje.

### ¿Bikerz realiza instalación y balanceo?

Sí. En Bikerz, la instalación y el balanceo son gratis con la compra de tus neumáticos, exclusivamente en la Región Metropolitana. Puedes solicitar atención desde la página de [servicios](/pages/servicios).

### Enlaces relacionados

- [Todos los neumáticos para moto](/collections/neumaticos).
- [Cómo interpretar medidas europeas y americanas](/blogs/motos-chile/medidas-europeas-vs-americanas-cual-es-la-diferencia-en-los-neumaticos-de-moto).
- [Neumáticos con cámara frente a tubeless](/blogs/motos-chile/tube-type-vs-tubeless).
- [Cómo calcular la capacidad de carga](/blogs/motos-chile/calcular-la-capacidad-de-carga-de-tus-neumaticos-de-moto).
- [Michelin](/collections/michelin), [Dunlop](/collections/dunlop), [Continental](/collections/continental) y [Bridgestone](/collections/bridgestone).

**CTA:** ¿No sabes qué opción corresponde a tu moto? Consulta compatibilidad con Bikerz antes de comprar.

## 3. `/collections/neumaticos-sport-street`

### Configuración SEO

- Nombre de colección y H1: `Neumáticos sport y street para motos`
- SEO title: `Neumáticos Sport y Street para Moto | Bikerz`
- Meta description: `Encuentra neumáticos sport y street para moto en Chile. Compara Dunlop, Bridgestone, Michelin y Continental con despacho y asesoría.`
- Regla automática prevista: `custom.uso = Sport` o `custom.uso = Street`.
- Imagen sugerida: motocicleta naked o sport circulando sobre pavimento seco.
- Alt sugerido: `Neumáticos sport y street para motos de uso urbano y carretera`.
- Categoría superior: `/collections/neumaticos`.

### Introducción — `custom.seo_intro`

Explora neumáticos sport y street para motos orientados al uso urbano, carretera y conducción sobre pavimento. Esta colección reúne alternativas para quienes buscan respuesta precisa, estabilidad y un comportamiento adecuado en trayectos cotidianos o recorridos más dinámicos, siempre respetando las especificaciones de cada motocicleta.

La elección no depende únicamente del dibujo. Antes de comprar, verifica el ancho, perfil y diámetro indicados por el fabricante, además del eje de montaje, la construcción del neumático y los índices de carga y velocidad. También conviene considerar la frecuencia de uso, el tipo de pavimento, la conducción con pasajero o equipaje y las condiciones climáticas habituales de tu recorrido.

En Bikerz podrás comparar modelos de Dunlop, Bridgestone, Michelin, Continental y otras marcas disponibles. Sport y Street se mantienen en una sola landing para facilitar la comparación y evitar páginas que compitan por búsquedas demasiado similares. Si tienes dudas sobre compatibilidad, podemos ayudarte a revisar la medida y el uso correcto antes de la compra. Contamos con despacho a todo Chile y servicios de montaje y balanceo en Santiago.

### Contenido después de productos — descripción de colección

## Qué revisar en un neumático sport o street

- **Compatibilidad:** conserva las medidas y especificaciones autorizadas para tu modelo.
- **Uso real:** diferencia entre traslado urbano, carretera, conducción deportiva ocasional y viajes con carga.
- **Eje y sentido de giro:** respeta la posición y las indicaciones impresas en el neumático.
- **Construcción:** no cambies entre radial y diagonal sin comprobar que la combinación está permitida.
- **Estado del conjunto:** presión, válvulas, llantas, suspensión y balanceo influyen en el resultado final.

Priorizamos Dunlop, Bridgestone, Michelin y Continental al presentar alternativas, sin ocultar otras marcas que cumplan la medida y el uso requerido.

## Preguntas frecuentes

### ¿Qué diferencia existe entre un neumático Sport y uno Street?

Ambos están orientados al pavimento, pero un modelo Sport puede priorizar respuesta y agarre en una conducción más exigente, mientras que un Street suele buscar equilibrio entre uso diario, duración y confort. La ficha de cada producto permite comparar su enfoque real.

### ¿Puedo cambiar el ancho o el perfil original?

Por lo general, es posible cambiar una medida y, en algunos casos, hasta dos; sin embargo, lo recomendable es modificar solo una. Una medida distinta puede afectar la geometría, el espacio disponible, la lectura de velocidad y el comportamiento. Confirma cualquier cambio con la especificación del fabricante o un especialista.

### ¿Cómo sé cuándo debo reemplazar mis neumáticos?

Revisa profundidad del dibujo, desgaste irregular, grietas, deformaciones, reparaciones y antigüedad. Si existe daño o dudas sobre su estado, solicita una inspección profesional.

### ¿Conviene balancear después de instalar?

Sí, el balanceo ayuda a reducir vibraciones y desgaste irregular. En Bikerz es gratis con la compra de tus neumáticos. Consulta el servicio disponible en [Bikerz](/pages/servicios).

### Enlaces relacionados

- [Todos los neumáticos para moto](/collections/neumaticos).
- [Balanceo de neumáticos en moto](/blogs/motos-chile/balanceo-de-neumaticos-en-moto).
- [Cómo calcular la capacidad de carga](/blogs/motos-chile/calcular-la-capacidad-de-carga-de-tus-neumaticos-de-moto).
- [Michelin](/collections/michelin), [Dunlop](/collections/dunlop), [Continental](/collections/continental) y [Bridgestone](/collections/bridgestone).

**CTA:** Compara las opciones disponibles o consulta a Bikerz si necesitas confirmar medida, eje y compatibilidad.

## 4. `/collections/neumaticos-120-70-17`

### Configuración SEO

- Nombre de colección y H1: `Neumáticos 120/70-17 para motos`
- SEO title: `Neumáticos 120/70-17 para Moto | Bikerz`
- Meta description: `Compra neumáticos 120/70-17 para moto en Chile. Compara Dunlop, Bridgestone, Michelin, Continental y otras marcas disponibles.`
- Regla automática prevista: `custom.ancho = 120`, `custom.aspecto = 70` y `custom.di_metro = 17`.
- Imagen sugerida: primer plano lateral de un neumático 120/70-17 con la medida legible.
- Alt sugerido: `Neumático para moto en medida 120/70-17`.
- Categorías relacionadas: `/collections/neumaticos-sport-street` y `/collections/neumaticos-trail-adventure`.

### Introducción — `custom.seo_intro`

Encuentra neumáticos 120/70-17 para motos en distintas marcas y tipos de uso. En esta medida, `120` indica el ancho nominal en milímetros, `70` corresponde a la relación entre la altura del perfil y el ancho, y `17` señala el diámetro de la llanta en pulgadas. Es una medida frecuente en varias motocicletas, pero su presencia en tu neumático actual no basta para garantizar compatibilidad.

Antes de comprar, confirma en el manual de la moto el eje correspondiente, el índice de carga, el código de velocidad, el tipo de construcción y si la llanta requiere cámara o permite montaje tubeless. También debes considerar el uso previsto: existen alternativas 120/70-17 orientadas a conducción street, sport, touring y trail, con comportamientos diferentes aunque compartan la misma medida.

Esta colección permite comparar productos disponibles de Dunlop, Bridgestone, Michelin, Continental y otras marcas. El listado se genera con los metacampos de ancho, perfil y diámetro para evitar depender de variaciones en el nombre del producto. Si necesitas ayuda, Bikerz puede revisar la información de tu motocicleta antes de la compra y ofrecer instalación y balanceo en Santiago.

### Contenido después de productos — descripción de colección

## Cómo confirmar que un 120/70-17 es compatible

1. Revisa la medida homologada en el manual o etiqueta técnica de la moto.
2. Confirma si corresponde al eje delantero o trasero.
3. Comprueba índices de carga y velocidad.
4. Verifica construcción radial o diagonal y sistema con cámara o tubeless.
5. Elige el patrón según uso street, sport, touring o trail.

## Preguntas frecuentes

### ¿Qué significa 120/70-17?

`120` es el ancho nominal en milímetros, `70` es la relación porcentual del perfil respecto del ancho y `17` es el diámetro de la llanta en pulgadas.

### ¿Todos los neumáticos 120/70-17 sirven para la misma moto?

No. Pueden variar en construcción, índice de carga, velocidad, eje y tipo de uso. Deben compararse todas las especificaciones.

### ¿Puedo elegir cualquier marca si la medida coincide?

La medida es solo uno de los requisitos. También debes verificar compatibilidad y, si mantienes otro neumático instalado, que el conjunto delantero y trasero tenga un comportamiento adecuado.

### ¿Bikerz puede instalarlo?

Sí. La instalación es gratis en el taller con la compra de tus neumáticos. Revisa las condiciones y solicita atención desde [servicios](/pages/servicios).

### Enlaces relacionados

- [Neumáticos sport y street](/collections/neumaticos-sport-street).
- [Neumáticos trail y adventure](/collections/neumaticos-trail-adventure).
- [Guía de medidas de neumáticos](/blogs/motos-chile/medidas-europeas-vs-americanas-cual-es-la-diferencia-en-los-neumaticos-de-moto).
- [Neumáticos con cámara frente a tubeless](/blogs/motos-chile/tube-type-vs-tubeless).

**CTA:** Confirma tu moto, año, medida e índices con Bikerz antes de completar la compra.

## 5. `/collections/neumaticos-160-60-17`

### Configuración SEO

- Nombre de colección y H1: `Neumáticos 160/60-17 para motos`
- SEO title: `Neumáticos 160/60-17 para Moto | Bikerz`
- Meta description: `Encuentra neumáticos 160/60-17 para moto en Chile. Compara Michelin, Dunlop, Bridgestone, Continental y alternativas disponibles.`
- Regla automática prevista: `custom.ancho = 160`, `custom.aspecto = 60` y `custom.di_metro = 17`.
- Imagen sugerida: neumático 160/60-17 montado en una rueda trasera, con encuadre técnico.
- Alt sugerido: `Neumático 160/60-17 para rueda de moto`.
- Categorías relacionadas: `/collections/neumaticos-sport-street` y `/collections/neumaticos-trail-adventure`.

### Introducción — `custom.seo_intro`

Compara neumáticos 160/60-17 para motos con disponibilidad en distintas marcas y enfoques de conducción. La nomenclatura indica un ancho nominal de 160 milímetros, un perfil equivalente al 60 % del ancho y una llanta de 17 pulgadas. Esta medida aparece con frecuencia en aplicaciones traseras, pero debes confirmar la posición y todas las especificaciones para tu modelo concreto.

Dos neumáticos 160/60-17 pueden responder de manera diferente si fueron diseñados para uso street, sport, touring o trail. Por eso, además de la medida, revisa el índice de carga, el código de velocidad, la construcción, la recomendación de eje y la compatibilidad con cámara o sistema tubeless. Si llevas pasajero, equipaje o realizas viajes frecuentes, considera también las exigencias de carga previstas por el fabricante.

La colección reúne opciones de Michelin, Dunlop, Bridgestone, Continental y otras marcas disponibles. Los productos se seleccionan mediante metacampos técnicos para reducir errores producidos por títulos escritos de formas distintas. Bikerz puede ayudarte a comparar alternativas, verificar la información de tu moto y coordinar instalación y balanceo en Santiago.

### Contenido después de productos — descripción de colección

## Puntos clave para elegir un 160/60-17

- Confirma medida y eje en la documentación de la moto.
- Mantén índices de carga y velocidad adecuados.
- Revisa si la construcción es radial, diagonal o reforzada según la ficha.
- Elige el compuesto y dibujo de acuerdo con ciudad, carretera, turismo o uso mixto.
- Comprueba presión, estado de la llanta y balanceo durante la instalación.

## Preguntas frecuentes

### ¿El 160/60-17 siempre es un neumático trasero?

Es común encontrarlo en el eje trasero, pero la posición correcta depende de la ficha del neumático y de la especificación de la motocicleta.

### ¿Puedo reemplazar un 150/60-17 por un 160/60-17?

No debe asumirse que son intercambiables. El cambio modifica ancho y geometría, y puede afectar espacio, llanta y comportamiento. Requiere validación técnica específica.

### ¿Qué marca debo elegir?

Dunlop, Bridgestone, Michelin y Continental son prioridades de la tienda, pero la elección debe basarse en compatibilidad, uso, disponibilidad y combinación con el neumático del otro eje.

### ¿Se ofrece instalación?

Sí. La instalación y el balanceo son gratis en el taller con la compra de tus neumáticos. Revisa las condiciones y solicita atención desde la página de [servicios](/pages/servicios).

### Enlaces relacionados

- [Neumáticos sport y street](/collections/neumaticos-sport-street).
- [Neumáticos trail y adventure](/collections/neumaticos-trail-adventure).
- [Cómo calcular la capacidad de carga](/blogs/motos-chile/calcular-la-capacidad-de-carga-de-tus-neumaticos-de-moto).
- [Balanceo de neumáticos en moto](/blogs/motos-chile/balanceo-de-neumaticos-en-moto).

**CTA:** Envíanos los datos de tu motocicleta para confirmar compatibilidad antes del montaje.

## 6. `/collections/neumaticos-90-90-21`

### Configuración SEO

- Nombre de colección y H1: `Neumáticos 90/90-21 para motos`
- SEO title: `Neumáticos 90/90-21 para Moto | Bikerz`
- Meta description: `Compra neumáticos 90/90-21 para moto en Chile. Encuentra Dunlop, Bridgestone, Michelin, Continental y opciones trail disponibles.`
- Regla automática prevista: `custom.ancho = 90`, `custom.aspecto = 90` y `custom.di_metro = 21`.
- Imagen sugerida: rueda delantera de moto trail con neumático 90/90-21, medida visible.
- Alt sugerido: `Neumático 90/90-21 para moto trail y adventure`.
- Categoría relacionada principal: `/collections/neumaticos-trail-adventure`.

### Introducción — `custom.seo_intro`

Encuentra neumáticos 90/90-21 para motos, una medida habitual en ruedas de gran diámetro utilizadas por distintas motocicletas trail, adventure y de uso fuera de carretera. `90` representa el ancho nominal en milímetros, el segundo `90` corresponde a la relación del perfil y `21` indica el diámetro de la llanta en pulgadas. La medida debe coincidir con la especificación de tu moto, pero también es necesario revisar el resto de la ficha técnica.

Antes de elegir, confirma el eje de montaje, los índices de carga y velocidad, la construcción y el uso recomendado. Dentro de 90/90-21 existen dibujos con orientación principalmente asfáltica, mixta o más enfocada en tierra, por lo que dos productos con la misma medida pueden ofrecer experiencias muy diferentes. También verifica si la llanta y el neumático requieren cámara o admiten configuración tubeless.

Bikerz reúne opciones de Dunlop, Bridgestone, Michelin, Continental y otras marcas disponibles. La colección se alimenta con ancho, perfil y diámetro estructurados para presentar resultados precisos. Si estás preparando un viaje o quieres cambiar el tipo de uso, podemos ayudarte a comparar alternativas compatibles antes de comprar.

### Contenido después de productos — descripción de colección

## Cómo escoger un 90/90-21 según el terreno

- Para uso principalmente en carretera, busca estabilidad, evacuación y comportamiento predecible sobre pavimento.
- Para recorridos mixtos, equilibra superficie de contacto en asfalto y capacidad de tracción en ripio o tierra.
- Para mayor uso fuera de carretera, revisa un dibujo más abierto y la recomendación concreta del fabricante.
- En todos los casos, conserva medida, índices, construcción y compatibilidad de montaje.

## Preguntas frecuentes

### ¿El 90/90-21 se instala siempre adelante?

Es una aplicación delantera frecuente, pero debes confirmarla en la ficha del producto y en las especificaciones de la motocicleta.

### ¿Un neumático con más tacos es mejor para cualquier uso?

No. Un dibujo más abierto puede ayudar en superficies sueltas, pero también cambia sensaciones, ruido y comportamiento sobre pavimento. Elige según el porcentaje real de uso.

### ¿Puedo montar un neumático tubeless con cámara?

Depende de la llanta, del neumático y de las instrucciones del fabricante. No tomes la decisión únicamente por la sigla del producto; solicita revisión técnica.

### ¿Cómo confirmo carga y velocidad?

Compara los índices impresos en el neumático con los mínimos exigidos por el fabricante de la moto. Consulta nuestra [guía de capacidad de carga](/blogs/motos-chile/calcular-la-capacidad-de-carga-de-tus-neumaticos-de-moto).

### Enlaces relacionados

- [Neumáticos trail y adventure](/collections/neumaticos-trail-adventure).
- [Todos los neumáticos para moto](/collections/neumaticos).
- [Neumáticos con cámara frente a tubeless](/blogs/motos-chile/tube-type-vs-tubeless).
- [Guía de medidas de neumáticos](/blogs/motos-chile/medidas-europeas-vs-americanas-cual-es-la-diferencia-en-los-neumaticos-de-moto).

**CTA:** Cuéntanos qué moto conduces y qué proporción de asfalto y tierra recorres para orientarte mejor.

## 7. Lista de validación antes de cargar contenido

- `[x]` Confirmar que los cinco titles miden menos de 60 caracteres: miden entre 38 y 47.
- `[x]` Confirmar que las cinco meta descriptions miden menos de 160 caracteres: miden entre 126 y 137.
- `[x]` Verificar que todos los enlaces internos responden 200: comprobado el 2026-09-21.
- `[x]` Revisar los textos y afirmaciones sobre uso, eje y compatibilidad: aprobado por el propietario el 2026-09-21.
- `[ ]` Elegir o producir cinco imágenes reales y cargar un `alt` particular.
- `[x]` Crear `custom.seo_intro` para colecciones.
- `[x]` Validar las reglas y el listado de productos de cada colección.
- `[x]` Crear las colecciones sin publicarlas ni enlazarlas.
- `[x]` Asignar la plantilla `seo-landing`.
- `[x]` Cargar title, meta description, introducción y descripción extendida.
- `[ ]` Revisar vista previa móvil y escritorio con el propietario.
- `[ ]` Autorizar publicación y enlazado interno en una decisión separada.
