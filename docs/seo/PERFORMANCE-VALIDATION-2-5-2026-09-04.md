# Validación de rendimiento 2.5 — 2026-09-04

## Resultado ejecutivo

- Estado: validación ejecutada; el paso 2.5 y la fase 2 permanecen abiertos porque los criterios de rendimiento no se cumplen de forma consistente.
- Las funciones comerciales principales continúan operativas: búsqueda general, buscador de neumáticos, agregado al carrito, reseñas de Google, WhatsApp y píxeles de medición.
- La mediana de tres ejecuciones móviles de Lighthouse fue 49 puntos, con TBT de 2,661 s; ambos valores incumplen los objetivos del roadmap.
- El principal problema estable es CLS: 0,161 en móvil y 0,335 en escritorio. Lighthouse atribuye prácticamente todo el desplazamiento a la sección `Conoce nuestros productos` y su carrusel.
- Se detectó además un error heredado tras agregar desde un carrito vacío: `window.loadContry is not a function`. El producto sí se agrega y el drawer muestra el subtotal correcto, pero el inicializador del calculador de despacho puede quedar incompleto.

## Metodología

- URL: `https://www.bikerz.cl/`.
- Theme live validado: `SEO`, assets `/cdn/shop/t/18/`.
- Motor: Lighthouse 13.4.1.
- Protocolo principal: tres cargas nuevas con emulación móvil y tres con preset de escritorio; se utiliza la mediana de cada métrica.
- Contraste: una ejecución nueva en PageSpeed Insights y comprobación funcional en navegador real.
- Informes fuente: `outputs/lighthouse-2-5-2026-09-04/mobile-1.json` a `mobile-3.json` y `desktop-1.json` a `desktop-3.json`.
- PageSpeed posterior: <https://pagespeed.web.dev/analysis/https-www-bikerz-cl/8t114r40et?form_factor=mobile>
- Nota: los datos de usuarios reales cubren del 5 de agosto al 1 de septiembre de 2026, por lo que todavía no pueden reflejar un despliegue realizado el 4 de septiembre.

## Resultados de las seis ejecuciones

| Ejecución | Rendimiento | FCP | LCP | TBT | CLS | Speed Index | Payload | JS no utilizado | Hilo principal |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Móvil 1 | 49 | 2,556 s | 3,292 s | 3,262 s | 0,161 | 5,048 s | 3.586,4 KiB | 510,8 KiB | 21,374 s |
| Móvil 2 | 55 | 2,234 s | 2,659 s | 2,661 s | 0,173 | 4,521 s | 3.517,5 KiB | 529,4 KiB | 18,733 s |
| Móvil 3 | 48 | 2,448 s | 3,652 s | 2,350 s | 0,160 | 4,743 s | 3.513,6 KiB | 520,5 KiB | 17,087 s |
| Escritorio 1 | 70 | 0,681 s | 1,031 s | 0,246 s | 0,338 | 1,787 s | 4.223,0 KiB | 491,5 KiB | 5,793 s |
| Escritorio 2 | 62 | 0,747 s | 1,215 s | 0,337 s | 0,335 | 2,102 s | 4.307,2 KiB | 534,4 KiB | 5,402 s |
| Escritorio 3 | 74 | 0,625 s | 1,169 s | 0,183 s | 0,334 | 1,572 s | 4.257,6 KiB | 374,0 KiB | 4,640 s |

## Medianas utilizadas para decidir

| Métrica | Móvil | Escritorio | Evaluación |
| --- | ---: | ---: | --- |
| Rendimiento | **49** | **70** | Móvil no cumple el mínimo de 60–70 |
| FCP | 2,448 s | 0,681 s | Móvil necesita mejora; escritorio correcto |
| LCP | 3,292 s | 1,169 s | Móvil necesita mejora; escritorio correcto |
| TBT | **2,661 s** | **0,246 s** | Móvil no cumple el máximo de 0,5 s |
| CLS | **0,161** | **0,335** | Ambos superan el máximo recomendado de 0,10 |
| Speed Index | 4,743 s | 1,787 s | Móvil necesita mejora |
| Payload | 3.517,5 KiB | 4.257,6 KiB | Alto en ambos perfiles |
| JS no utilizado | 520,5 KiB | 491,5 KiB | Alto y dominado por aplicaciones/píxeles externos |
| Hilo principal | 18,733 s | 5,402 s | Bloqueo móvil crítico |

## Contraste con PageSpeed Insights

PageSpeed ejecutó una prueba independiente después del despliegue. Al ser una sola ejecución, sirve como contraste pero no reemplaza las medianas.

| Métrica de laboratorio | Móvil antes de 2.4 | Móvil después | Escritorio antes de 2.4 | Escritorio después |
| --- | ---: | ---: | ---: | ---: |
| Rendimiento | 72 | **80** | 80 | **75** |
| FCP | 2,1 s | 2,2 s | 0,8 s | 0,6 s |
| LCP | 4,9 s | **3,3 s** | 0,9 s | 1,5 s |
| TBT | 0 ms | 180 ms | 30 ms | 80 ms |
| CLS | 0,16 | 0,16 | 0,334 | 0,366 |
| Speed Index | 3,6 s | 3,3 s | 1,6 s | 1,5 s |
| Hilo principal | 4,6 s | 7,3 s | 5,1 s | 4,8 s |

Lectura:

- El LCP móvil mejoró 1,6 s en la ejecución comparable de PageSpeed y la puntuación móvil subió ocho puntos.
- CLS no mejoró y continúa siendo el problema más reproducible.
- TBT y JavaScript muestran mucha variabilidad entre el servidor de PageSpeed y las tres ejecuciones locales. Por eso el paso no se aprueba con un único resultado favorable.
- PageSpeed reportó nuevamente alrededor de 240 KiB de JavaScript no utilizado; las ejecuciones locales observaron entre 374,0 y 534,4 KiB según los terceros cargados en cada visita.

## Datos reales de usuarios

PageSpeed/CrUX muestra para la URL durante los últimos 28 días:

| Dispositivo | Estado | LCP | INP | CLS | FCP | TTFB |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Móvil | No supera Core Web Vitals | 2,2 s | 127 ms | **0,13** | 1,6 s | 0,7 s |
| Escritorio | No aplicable por datos incompletos | Sin dato | 108 ms | **0,28** | 1,5 s | Sin dato |

Estos datos aún representan mayoritariamente la versión anterior al despliegue. El primer efecto real debe revisarse después de acumular 28 días.

## Diagnóstico técnico

### CLS

- En móvil, la sección `Conoce nuestros productos` aporta 0,160 de los 0,161 puntos de CLS.
- En escritorio, la misma sección aporta 0,331 de los 0,338 puntos de una ejecución.
- El desplazamiento está relacionado con la geometría inicial de la sección/carrusel y no con el nuevo H1 ni con el botón de WhatsApp.
- Debe reservarse una altura estable antes de inicializar Swiper y comprobar también si el carrusel de marcas precedente modifica tarde su altura.

### TBT y trabajo del hilo principal

La ejecución móvil representativa de la mediana registró 289 solicitudes, 61 scripts y 3.517,5 KiB transferidos. La evaluación de JavaScript consumió 7,353 s y Style & Layout 4,891 s.

Principales consumidores de CPU observados:

- Administrador de Web Pixels de Shopify: 3,131 s totales y 1,388 s de scripting.
- Meta Pixel: 0,966 s.
- Cargas de Google tag/GA4: aproximadamente 1,183 s combinados.
- Microsoft Clarity: 0,465 s.
- `global.js` del theme: 0,502 s.
- Swiper global: 0,395 s.

Las optimizaciones de 2.4 retiraron recursos internos innecesarios, pero el coste restante está dominado por Web Pixels, aplicaciones, analítica y la cantidad de carruseles.

## Pruebas funcionales

| Función | Resultado | Evidencia |
| --- | --- | --- |
| Home | Aprobada | H1 único, assets del theme live y sin desbordamiento horizontal |
| Búsqueda general | Aprobada | `michelin` muestra sugerencias predictivas y abre la página completa con 20 resultados visibles |
| Buscador de neumáticos | Aprobado | 120/70 R17 habilita el botón y navega a la colección con los tres filtros correctos y 20 productos |
| Carrito | Aprobado con observación | El producto se agrega, el drawer abre, muestra $248.391 y el contador persiste en un artículo |
| Calculador de despacho del drawer | Requiere corrección | Después del primer agregado aparece `window.loadContry is not a function`; no bloquea el producto, pero puede impedir reinicializar el calculador |
| Reseñas | Aprobadas según D-013 | La home muestra Google 4.6, 169 reseñas, tres testimonios y enlace externo; Opinew y Editorify no aparecen en la ficha |
| WhatsApp | Aprobado | Número `56977670252`, etiqueta accesible y mensaje contextual con nombre y URL del producto |
| Analytics | Aprobado técnicamente | Web Pixels, Google tag/GA4, Meta y Clarity continúan cargando; GTM manual sigue ausente. Lighthouse observó respuestas 200/204 de WPM, Google tag, Meta y Clarity; GA4 Tiempo real ya fue confirmado en 2.3 |

## Evaluación de los criterios del roadmap

| Criterio | Estado |
| --- | --- |
| PageSpeed móvil mínimo 60–70 | No aprobado: PageSpeed aislado dio 80, pero la mediana reproducible fue 49 |
| TBT móvil inferior a 500 ms | No aprobado: PageSpeed aislado dio 180 ms, pero la mediana fue 2.661 ms |
| Sin regresiones de compra ni medición | Aprobado para los flujos principales; queda el error heredado del calculador de despacho |
| Core Web Vitals reales aprobados | No aprobado: CLS móvil 0,13 y escritorio 0,28 |

## Ciclo de corrección necesario antes de cerrar 2.5

### Trabajo de Codex

1. Estabilizar la altura inicial de `Conoce nuestros productos` y revisar el carrusel de marcas que la precede.
2. Corregir de forma segura la inicialización de `loadContry` cuando el carrito pasa de vacío a tener productos.
3. Revisar qué inicializaciones de Swiper y scripts propios pueden retrasarse sin romper la interfaz.
4. Repetir las seis pruebas y las verificaciones funcionales después de publicar los cambios aprobados.

### Decisiones del propietario

1. Resuelto el 2026-09-06: conservar el popup de Shopify Forms con 10% de descuento pese a su coste medido; decisión D-016.
2. Si se requiere una mejora móvil más agresiva, decidir si Microsoft Clarity y Meta deben mantenerse en todas las páginas o limitarse, siempre comprobando primero el impacto de medición y campañas.

## Actualización del ciclo de corrección — 2026-09-06

El ciclo comenzó en la copia local. Tras la aprobación visual del propietario, el paquete correctivo se publicó de forma aislada en el theme activo y se repitió la validación completa en producción.

### Causa confirmada del CLS

La traza de Lighthouse mostró que el desplazamiento principal no era causado por el H1 ni por la carga tardía de las imágenes. El carrusel de marcas cambiaba de dos a tres columnas alrededor del breakpoint de 410 px y el modo `loop` reordenaba físicamente los logos. Esos desplazamientos horizontales alcanzaron más de 200 px y empujaron la sección de categorías aproximadamente 27 px; Lighthouse los contabilizó como el bloque principal de CLS.

### Correcciones locales

- Reservar anchos responsivos para marcas y categorías antes de inicializar Swiper.
- Mantener dos logos visibles en todo el rango móvil y conservar cinco en tablet y seis en escritorio.
- Sustituir `loop` por `rewind` en marcas para mantener la repetición sin clonar ni reordenar nodos.
- Restaurar el avance automático de marcas de 1 a 5 segundos.
- Usar altura automática en wrappers y slides de marcas/categorías para evitar el ciclo de altura `100%` durante la inicialización.
- Reservar en línea la altura del hero cuando la sección usa `custom-height`.
- Definir un fallback vacío para `window.loadContry` cuando el estimador de despacho está desactivado; el script real continúa reemplazándolo si se activa la función.

### Validación diagnóstica local

| Dispositivo | Rendimiento | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Móvil | 31 | 6,509 s | 8,410 s | 2,030 s | **0,025** |
| Escritorio | 69 | 1,222 s | 1,984 s | 0,334 s | **0,032** |

Las puntuaciones y métricas de tiempo no son comparables con producción porque la URL usa el proxy de Shopify CLI y carga recursos de desarrollo. CLS sí sirve como comprobación geométrica: frente a las medianas públicas anteriores, bajó de 0,161 a 0,025 en móvil y de 0,335 a 0,032 en escritorio.

La home local conserva un solo H1 y no presenta desbordamiento horizontal. La prueba de carrito agregó `MICHELIN POWER 6 120/70ZR17 58W TL`, abrió el drawer con una unidad y subtotal de $248.391 y no reprodujo `window.loadContry is not a function`.

Evidencia principal: `outputs/lighthouse-2-5-corrections-2026-09-06/mobile-06.json` y `outputs/lighthouse-2-5-corrections-2026-09-06/desktop-01.json`. Los intentos intermedios y la traza diagnóstica permanecen en la misma carpeta para conservar la secuencia de investigación.

### Despliegue y verificación pública

- Se compararon los ocho archivos objetivo con el theme live antes de publicar; las diferencias correspondían únicamente al ciclo correctivo aprobado.
- Se publicaron exclusivamente los ocho archivos con `--nodelete` y `--allow-live` en el theme `SEO` (`164560142557`).
- La descarga posterior confirmó que los ocho hashes SHA-256 remotos coinciden con la copia local.
- Escritorio, 1280 × 900: un H1, cero desbordamiento horizontal, hero de 350 px, nueve logos sin duplicados y carrusel de marcas con seis columnas.
- Móvil, 412 × 915: un H1, cero desbordamiento horizontal, hero de 250 px, nueve logos sin duplicados y dos columnas estables.
- La ficha de `MICHELIN POWER 6 120/70ZR17 58W TL` y el drawer mostraron una unidad y subtotal de $248.391. No aparecieron errores de consola ni `window.loadContry is not a function`.

### Seis mediciones públicas posteriores

| Ejecución | Rendimiento | FCP | LCP | TBT | CLS | Speed Index | Payload | JS no utilizado | Hilo principal |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Móvil 1 | 54 | 2,094 s | 3,697 s | 3,704 s | 0,025 | 5,410 s | 3.526,0 KiB | 506,2 KiB | 27,985 s |
| Móvil 2 | 58 | 2,439 s | 2,518 s | 5,822 s | 0,025 | 6,194 s | 3.392,6 KiB | 468,4 KiB | 31,618 s |
| Móvil 3 | 60 | 2,377 s | 2,602 s | 3,807 s | 0,025 | 5,437 s | 3.840,2 KiB | 479,6 KiB | 32,720 s |
| Escritorio 1 | 81 | 0,582 s | 0,849 s | 0,380 s | 0,035 | 1,540 s | 3.892,4 KiB | 461,4 KiB | 7,329 s |
| Escritorio 2 | 82 | 0,627 s | 0,667 s | 0,361 s | 0,035 | 1,647 s | 3.653,5 KiB | 520,2 KiB | 7,096 s |
| Escritorio 3 | 79 | 0,652 s | 0,717 s | 0,418 s | 0,035 | 1,663 s | 3.798,8 KiB | 523,9 KiB | 7,129 s |

Medianas:

| Métrica | Móvil | Escritorio | Cambio frente al 2026-09-04 |
| --- | ---: | ---: | --- |
| Rendimiento | 58 | 81 | +9 y +11 puntos |
| FCP | 2,377 s | 0,627 s | Mejora de 0,071 s y 0,054 s |
| LCP | 2,602 s | 0,717 s | Mejora de 0,690 s y 0,452 s |
| TBT | 3,807 s | 0,380 s | Empeora 1,146 s y 0,134 s; alta variabilidad de terceros |
| CLS | **0,025** | **0,035** | Mejora aproximada de 85% y 90% |
| Speed Index | 5,437 s | 1,647 s | Móvil empeora 0,694 s; escritorio mejora 0,140 s |
| Payload | 3.526,0 KiB | 3.798,8 KiB | Casi estable en móvil; baja 458,8 KiB en escritorio |
| JS no utilizado | 479,6 KiB | 520,2 KiB | Baja 40,9 KiB en móvil; sube 28,7 KiB en escritorio |
| Hilo principal | 31,618 s | 7,129 s | La carga local de terceros sigue siendo el mayor riesgo móvil |

Evidencia: `outputs/lighthouse-2-5-live-after-cls-2026-09-06/mobile-1.json` a `mobile-3.json` y `desktop-1.json` a `desktop-3.json`.

### Contraste PageSpeed posterior

Informe del 6 de septiembre de 2026: <https://pagespeed.web.dev/analysis/https-www-bikerz-cl/8jli3nbc17?form_factor=mobile>

| Métrica de laboratorio | Móvil | Escritorio |
| --- | ---: | ---: |
| Rendimiento | **96** | **98** |
| FCP | 2,0 s | 0,6 s |
| LCP | 2,5 s | 1,1 s |
| TBT | 30 ms | 10 ms |
| CLS | **0** | **0,033** |
| Speed Index | 2,2 s | 0,8 s |
| Payload | 2.669 KiB | 3.166 KiB |
| JS no utilizado | 240 KiB | 240 KiB |
| Hilo principal | 3,8 s | 3,2 s |

PageSpeed confirma que la corrección geométrica funciona y que el sitio puede rendir muy bien cuando los terceros ejecutan poco trabajo. La diferencia con la mediana Lighthouse local impide considerar estable el TBT todavía. Shopify Forms continúa siendo la mayor pieza individual de JavaScript prescindible: en una de las corridas móviles transfirió 252,7 KiB y dejó 135,2 KiB sin usar; Google/YouTube, Shopify Web Pixels y Meta completan la mayor parte del resto.

CrUX mantiene una ventana acumulada de 28 días que precede mayoritariamente al cambio: móvil LCP 2,1 s, INP 132 ms y CLS 0,13; escritorio LCP 2,2 s, INP 108 ms y CLS 0,28. Por ello no sirve aún para medir el efecto del despliegue del mismo día.

### Control aislado de Shopify Forms

Para no pedir una decisión comercial a ciegas, se realizaron tres corridas móviles adicionales bloqueando exclusivamente `forms-2548/assets/index.js` dentro de Lighthouse. La aplicación no se desactivó ni se cambió la tienda pública.

| Ejecución | Rendimiento | FCP | LCP | TBT | CLS | Speed Index | Payload | JS no utilizado | Hilo principal |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Sin Forms 1 | 50 | 2,392 s | 4,745 s | 2,572 s | 0,024 | 3,433 s | 3.240,7 KiB | 312,2 KiB | 23,488 s |
| Sin Forms 2 | 59 | 2,473 s | 2,726 s | 3,912 s | 0,027 | 5,235 s | 3.235,3 KiB | 281,6 KiB | 33,878 s |
| Sin Forms 3 | 64 | 2,179 s | 2,601 s | 3,251 s | 0,025 | 3,752 s | 3.280,6 KiB | 268,8 KiB | 27,894 s |
| **Mediana sin Forms** | **59** | **2,392 s** | **2,726 s** | **3,251 s** | **0,025** | **3,752 s** | **3.240,7 KiB** | **281,6 KiB** | **27,894 s** |

Comparación de medianas móviles:

| Métrica | Forms activo | Forms bloqueado | Diferencia |
| --- | ---: | ---: | ---: |
| Rendimiento | 58 | 59 | +1 punto |
| LCP | 2,602 s | 2,726 s | +0,124 s |
| TBT | 3,807 s | 3,251 s | -0,556 s |
| CLS | 0,025 | 0,025 | Sin cambio material |
| Speed Index | 5,437 s | 3,752 s | -1,685 s |
| Payload | 3.526,0 KiB | 3.240,7 KiB | -285,3 KiB |
| JS no utilizado | 479,6 KiB | 281,6 KiB | -198,0 KiB |
| Hilo principal | 31,618 s | 27,894 s | -3,724 s |

Forms tiene un coste medible, pero retirarlo por sí solo no acerca el TBT local al objetivo de 500 ms y solo mejora un punto la puntuación mediana. Dado que PageSpeed obtuvo 96 móvil con Forms activo, la recomendación es conservar el popup si genera registros o ventas, medir su conversión y documentar una excepción temporal. Si no tiene rendimiento comercial demostrable, retirarlo elimina peso evitable aunque no resuelva por sí solo el problema completo.

Evidencia: `outputs/lighthouse-2-5-forms-control-2026-09-06/mobile-forms-blocked-1.json` a `mobile-forms-blocked-3.json`.

### Estado después del ciclo

- Aprobado: corrección de CLS en laboratorio, mejora de LCP, estabilidad visual, carrito, WhatsApp y ausencia del error `loadContry`.
- Excepción aceptada: el TBT móvil no es inferior a 500 ms de forma consistente entre laboratorios; se conserva Shopify Forms según D-016.
- Decisión del propietario: mantener activo Shopify Forms y el popup del 10%; Clarity y Meta permanecen sin cambios.
- Pendiente temporal: volver a revisar Core Web Vitals reales cuando la ventana de 28 días contenga el despliegue.

La implementación y las decisiones de 2.5 están completas. El paso y la fase 2 permanecen en seguimiento hasta comprobar la evolución de CrUX a partir del 2026-10-04; no queda una acción inmediata del propietario.
