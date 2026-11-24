# Coherencia entre el Plan de Capacitación y el entorno

Este documento lista cada diferencia entre lo que promete el Plan de Capacitación (documento del 29/09/2026) y lo que hoy ofrece el simulador. La coherencia entre ambas producciones es el criterio que más se observa en la presentación final. Cada incongruencia tiene un ID, y cuando se toma una decisión se anota en el [registro de decisiones](#registro-de-decisiones).

## Estado rápido

| Estado | Cantidad |
|---|---|
| Coherente | 6 |
| Pendiente de decisión | 0 |
| Resuelta | 26 |

## Próximos pasos

Todas las incongruencias tienen una decisión. Falta aplicarlas. El orden y los responsables están en [PLAN-DE-ACCION.md](PLAN-DE-ACCION.md).

### Cambios en el documento del plan

- [ ] **Fundamentación y destinatarios** (I01): público según la encuesta; "ya conocen los instrumentos" pasa a "nociones básicas o interés".
- [ ] **Diagnóstico** (I04, I22): describir la encuesta real y sus resultados; quitar "al terminar repetimos la encuesta".
- [ ] **Retroalimentación** (I16): evaluación en tres capas: logro (preguntas de verificación), satisfacción (estrellas) y mejora ("¿Qué te costó más?").
- [ ] **Modalidad y duración** (I02, I03): E-Learning 100 % virtual y autoguiado, con dos recorridos y sus tiempos.
- [ ] **Contenidos** (I05, I08, I24): plazos CI y 24 hs; "consulta del estado de las operaciones" en lugar de "consulta y cancelación"; sumar costos y comisiones.
- [ ] **Estrategias** (I11, I15, I17): videos con HyperFrames; estrellas de 1 a 5 + "¿Qué te costó más?"; párrafo de recursos complementarios.

### Cambios en el entorno

Ordenados de menor a mayor esfuerzo:

1. [x] Textos del público: [nosotros.ts](simulador/src/contenido/nosotros.ts), [testimonios.ts](simulador/src/contenido/testimonios.ts), [Inicio.tsx:33](simulador/src/sitio/paginas/Inicio.tsx#L33) y [ALCANCE.md](ALCANCE.md) (I01).
2. [x] Modalidad explícita en el sitio (I02).
3. [x] Renombrar el itinerario 2 (I23).
4. [x] Aviso de seguridad (I10).
5. [x] Explicación de saldo disponible vs. valorizado (I06).
6. [x] Paso de la guía sobre el desglose de costos (I24).
7. [x] Campo privado "¿Qué te costó más?" (I15).
8. [x] Enlace a la encuesta previa (I16).
9. [x] Página "Antes de empezar" (I18).
10. [x] Guías PDF por módulo (I14).
11. [x] Pregunta de verificación por módulo (I12, I13).
12. [x] Error inducido KO / KOD (I07).
13. [x] ~~Órdenes pendientes, pantalla de órdenes y cancelación (I08, I09)~~ Recortado: el plan pasa a "consulta del estado de las operaciones".
14. [x] ~~Volver a renderizar el video de CEDEAR~~ No hace falta: la práctica conserva la compra de KO que muestra el video (I07).
15. [ ] Probar a 375 px y en un celular real (I19). *375 px probado con navegador automatizado; falta un celular real.*

### Tareas del equipo

- [ ] Plan B: video del recorrido, capturas, presentación en PDF en varios soportes, capturas de los formularios (I21).
- [ ] Cronometrar los módulos con una persona ajena al equipo (I03).
- [ ] Preparar respuestas orales: por qué el MEP va primero (I23) y cómo se publicaría el entorno (I25).

## Criterio de resolución

Es una propuesta: cada caso se confirma con el equipo antes de aplicarlo.

1. **El entorno tomó la mejor decisión** → se corrige el documento.
2. **Uno de los objetivos del plan depende de la funcionalidad** → se construye en el entorno.
3. **Hay que mostrarlo en la exposición** → tiene que existir en el entorno, aunque sea en una versión mínima.

## Resultados de la encuesta previa

Formulario *Capacitación: Manejo de la Plataforma Invertir Online*, 12 respuestas (captura del 22/11/2026).

| Pregunta | Resultado | Choca con |
|---|---|---|
| Rango de edad | **100 % entre 18 y 24 años** | Testimonios de 51 a 67 años, "~45 a 65" en ALCANCE.md, podcasts más lentos pensados para gente mayor |
| Dispositivo principal | Celular 33,3 % · computadora 33,3 % · ambos 33,3 % | — (respalda el requisito de diseño adaptable) |
| Uso de apps de banco o billeteras | 75 % todos los días | — |
| Manejo del celular o la computadora (1 a 5) | 83,3 % se pone un 5 y 16,7 % un 4 | "No todos se manejan igual con la tecnología" (plan) |
| Experiencia previa en inversiones | Nula 41,7 % · principiante 41,7 % · intermedia 8,3 % · alta 8,3 % | "Ya tienen conocimientos sobre instrumentos" (plan) |
| Conocimiento de acciones, CEDEARs, bonos, ON | Bien 16,7 % · por encima 25 % · "escuché pero no sé qué son" 33,3 % · no los conoce 25 % | Ídem: **solo el 41,7 % conoce los instrumentos** |
| ¿Invertiste alguna vez? | Nunca, pero me interesa 58,3 % · en el pasado 25 % · nunca 16,7 % · actualmente 0 % | — |
| Instrumentos que le interesa operar | Acciones 75 % · CEDEARs 50 % · bonos y letras 25 % · MEP 16,7 % · FCI 16,7 % · no sabe 16,7 % | El primer módulo del entorno es Dólar MEP |
| ¿Tenés cuenta en IOL? | **Sí, pero nunca la usé 41,7 %** · no sabía que existía 25 % · sí y la uso 16,7 % · no tengo 16,7 % | — (respalda la tesis del plan) |
| Otras plataformas usadas | Cocos (2), Lemon, Bull Market, Mercado Pago | — |
| Si tenés cuenta y no la usás, ¿por qué? | No aplica 83,3 % · no sé por dónde empezar 8,3 % · no tengo dinero 8,3 % | Inconsistente: el 41,7 % dijo tener una cuenta sin usar |
| ¿Qué te interesaría hacer? | Invertir en CEDEARs o acciones 58,3 % · poner a rendir plata quieta 50 % · bonos/letras/fondos 33,3 % · seguir mis inversiones 25 % · MEP 16,7 % | — |
| ¿Qué te preocupa al operar? | No poder retirar mi dinero 33,3 % · seguridad de la plataforma 33,3 % · no entender lo que muestra la pantalla 33,3 % · comisiones 33,3 % · equivocarme al cargar una operación 8,3 % · ninguna 16,7 % | Respalda OE1 y el aviso de seguridad (I10); las comisiones no están en los contenidos |

**Lo que el plan dice que mide la encuesta y no aparece:** la capacidad percibida para cada acción, qué tan seguros se sienten de poder retirar su dinero (como escala) y el formato de capacitación preferido.

## Pendientes

Están ordenadas por el orden en que conviene decidirlas: primero las que condicionan a las demás.

### Bloque A: definiciones base del plan

| ID | Tema | El plan dice | El entorno tiene | Decisión |
|---|---|---|---|---|
| P0 | ¿Se puede modificar el documento? | Entregado el 29/09/2026 | — | **Resuelta:** admite modificaciones acotadas |
| I01 | Público destinatario | Personas que **ya conocen** los instrumentos; "no lo definimos por edad" | "personas que nunca invirtieron" ([nosotros.ts:5](simulador/src/contenido/nosotros.ts#L5)), "nunca operaron en el mercado de capitales" ([nosotros.ts:9](simulador/src/contenido/nosotros.ts#L9)); testimonios de 51 a 67 años ([testimonios.ts](simulador/src/contenido/testimonios.ts)); [ALCANCE.md](ALCANCE.md) dice "~45 a 65 años" | **Resuelta:** el público lo definen los datos de la encuesta (ver registro) |
| I02 | Modalidad | No la declara | Autoguiada (video, podcast, instructivo y práctica: [Capacitaciones.tsx:73](simulador/src/sitio/paginas/Capacitaciones.tsx#L73)); no dice "e-learning" | **Resuelta:** E-Learning 100 % virtual, asincrónico y autoguiado |
| I03 | Duración | No la declara | Minutos por módulo: mep 6, cedear 7, on 6, venta 7, completo 18 ([itinerarios.ts](simulador/src/guia/itinerarios.ts)) | **Resuelta:** dos recorridos con duración estimada (ver registro) |
| I04 | Resultados del diagnóstico | Describe la encuesta, pero no qué se descubrió | Hay 12 respuestas reales (ver [resultados](#resultados-de-la-encuesta-previa)) | **Resuelta:** los resultados entran al plan con la reescritura de I22 |
| I22 | Preguntas de la encuesta | Mide capacidad percibida por acción, confianza para retirar y formato preferido | La encuesta real no incluye esas tres preguntas | **Resuelta:** el diagnóstico se reescribe según la encuesta real |
| I23 | Orden y peso de los módulos según el interés | "La encuesta define cuánto tiempo le damos a cada módulo" | El primer módulo es MEP (16,7 % de interés); acciones (75 %) no tiene módulo propio | **Resuelta:** se renombra el itinerario 2; el MEP queda como está |
| I24 | Comisiones | No figuran en los contenidos | Preocupan al 33,3 %; el modal de confirmación ya muestra el desglose de costos | **Resuelta:** se suma al plan y a la guía de compra |

### Bloque B: contenidos

| ID | Tema | El plan dice | El entorno tiene | Decisión |
|---|---|---|---|---|
| I05 | Plazos de liquidación | Contado inmediato, 24 y 48 horas | CI y 24 hs ([tipos.ts:7](simulador/src/dominio/tipos.ts#L7)). El entorno es correcto: T+1 desde el 27/05/2024 y RG CNV 1029/2024 | **Resuelta:** se corrige el plan |
| I06 | Saldo disponible vs. valorizado | Contenido conceptual | Los dos rótulos existen, pero nunca se comparan ([EstadoDeCuenta.tsx:34](simulador/src/pantallas/EstadoDeCuenta.tsx#L34), [EstadoDeCuenta.tsx:109](simulador/src/pantallas/EstadoDeCuenta.tsx#L109)) | **Resuelta:** se construye en el entorno |
| I07 | Símbolos de un activo según la moneda | Contenido conceptual + "ejemplo principal" de error inducido | Solo AL30 / AL30D dentro de Dólar MEP ([DolarMep.tsx:59](simulador/src/pantallas/DolarMep.tsx#L59)). No hay pares operables en Comprar ni un ejercicio de error inducido | **Resuelta:** se construye en el entorno |
| I08 | Consulta y cancelación de órdenes | Contenido procedimental | Ausente: las órdenes se ejecutan al instante y no hay lista de órdenes abiertas ([Movimientos.tsx](simulador/src/pantallas/Movimientos.tsx) es una bitácora) | **Resuelta (revisada):** se recorta; el plan pasa a "consulta del estado de las operaciones" |
| I09 | Revisar el estado de una orden antes de recargarla | Criterio de uso | Ausente | **Resuelta (revisada):** se apoya en Movimientos |
| I10 | "La plataforma nunca pide la clave" | Criterio de uso | Ausente | **Resuelta:** se construye en el entorno |

### Bloque C: metodología

| ID | Tema | El plan dice | El entorno tiene | Decisión |
|---|---|---|---|---|
| I11 | Herramienta de los videos | Grabados con OBS Studio | Producidos con HyperFrames, con voz y música ([videos/](videos/)) | **Resuelta:** se corrige el plan |
| I12 | Ejercicios de lectura | "Encontrar un dato", por ejemplo "¿cuánto ganaste con este activo?" | Ausentes: la guía solo espera clics | **Resuelta:** se construye en el entorno |
| I13 | Verificación automática | Paso 3 de cada módulo: corrige y explica el error | Parcial: mensajes de validación de órdenes ([ordenes.ts:43-94](simulador/src/dominio/ordenes.ts#L43-L94)) y un error provocado en el retiro | **Resuelta:** se cubre con I12 |
| I14 | Guía en PDF por módulo | Una por módulo | Ausente; solo la infografía A4 del módulo completo ([completo.png](simulador/public/instructivos/completo.png)) | **Resuelta:** se generan desde los instructivos |
| I15 | Valoración al cerrar el módulo | Escala de 1 a 10 + campo "qué costó más" | Estrellas de 1 a 5 + comentario libre ([resenas.ts](simulador/src/datos/resenas.ts)) | **Resuelta:** estrellas de 1 a 5 + campo privado "¿Qué te costó más?" |
| I16 | Encuesta previa y posterior | Base del diagnóstico y de la medición del avance | Ausente | **Resuelta:** se enlaza solo la encuesta previa; la posterior sale del plan |
| I17 | Elementos del entorno que el plan no fundamenta | — | Podcasts en 2 voces, reproductor flotante, test de perfil de inversor, MEP "ver por dentro", reseñas públicas, pantallas "Próximamente" | **Resuelta:** se justifican en el plan |
| I18 | Material "Antes de empezar" | — | Existe como `.pptx` en la raíz, pero no está integrado al entorno | **Resuelta:** pasa a ser una página del sitio, actualizada |

### Bloque D: riesgos para la presentación

| ID | Tema | Riesgo | Decisión |
|---|---|---|---|
| I19 | Adaptación a celular | Solo hay dos *breakpoints* (1040 px y 760 px) y nunca se probó en un dispositivo | **Resuelta:** probar a 375 px y en un celular real después de aplicar los cambios |
| I20 | Reseñas sin servidor | La API de reseñas solo corre con `vite dev` o `vite preview`; en un build estático no funciona | **Resuelta:** las reseñas pasaron a una tabla de Supabase, así que funcionan también en el sitio publicado en Vercel |
| I21 | Plan B | Las orientaciones piden un video grabado del recorrido, capturas y la presentación en PDF en varios soportes | **Resuelta:** lista de tareas en el registro |
| I25 | Modalidad E-Learning vs. entorno local | Si el entorno solo corre en `localhost`, ningún participante puede acceder: contradice la modalidad 100 % virtual (I02) | **Resuelta:** se menciona oralmente en la clase |

## Ya coherente

| Contenido del plan | Evidencia en el entorno |
|---|---|
| Ingreso y retiro de fondos | [IngresarDinero.tsx](simulador/src/pantallas/IngresarDinero.tsx), [RetirarDinero.tsx](simulador/src/pantallas/RetirarDinero.tsx) |
| Lectura de portafolio y cotizaciones | [Portafolio.tsx](simulador/src/pantallas/Portafolio.tsx), [Cotizaciones.tsx](simulador/src/pantallas/Cotizaciones.tsx) |
| Carga de órdenes de compra y venta | [Comprar.tsx](simulador/src/pantallas/Comprar.tsx), [Vender.tsx](simulador/src/pantallas/Vender.tsx) |
| Precio de mercado y precio límite | [Comprar.tsx:106-111](simulador/src/pantallas/Comprar.tsx#L106-L111), [instructivos.ts:149](simulador/src/contenido/instructivos.ts#L149) |
| Verificar símbolo, cantidad y monto antes de confirmar | Modal "Paso 2 de 2 · revisá antes de enviar" ([ModalHost.tsx:56](simulador/src/componentes/overlays/ModalHost.tsx#L56)) |
| Demostración en video + práctica guiada | [videos.ts](simulador/src/contenido/videos.ts), [itinerarios.ts](simulador/src/guia/itinerarios.ts) |

## Requisitos de la presentación

Resumen de las orientaciones del curso:

- 20 minutos de exposición + 10 de preguntas, presencial, con proyector y conectividad.
- Todas las personas del equipo deben tener un rol visible.
- Hay que mostrar de forma explícita **dónde se ve el plan dentro del entorno**.
- El proyecto debe reflejar las herramientas y estrategias trabajadas en la materia.
- Se espera un plan B: capturas, video del recorrido, presentación en PDF en más de un soporte y material audiovisual descargado.
- Evaluación docente + coevaluación entre pares.

## Registro de decisiones

| Fecha | ID | Decisión | Se aplica en |
|---|---|---|---|
| 22/11/2026 | P0 | El documento admite modificaciones acotadas. Se prioriza corregirlo donde el entorno ya es correcto y construir en el entorno lo que los objetivos necesitan | Criterio general |
| 22/11/2026 | I01 | El público se define con los datos de la encuesta: jóvenes con buen manejo digital, interés en invertir y poca o nula experiencia; muchos tienen cuenta en IOL sin usar. Se mantiene la tesis de practicar sin arriesgar dinero y que la capacitación no recomienda inversiones. "Ya conocen los instrumentos" pasa a "tienen nociones básicas o interés" | **Plan:** Fundamentación y Destinatarios. **Entorno:** [nosotros.ts](simulador/src/contenido/nosotros.ts) ("nunca invirtieron"), [testimonios.ts](simulador/src/contenido/testimonios.ts) (edades de 51 a 67), la frase "Aprendé a invertir" de [Inicio.tsx:33](simulador/src/sitio/paginas/Inicio.tsx#L33) y [ALCANCE.md](ALCANCE.md). Revisar si se mantiene la voz más lenta de los podcasts |
| 22/11/2026 | I02 | Modalidad E-Learning: 100 % virtual, asincrónica y autoguiada, sin encuentros en vivo ni tutor | **Plan:** declarar la modalidad y justificarla con la encuesta (75 % usa apps a diario, 83 % se pone un 5 en manejo tecnológico). **Entorno:** decirlo de forma explícita en el sitio, por ejemplo en [Capacitaciones.tsx](simulador/src/sitio/paginas/Capacitaciones.tsx) ("100 % online, a tu ritmo") |
| 22/11/2026 | I03 | Hay dos recorridos sin plazo de acceso. **Por módulos** (MEP, CEDEAR, ON, Venta y retiro): unos 35 min entre prácticas (26 min) y videos (8 min 42 s), y unos 50 min si se suman los podcasts (15 min). **Ciclo completo** (para quien quiere recorrer todo de una vez): unos 21 min entre práctica (18 min) y video (3 min 18 s), y unos 27 min con el podcast (5 min 32 s). Los tiempos de práctica son estimados y conviene medirlos con una persona ajena al equipo | **Plan:** agregar la duración y los dos recorridos en Estrategias metodológicas |
| 22/11/2026 | I22 | El diagnóstico del plan pasa a describir la encuesta real: perfil, conocimiento del mercado, relación con IOL, intereses y preocupaciones. Se quitan las tres mediciones que no existen. El avance se mide repitiendo al final las preguntas comparables: conocimiento de los instrumentos y preocupaciones (meta: que baje el 33 % de "no poder retirar mi dinero") | **Plan:** sección 2, Destinatarios y diagnóstico. Como ya no hay pregunta de formato preferido, la elección de formatos (video, podcast, guía) se justifica de otra forma (ver I17) |
| 22/11/2026 | I05 | Se corrige el plan: los plazos vigentes son contado inmediato y 24 hs. Las 48 hs dejaron de existir con el paso a T+1 (BYMA, 27/05/2024) y la RG CNV 1029/2024. El entorno ya es correcto | **Plan:** sección 4, Contenidos conceptuales |
| 22/11/2026 | I07 | Se construye el error inducido de símbolo en el módulo CEDEAR: se agrega el par KO (pesos) / KOD (dólares) como operable. Se usa Coca-Cola porque los videos y podcasts muestran esa compra; el desvío por KOD va antes del recorrido original. Si la persona elige el símbolo de la otra moneda, el simulador explica la diferencia antes de dejarla seguir | **Entorno:** [instrumentos.ts](simulador/src/mocks/instrumentos.ts), [Comprar.tsx](simulador/src/pantallas/Comprar.tsx), [itinerarios.ts](simulador/src/guia/itinerarios.ts) (módulo CEDEAR). Revisar si el video de CEDEAR debe mostrarlo |
| 22/11/2026 | I08, I09 | Se construyen órdenes pendientes. Una orden con precio límite que no alcanza el precio de mercado queda pendiente en lugar de rechazarse. Hay una pantalla de órdenes con su estado y una acción para cancelar, y un paso de la guía enseña a revisar el estado antes de volver a cargar una orden | **Entorno:** [simulador.ts](simulador/src/estado/simulador.ts), [ordenes.ts](simulador/src/dominio/ordenes.ts) (hoy rechaza un límite alejado del mercado), una pantalla nueva de órdenes y [itinerarios.ts](simulador/src/guia/itinerarios.ts) |
| 22/11/2026 | I10 | Se agrega el aviso "IOL nunca te va a pedir tu clave por teléfono, correo ni mensajería": un aviso visible en el inicio del simulador y una mención en el sitio. Lo respalda la encuesta: la seguridad preocupa al 33,3 % | **Entorno:** inicio del simulador y [Capacitaciones.tsx](simulador/src/sitio/paginas/Capacitaciones.tsx) |
| 22/11/2026 | I06 | Se agrega una explicación que compara el saldo disponible (lo que se puede usar o retirar) con el saldo valorizado (efectivo + valor actual de las tenencias) en el estado de cuenta | **Entorno:** [EstadoDeCuenta.tsx](simulador/src/pantallas/EstadoDeCuenta.tsx) |
| 22/11/2026 | I11 | Se corrige el plan: los videos se producen con HyperFrames (video generado a partir de código HTML), con capturas reales del simulador, voz del equipo y música. OBS no fue una herramienta de la cursada | **Plan:** sección 5. Para la exposición: como el video se genera desde código, se puede volver a renderizar cuando cambia el simulador (sirve para I07). La limitación es la curva de aprendizaje y el tiempo de render |
| 22/11/2026 | I12, I13 | Cada módulo termina con una pregunta de verificación sobre una pantalla de lectura, con opciones (por ejemplo "¿cuánto ganaste con AAPL?" o "¿cuándo vas a poder retirar esta plata?"). Si la respuesta es incorrecta, la guía explica dónde mirar y deja reintentar. Así queda el paso 3 (verificación) de la metodología | **Entorno:** [itinerarios.ts](simulador/src/guia/itinerarios.ts) y la guía (GuiaOverlay); un tipo de paso nuevo con pregunta |
| 22/11/2026 | I14 | Un script genera un PDF por módulo a partir de [instructivos.ts](simulador/src/contenido/instructivos.ts), que queda como única fuente de verdad, y cada actividad tiene un botón de descarga. Argumento para la exposición: el mismo contenido en cuatro formatos (video, audio, texto en pantalla e impreso) | **Entorno:** un script nuevo en [scripts/](simulador/scripts/), los PDF en `public/` y un botón en la página de cada actividad |
| 22/11/2026 | I15 | Se mantienen las estrellas de 1 a 5 y la reseña pública. Se suma el campo privado "¿Qué te costó más?", que no se publica y alimenta la mejora del material entre ediciones | **Plan:** sección 5, la escala pasa de 1–10 a 1–5. **Entorno:** tabla `resenas` en Supabase (columna `costo_mas` que el público puede escribir pero no leer) y [ModalResena.tsx](simulador/src/componentes/overlays/ModalResena.tsx) |
| 22/11/2026 | I16 | La encuesta previa es el formulario de Google existente, enlazado al entrar a Capacitaciones. La posterior es un formulario nuevo y corto con las preguntas comparables (conocimiento de los instrumentos y preocupaciones), enlazado al terminar el último módulo o el ciclo completo | **Equipo:** pasar el enlace público del formulario previo y crear el posterior. **Entorno:** [Capacitaciones.tsx](simulador/src/sitio/paginas/Capacitaciones.tsx) y el cierre de módulo (modal de reseña) |
| 22/11/2026 | I17 | Se agrega al plan un párrafo de recursos complementarios. Podcasts: un tercio usa principalmente el celular. Reproductor flotante: explicación mientras se practica, por el 33 % al que le preocupa no entender la pantalla. Perfil de inversor: fidelidad a IOL (normativa CNV), no es una recomendación. MEP "ver por dentro": refuerza los símbolos según la moneda. Reseñas: confianza frente a la desconfianza digital. "Próximamente": delimita el alcance sin romper la navegación. **Los podcasts mantienen la velocidad reducida (-8 %)** porque se escuchan mientras se realiza la actividad: la atención está dividida y un ritmo más pausado reduce la carga cognitiva | **Plan:** sección 5. Esto reemplaza la justificación anterior por edad de la voz lenta (ver I01) |
| 22/11/2026 | I18 | El `.pptx` "Antes de empezar" (11 diapositivas, guía de bienvenida) pasa a ser una página web del sitio, enlazada antes de elegir el itinerario. Se actualiza el contenido. Diap. 3: quitar "damos por hecho que ya sabés qué es un CEDEAR" (I01). Diap. 9: sumar el error de símbolo (I07); "la orden queda esperando" pasa a ser cierto con I08. Diap. 10: la escala pasa de 1–10 a estrellas de 1 a 5 (I15) y se mencionan los 5 videos, los 5 podcasts y las guías PDF (I14) | **Entorno:** una página nueva en [simulador/src/sitio/paginas/](simulador/src/sitio/paginas/) y un enlace desde [Capacitaciones.tsx](simulador/src/sitio/paginas/Capacitaciones.tsx) |
| 22/11/2026 | I23 | El itinerario 2 pasa a llamarse "Comprar mi primera acción o CEDEAR" (acciones 75 %, CEDEARs 50 % de interés; el flujo de compra es el mismo). El itinerario 1 (Ingresar dinero + MEP) queda como está, sin una justificación agregada en el plan | **Entorno:** [itinerarios.ts](simulador/src/guia/itinerarios.ts), [videos.ts](simulador/src/contenido/videos.ts), [podcasts.ts](simulador/src/contenido/podcasts.ts) y la página "Antes de empezar" (I18). **Exposición:** tener preparada una respuesta oral para "¿por qué arrancan con el MEP?" |
| 22/11/2026 | I19, I20, I21 | La demo se corre en local con `npm run dev`. Esto asegura la API de reseñas y reduce la dependencia de la conectividad: solo los formularios de Google la necesitan. Tareas de plan B: (1) grabar un video del recorrido guiado; (2) capturas ordenadas del recorrido; (3) la presentación en PDF en pendrive, en la nube y por correo; (4) videos y podcasts ya están en local, en `public/`; (5) capturas de los formularios por si no hay internet; (6) probar a 375 px y en un celular real | **Equipo + entorno** |
| 22/11/2026 | I16 (revisión) | **Reemplaza la decisión anterior de I16 y la medición del avance de I22.** La encuesta posterior sale del plan. Solo se enlaza la encuesta previa, en su vista para responder (`/viewform`). Se quita del plan "al terminar repetimos la encuesta". La evaluación queda en tres capas: **logro**, con las preguntas de verificación de cada módulo (I12, I13); **satisfacción**, con las estrellas de 1 a 5; y **mejora**, con "¿Qué te costó más?" (I15) | **Plan:** sección 2 (diagnóstico) y sección 5 (retroalimentación). **Entorno:** enlace en [Capacitaciones.tsx](simulador/src/sitio/paginas/Capacitaciones.tsx) |
| 22/11/2026 | I26 | En la verificación, el reproductor flotante tapaba lo que la guía pedía tocar (el botón "Comprar" del MEP en escritorio; un tercio de la pantalla en celular). Se reemplaza por una **barra fija abajo con espacio reservado**, en celular y en escritorio: una barra compacta (play/pausa, progreso, pestañas Video/Podcast y expandir) que se puede expandir para ver el video. La página reserva la altura del reproductor en cualquiera de sus estados, así que nunca tapa la guía ni ningún botón | **Entorno:** [ReproductorFlotante.tsx](simulador/src/componentes/overlays/ReproductorFlotante.tsx), [reproductorFlotante.ts](simulador/src/estado/reproductorFlotante.ts), estilos y el posicionamiento de la guía |
| 22/11/2026 | I08, I09 (revisión) | **Reemplaza la decisión anterior de I08 e I09.** Se recorta la cancelación de órdenes para no tocar la lógica de saldos antes de la presentación. En el plan, "consulta y cancelación de órdenes" pasa a "consulta del estado de las operaciones", que Movimientos ya cubre (ahí figuran las órdenes "sin ejecutar"). El criterio "revisar el estado de una orden antes de volver a cargarla" se apoya en Movimientos. La cancelación queda como mejora futura en la mirada crítica | **Plan:** sección 4 (contenidos procedimentales y criterios de uso). **Exposición:** mencionarla como mejora futura |
| 22/11/2026 | I25 | Para la presentación, el entorno corre solo en local. La publicación en un hosting se menciona oralmente en la clase como el paso para que los participantes accedan | **Exposición:** decirlo antes de que lo pregunten, en "Decisiones tecnológicas y mirada crítica" |
| 22/11/2026 | I24 | Se agregan las comisiones a los contenidos del plan ("costos de una operación"). En el entorno, la guía de compra señala el desglose de costos que ya muestra el modal de confirmación. Lo respalda la encuesta: las comisiones preocupan al 33,3 % | **Plan:** sección 4. **Entorno:** [itinerarios.ts](simulador/src/guia/itinerarios.ts) (un paso sobre el desglose en [ModalHost.tsx](simulador/src/componentes/overlays/ModalHost.tsx)) |

## Fuentes

- *Trabajo de recopilación de información sobre el proyecto IOL* (Plan de Capacitación, 29/09/2026).
- *Orientaciones para la presentación final del curso* (V1).
- [ALCANCE.md](ALCANCE.md).
- [BYMA: reducción del ciclo de liquidación desde el 27/05/2024](https://www.byma.com.ar/newsroom/desde-el-27052024-byma-reduce-el-ciclo-de-liquidacin-de-operaciones-de-contado-normal).
- [La Nación: la CNV redujo los plazos de liquidación (RG 1029/2024)](https://www.lanacion.com.ar/economia/beneficio-inversor-la-cnv-redujo-los-plazos-de-liquidacion-para-que-invertir-sea-mas-agil-nid07112024/).
