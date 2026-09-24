# Ficha del negocio para SEO local — paso 4.1

- Fecha de consolidación: 2026-09-14.
- Estado: `[x]` datos suficientes aprobados por el propietario para iniciar 4.2.
- Uso previsto: fuente única para el JSON-LD del paso 4.2 y para revisar Google Business Profile en 4.3.
- Regla: ningún dato marcado como pendiente se incorporará al marcado estructurado como hecho confirmado.

## 1. Estados utilizados

- `[x]` Verificado en una fuente pública vigente o confirmado previamente por el propietario.
- `[~]` Existe en fuentes actuales, pero requiere una decisión de normalización del propietario.
- `[ ]` No se puede cerrar sin confirmación o material del propietario.

## 2. Identidad y contacto

| Campo | Valor propuesto | Estado | Evidencia o decisión pendiente |
| --- | --- | --- | --- |
| Nombre comercial | `Bikerz.cl` | `[x]` | El propietario considera equivalentes `Bikerz.cl` y `Bikerz`. Se usará `Bikerz.cl` como nombre principal para coincidir con Google y `Bikerz` como nombre alternativo. |
| Razón social | `Comercializadora de Piezas y Accesorios para Motos Bikerz Ltda.` | `[x]` | Publicada en Términos y condiciones. No se usará como nombre comercial. |
| RUT | `77.900.826-6` | `[x]` | Publicado en Términos y condiciones. Se conserva como dato interno; no es obligatorio mostrarlo en JSON-LD. |
| Teléfono principal | `+56 9 7767 0252` | `[x]` | Confirmado por el propietario y coincidente en contacto, pie de página, Términos y Google. Valor técnico recomendado: `+56977670252`. |
| Teléfono secundario | Ninguno público | `[x]` | El número terminado en `9915` es legado y el propietario no quiere recibir mensajes allí. Debe excluirse del sitio y del JSON-LD. |
| Correo público | `hola@bikerz.cl` | `[x]` | Coincide en contacto, pie de página y Términos. |
| Sitio web | `https://www.bikerz.cl/` | `[x]` | Dominio canónico público. |

## 3. Ubicación física

| Campo | Valor propuesto | Estado | Evidencia o decisión pendiente |
| --- | --- | --- | --- |
| Calle y número | `Avenida Pedro de Valdivia 5691` | `[x]` | Coincide en el sitio, Términos, mapa embebido y Google. |
| Local | `Local 3` | `[x]` | Confirmado por el propietario. Debe incorporarse gradualmente al resto de menciones NAP. |
| Comuna | `Macul` | `[x]` | Coincide en el sitio y Google. |
| Región | `Región Metropolitana de Santiago` | `[x]` | El sitio abrevia `RM`; para datos estructurados se recomienda el nombre completo. |
| País | `CL` / `Chile` | `[x]` | Confirmado por el dominio, la dirección y la operación comercial. |
| Código postal | `7810107` | `[x]` | Figura en Google y en el mapa embebido del contacto; confirmado por el propietario. |
| Latitud | `-33.4758894` | `[x]` | Extraída del mapa de Google embebido y aceptada junto con la ubicación. |
| Longitud | `-70.6064284` | `[x]` | Extraída del mapa de Google embebido y aceptada junto con la ubicación. |
| URL pública del perfil | `https://share.google/Vk1dKErlG7bkxJ0fQ` | `[x]` | Verificada: abre la entidad `Bikerz.cl` con identificador de Google `/g/11f3f1gwpf`. |
| URL directa de Maps | `https://www.google.com/maps/place/Bikerz.cl/data=!4m2!3m1!1s0x0:0x1709939ff17f1501` | `[x]` | Enlace de la ficha mostrado por Google. |

### Dirección normalizada aprobada

`Avenida Pedro de Valdivia 5691, Local 3, Macul, Región Metropolitana, 7810107, Chile`

## 4. Horarios

Google Business Profile publica actualmente:

| Día | Horario público | Estado |
| --- | --- | --- |
| Lunes | `09:30–13:00` y `14:00–18:00` | `[x]` |
| Martes | `09:30–13:00` y `14:00–18:00` | `[x]` |
| Miércoles | `09:30–13:00` y `14:00–18:00` | `[x]` |
| Jueves | `09:30–13:00` y `14:00–18:00` | `[x]` |
| Viernes | `09:30–13:00` y `14:00–18:00` | `[x]` |
| Sábado | `09:00–14:00` | `[x]` |
| Domingo | Cerrado | `[x]` |

Decisión operativa:

- `[x]` El propietario confirmó los horarios normales publicados en Google.
- `[x]` El cierre de `13:00–14:00` se representará mediante dos franjas de apertura.
- `[x]` Los feriados no tendrán una regla permanente en el JSON-LD: se actualizarán caso a caso en Google Business Profile cuando exista una excepción real.
- `[x]` El propietario confirmó cierre el 18 y 19 de septiembre de 2026; ambos horarios especiales se guardaron y aparecen como `Cerrado`.
- `[x]` El horario adicional interno `Acceso` fue eliminado de Google.

## 5. Redes y perfiles

| Canal | URL encontrada en la configuración del sitio | Estado |
| --- | --- | --- |
| Instagram | `https://www.instagram.com/bikerz.cl/` | `[x]` |
| Facebook | `https://www.facebook.com/Bikerz.cl` | `[x]` |
| TikTok | `https://www.tiktok.com/@bikerz.cl` | `[x]` |
| YouTube | `https://www.youtube.com/@bikerzchile` | `[x]` |

Los cuatro perfiles fueron confirmados por el propietario y se pueden usar en `sameAs`.

## 6. Servicios del taller

Servicios publicados actualmente:

- `[x]` Instalación y balanceo de neumáticos.
- `[x]` Vulcanizado y reparación de pinchazos.
- `[x]` Tubulizado.
- `[x]` Mantenimiento preventivo o mecánica general.
- `[x]` Mantenimiento, limpieza, ajuste y lubricación de cadena.
- `[x]` Cambio de aceite.
- `[x]` Cambio o servicio de frenos.
- `[x]` Venta de neumáticos, repuestos, cascos y lubricantes.

El propietario aprobó la lista actual y podrá ampliarla. Antes de publicar cada servicio nuevo habrá que confirmar alcance, condiciones y necesidad de reserva.

## 7. Cobertura, retiro y pagos

| Campo | Valor encontrado | Estado | Observación |
| --- | --- | --- | --- |
| Zona de despacho | Todo Chile: Región Metropolitana y regiones | `[x]` | Confirmado por el propietario. La limitación Copiapó–Puerto Montt corresponde a fechas estimadas, no a la cobertura comercial. |
| Área de servicio de Google | `Región Metropolitana, Chile` | `[x]` | Bikerz realiza entregas directas el mismo día en toda la Región Metropolitana; el valor fue guardado en Google. |
| Preparación del despacho | Coordinación dentro de 72 horas hábiles después de verificar el pago | `[x]` | Coincide en home, FAQ y Términos. |
| Horario de entrega | Lunes a viernes, aproximadamente `09:00–18:00` | `[x]` | Publicado en FAQ y Términos; no debe confundirse con el horario del local. |
| Retiro en tienda | Sí, solo para productos con esta modalidad habilitada | `[x]` | Se avisa por correo y hay hasta 10 días para retirar. |
| Tarjeta de débito | RedCompra | `[x]` | Publicado en FAQ y Términos. |
| Tarjetas de crédito | Visa, Mastercard, Diners Club y American Express | `[x]` | Publicado en FAQ y Términos. |
| Transferencia bancaria | Sí; validación de hasta 48 horas hábiles | `[x]` | Publicado en FAQ y Términos. |
| Pasarelas | WebPay Plus, Mercado Pago u otras indicadas en checkout | `[x]` | Publicado en Términos. |

## 8. Políticas públicas

Actualmente las políticas comerciales están consolidadas en:

- `https://www.bikerz.cl/pages/terminos-y-condiciones`
- `https://www.bikerz.cl/pages/preguntas-frecuentes`

Resumen operativo encontrado:

- `[x]` Cambio por satisfacción: solicitud dentro de 5 días corridos; producto sin uso, con embalaje y accesorios originales, sujeto a las demás condiciones publicadas.
- `[x]` Derecho a retracto: 10 días desde la recepción para compras web, con las condiciones publicadas.
- `[x]` Garantía legal: 6 meses para fallas o defectos de fabricación.
- `[x]` Devolución de dinero: solicitud por los canales oficiales; plazo publicado de 10 a 20 días hábiles según medio, con otras condiciones específicas para retracto.
- `[x]` Despacho: coordinación dentro de 72 horas hábiles después de verificar el pago.
- `[x]` Retiro: solo productos habilitados; aviso por correo y plazo de 10 días.

Estas políticas se referenciarán mediante URL; el marcado estructurado no resumirá condiciones legales que puedan quedar desactualizadas.

## 9. Identidad visual

| Recurso | Candidato encontrado | Estado | Acción requerida |
| --- | --- | --- | --- |
| Logotipo principal | `shopify://shop_images/BIKERZ_DM-03.png` | `[x]` | Aprobado por el propietario. El JSON-LD resolverá su URL CDN absoluta. |
| Logotipo para fondo oscuro | `shopify://shop_images/bikerzlogoBlanca.png` | `[x]` | Recurso secundario del pie de página; no se propone como logo principal. |
| Fotografía del local | Foto real aprobada y publicada en Google Business Profile | `[~]` | El propietario confirmó su publicación. Falta entregar el archivo original o una URL permanente de Shopify para incorporarla como `image` en el JSON-LD. |

## 10. Inconsistencias detectadas

1. `[~]` Google ya muestra `Loc 3` y la página Contacto incluye `Local 3`; queda comprobar y normalizar las menciones del pie y Términos.
2. `[ ]` Waze todavía muestra el teléfono antiguo `9 5770 9915`; el sitio y Google ya muestran el oficial `9 7767 0252`.
3. `[ ]` Una publicación antigua de Facebook todavía aparece en Google con el teléfono legado terminado en `9915`.
4. `[x]` Cierre del 18 y 19 de septiembre de 2026 aplicado y visible en Google.
5. `[x]` Horario adicional `Acceso` eliminado de Google.
6. `[x]` El área de servicio `Chile` fue sustituida por `Región Metropolitana, Chile`, alcance confirmado para las entregas del mismo día.
7. `[x]` Atributos aplicados y visibles como actuales: NFC se mantuvo; estacionamiento accesible, sanitarios y mecánico quedaron aceptados; Google muestra `No se aceptan cheques` y `No se requiere cita`.
8. `[x]` Los horarios normales de Google y Waze fueron confirmados por el propietario.
9. `[x]` La cobertura comercial de despacho es todo Chile; la mención Copiapó–Puerto Montt corresponde solo al alcance de las fechas estimadas de despacho.
10. `[x]` Se normalizó `Bikerz.cl` como nombre principal y `Bikerz` como nombre alternativo.

## 11. Cierre de 4.1

1. `[x]` Nombre principal `Bikerz.cl`; nombre alternativo `Bikerz`.
2. `[x]` Dirección con `Local 3` y código postal `7810107`.
3. `[x]` Solo el `+56 9 7767 0252` se considera contacto público; el `9915` queda excluido.
4. `[x]` Horarios normales confirmados; excepciones de feriados se administran caso a caso.
5. `[x]` Cuatro redes confirmadas.
6. `[x]` Lista de servicios actual aprobada y ampliable.
7. `[x]` Cobertura de despacho a todo Chile confirmada.
8. `[x]` Logo principal aprobado; fotografía real aprobada y publicada en Google durante 4.3. Su archivo original o URL permanente de Shopify sigue pendiente para el JSON-LD.

El paso 4.1 queda cerrado y sus datos se pueden usar en 4.2.
