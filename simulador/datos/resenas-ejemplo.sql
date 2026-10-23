-- Reseñas de ejemplo para mostrar la sección mientras el sitio se usa solo en forma local.
-- Cargar: sqlite3 datos/resenas.db < datos/resenas-ejemplo.sql
-- Borrarlas antes de usar el sitio con personas reales: DELETE FROM resenas WHERE fecha < '2026-10-22';

INSERT INTO resenas (clave, nombre, comentario, puntuacion, fecha) VALUES
  -- Ingresar dinero y comprar dólar MEP
  ('mep', 'Graciela M.', 'Siempre me dio miedo comprar dólares por internet. Con la guía entendí que el MEP es legal y que no hay que esperar. Lo hice tres veces hasta sentirme segura.', 5, '2026-09-14T15:20:00.000Z'),
  ('mep', 'Rubén A.', 'Muy claro el paso de ingresar los pesos. Me costó un poco encontrar dónde se ve el saldo en dólares después de la compra, pero el video lo explica.', 4, '2026-09-21T22:05:00.000Z'),
  ('mep', 'Silvia R.', 'Me encantó poder equivocarme sin perder plata. Ahora sé qué es el parking y por qué a veces no aparece.', 5, '2026-10-03T13:42:00.000Z'),
  ('mep', 'Héctor L.', 'Útil. Me hubiera gustado que la letra de los globos fuera un poco más grande.', 4, '2026-10-12T18:10:00.000Z'),

  -- Comprar mi primer CEDEAR
  ('cedear', 'Marcela P.', 'No sabía que podía tener acciones de empresas de afuera pagando en pesos. La explicación del ratio me sirvió muchísimo.', 5, '2026-09-17T16:30:00.000Z'),
  ('cedear', 'Jorge D.', 'Bien explicado. El aviso de que el activo supera mi perfil me asustó al principio, pero después entendí para qué está.', 4, '2026-09-29T20:15:00.000Z'),
  ('cedear', 'Norma B.', 'Lo hice con mi hija al lado y después sola. La segunda vez ya no necesité la guía.', 5, '2026-10-09T14:55:00.000Z'),

  -- Invertir en Obligaciones Negociables
  ('on', 'Alberto C.', 'Es el tema más difícil, pero la parte del valor nominal y el lote mínimo quedó clara. Tuve que ver el video dos veces.', 4, '2026-09-25T19:40:00.000Z'),
  ('on', 'Liliana F.', 'Interesante, aunque me quedaron dudas sobre cuándo se cobran los intereses. Estaría bueno sumar eso.', 3, '2026-10-14T12:25:00.000Z'),

  -- Vender, esperar la liquidación y retirar
  ('venta', 'Carlos G.', 'Por fin entendí por qué el dinero no aparece al instante cuando vendo. El botón de avanzar un día es genial para verlo.', 5, '2026-09-19T17:05:00.000Z'),
  ('venta', 'Beatriz S.', 'Me sirvió para perderle el miedo a retirar la plata al banco. Todo paso a paso.', 5, '2026-10-01T21:30:00.000Z'),
  ('venta', 'Osvaldo T.', 'Buena práctica. La diferencia entre contado inmediato y 24 horas podría estar más destacada.', 4, '2026-10-16T15:50:00.000Z'),

  -- Ciclo completo de una inversión
  ('completo', 'Mónica V.', 'Lo recomiendo para empezar. Ves todo el recorrido de una vez y después las otras capacitaciones se entienden mejor.', 5, '2026-09-12T14:10:00.000Z'),
  ('completo', 'Eduardo N.', 'Largo pero completo. Lo hice en dos tardes, retomando desde donde había dejado.', 4, '2026-09-27T23:00:00.000Z'),
  ('completo', 'Ana María K.', 'Tengo 63 años y nunca había invertido. Terminé el recorrido y me animé a abrir mi cuenta de verdad.', 5, '2026-10-07T16:45:00.000Z'),
  ('completo', 'Ricardo H.', 'Muy bueno el video chico al costado para volver a mirar mientras practico.', 5, '2026-10-18T19:20:00.000Z');
