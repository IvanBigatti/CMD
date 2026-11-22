# Plan de acción: presentación final

Este plan lleva a la práctica las decisiones de [COHERENCIA-PLAN-ENTORNO.md](COHERENCIA-PLAN-ENTORNO.md). Hay dos líneas de trabajo en paralelo: el **entorno**, que es la ruta crítica porque concentra el trabajo de código, y el **documento del plan + la exposición**, a cargo del equipo. El cierre son la verificación, el plan B y los ensayos.

**Fecha de la presentación:** martes 24/11/2026.

## Orden de ejecución

1. **Entorno:** Fase 1 (1.1 a 1.7) y 3.2 error KO / KOD. *Hecho (falta probarlo en el navegador).*
2. **Entorno:** 1.8 enlace a la encuesta previa.
3. **Entorno:** 3.1 pregunta de verificación → 2.1 página "Antes de empezar" → 2.2 PDF por módulo.
4. **Entorno:** Fase 5, verificación y revisión independiente.
5. **Entorno:** 3.3 órdenes pendientes, al final y solo con todo lo anterior verificado (decisión pendiente).
6. **Equipo:** Línea B (documento del plan y presentación), con el prototipo terminado.
7. **Ambos:** Fase 6, plan B y ensayos.

### Recortes

| Ítem | Decisión | Motivo |
|---|---|---|
| 3.3 Órdenes pendientes y cancelación (I08, I09) | **A decidir**, va al final | Es el único ítem de esfuerzo L y cambia la lógica del dominio |
| 4.2 Volver a renderizar el video de CEDEAR | **Recortado** | El video muestra el camino correcto (la demostración) y la práctica agrega la trampa. Es coherente con la metodología: demostración → práctica |
| 4.3 Regenerar el podcast de CEDEAR | **Recortado** | El guion no depende del paso nuevo |

## Ruta crítica

```
Fase 0 (insumos) ──┬─> Fase 1 (cambios rápidos) ─> Fase 2 (materiales) ─> Fase 3 (funciones nuevas) ─> Fase 4 (medios) ─> Fase 5 (verificación) ─> Fase 6 (plan B y ensayos)
                   └─> Línea B: documento del plan + presentación (en paralelo, se cierra antes de la Fase 6)
```

Esfuerzo: **S** = menos de una hora · **M** = medio día · **L** = un día o más.

## Fase 0: Insumos del equipo (bloquea a las fases siguientes)

| # | Tarea | Responsable | Desbloquea |
|---|---|---|---|
| 0.1 | Confirmar la fecha y el horario de la presentación | Equipo | Todo el cronograma |
| 0.2 | ~~Pasar el enlace del formulario previo~~ Hecho | Equipo | 1.8 |
| 0.4 | Repartir los roles de la exposición: quién presenta cada uno de los 7 bloques | Equipo | Línea B |

## Fase 1: Cambios rápidos en el entorno

Un solo lote, con un commit por unidad de trabajo.

| # | Tarea | ID | Esfuerzo |
|---|---|---|---|
| 1.1 | Textos del público: [nosotros.ts](simulador/src/contenido/nosotros.ts), [testimonios.ts](simulador/src/contenido/testimonios.ts) (edades acordes a la encuesta), [Inicio.tsx:33](simulador/src/sitio/paginas/Inicio.tsx#L33) ("Aprendé a invertir" pasa a hablar de operar la app) y [ALCANCE.md](ALCANCE.md) | I01 | S |
| 1.2 | Declarar la modalidad en el sitio: "100 % online, a tu ritmo" | I02 | S |
| 1.3 | Renombrar el itinerario 2 a "Comprar mi primera acción o CEDEAR" | I23 | S |
| 1.4 | Aviso "IOL nunca te va a pedir tu clave…" en el inicio del simulador y en el sitio | I10 | S |
| 1.5 | Explicación de saldo disponible vs. valorizado en el estado de cuenta | I06 | S |
| 1.6 | Paso de la guía de compra sobre el desglose de costos | I24 | S |
| 1.7 | Campo privado "¿Qué te costó más?" en la reseña (columna nueva, fuera del GET público) | I15 | S |
| 1.8 | Enlace a la encuesta previa en Capacitaciones (la posterior salió del plan) | I16 | S |

## Fase 2: Materiales

| # | Tarea | ID | Esfuerzo |
|---|---|---|---|
| 2.1 | Página "Antes de empezar" a partir del `.pptx`, con las correcciones de contenido del registro | I18 | M |
| 2.2 | Script que genera un PDF por módulo desde [instructivos.ts](simulador/src/contenido/instructivos.ts) + botón de descarga | I14 | M |

## Fase 3: Funcionalidad nueva

En orden de dependencia: 3.3 modifica la lógica de órdenes que usa 3.2.

| # | Tarea | ID | Esfuerzo |
|---|---|---|---|
| 3.1 | Tipo de paso "pregunta de verificación" en la guía + una pregunta por módulo | I12, I13 | M |
| 3.2 | Par KO / KOD operable + error inducido en el itinerario 2 | I07 | M |
| 3.3 | Órdenes límite pendientes, pantalla de órdenes, cancelación y un paso de la guía para revisar el estado | I08, I09 | L |

3.3 cambia la lógica del dominio (hoy un límite alejado del mercado se rechaza). Antes de implementarlo conviene especificarlo con escenarios: qué pasa con el saldo comprometido, cuándo se ejecuta y qué muestra Movimientos.

## Fase 4: Medios afectados

| # | Tarea | ID | Esfuerzo |
|---|---|---|---|
| 4.1 | Revisar qué videos y podcasts mencionan "Comprar mi primer CEDEAR" o muestran el tour viejo | I07, I23 | S |
| 4.2 | Volver a renderizar el video de CEDEAR con el paso del error inducido y el nombre nuevo | I07, I11 | M |
| 4.3 | Regenerar el podcast de CEDEAR si su guion cambia (se mantiene la velocidad de -8 %) | I17 | S |

## Fase 5: Verificación del entorno

| # | Tarea | Esfuerzo |
|---|---|---|
| 5.1 | Recorrer los 5 itinerarios completos y el modo libre, sin errores en la consola | S |
| 5.2 | Probar a 375 px y en un celular real (I19) | S |
| 5.3 | Revisión independiente del código antes de subirlo | S |
| 5.4 | Marcar como hechas las casillas de "Próximos pasos" en [COHERENCIA-PLAN-ENTORNO.md](COHERENCIA-PLAN-ENTORNO.md#próximos-pasos) | S |

## Línea B: Documento del plan y presentación (en paralelo)

| # | Tarea | ID | Responsable |
|---|---|---|---|
| B.1 | Reescribir Fundamentación y Destinatarios | I01 | Equipo (con un borrador de la IA) |
| B.2 | Reescribir el Diagnóstico con los resultados reales de la encuesta | I04, I22 | Equipo (con un borrador de la IA) |
| B.3 | Agregar la modalidad, la duración y los dos recorridos | I02, I03 | Equipo |
| B.4 | Corregir los contenidos (plazos, comisiones) y las estrategias (HyperFrames, estrellas, recursos complementarios) | I05, I11, I15, I17, I24 | Equipo |
| B.5 | Armar la presentación de 20 min con los 7 bloques de las orientaciones | — | Equipo |
| B.6 | Diapositiva o momento "dónde se ve el plan en el entorno": cada objetivo con su pantalla | — | Equipo |
| B.7 | Preparar respuestas orales: por qué el MEP va primero (I23), cómo se publicaría el entorno (I25) y qué limitaciones tiene la muestra de la encuesta | — | Equipo |

## Fase 6: Plan B y ensayos

| # | Tarea | Responsable |
|---|---|---|
| 6.1 | Grabar un video del recorrido guiado por el entorno (puede automatizarse con Playwright) | Ivan (con IA) |
| 6.2 | Capturas ordenadas del recorrido, incluidos los formularios | Ivan (con IA) |
| 6.3 | Presentación y documento del plan en PDF, en pendrive, nube y correo | Equipo |
| 6.4 | Ensayo completo cronometrado (x2), uno frente a alguien ajeno al equipo | Equipo |
| 6.5 | Cronometrar los módulos con esa persona y actualizar las duraciones si difieren (I03) | Equipo |
| 6.6 | El día anterior: `npm install`, `npm run dev` y un recorrido completo en la notebook de la presentación | Ivan |

## Criterio de "listo"

- [ ] Todas las casillas de [Próximos pasos](COHERENCIA-PLAN-ENTORNO.md#próximos-pasos) están marcadas.
- [ ] Cada objetivo del plan se puede mostrar en una pantalla concreta del entorno.
- [ ] El plan B funciona sin internet.
- [ ] La exposición entra en 20 minutos en los dos ensayos.
