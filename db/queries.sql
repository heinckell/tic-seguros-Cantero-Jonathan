-- ============================================================
-- consultas.sql - Consultas SQL obligatorias (Parte 5)
-- Para probarlas: npm run db:queries  (ejecuta este archivo contra
-- seguros.db y muestra el resultado de cada una por consola)
-- ============================================================

-- 1. Mostrar todos los clientes.
SELECT * FROM cliente;

-- 2. Ordenar clientes alfabéticamente por apellido.
SELECT * FROM cliente ORDER BY apellido ASC;

-- 3. Buscar clientes cuyo apellido comience con A.
SELECT * FROM cliente WHERE apellido LIKE 'A%';

-- 4. Buscar una póliza por número.
SELECT * FROM poliza WHERE numero_poliza = 'POL-2025-0001';

-- 5. Contar la cantidad de clientes.
SELECT COUNT(*) AS cantidad_clientes FROM cliente;

-- 6. Contar la cantidad de pólizas activas.
SELECT COUNT(*) AS polizas_activas FROM poliza WHERE estado = 'ACTIVA';

-- 7. Contar la cantidad de siniestros.
SELECT COUNT(*) AS cantidad_siniestros FROM siniestro;

-- 8. Calcular el promedio de pagos.
SELECT ROUND(AVG(importe), 2) AS promedio_pagos FROM pago;

-- ============================================================
-- JOINs obligatorios (Parte 5, punto 11)
-- Cada uno muestra información útil (nombres, no solo IDs).
-- ============================================================

-- JOIN 1: Cliente + Póliza
-- Para cada póliza, mostrar el nombre completo del cliente dueño.
SELECT
  p.numero_poliza,
  c.nombre || ' ' || c.apellido AS cliente,
  c.dni,
  p.fecha_inicio,
  p.fecha_fin,
  p.estado
FROM poliza p
JOIN cliente c ON p.id_cliente = c.id_cliente
ORDER BY p.numero_poliza;

-- JOIN 2: Póliza + Siniestro
-- Para cada siniestro, mostrar a qué póliza pertenece.
SELECT
  s.id_siniestro,
  p.numero_poliza,
  s.fecha,
  s.tipo,
  s.descripcion,
  s.estado
FROM siniestro s
JOIN poliza p ON s.id_poliza = p.id_poliza
ORDER BY s.fecha;

-- JOIN 3: Cliente + Póliza + Siniestro
-- El reporte completo: qué cliente tuvo qué siniestro, en qué póliza.
SELECT
  c.nombre || ' ' || c.apellido AS cliente,
  p.numero_poliza,
  s.fecha,
  s.tipo,
  s.estado AS estado_siniestro
FROM siniestro s
JOIN poliza p ON s.id_poliza = p.id_poliza
JOIN cliente c ON p.id_cliente = c.id_cliente
ORDER BY s.fecha;

-- ============================================================
-- Consultas extra: son las que alimentan el Dashboard (Parte 8).
-- Se dejan documentadas acá para que se vea de dónde sale cada
-- indicador; en el código, viven en app/api/dashboard/route.js
-- ============================================================

-- Pólizas por estado (gráfico 1)
SELECT estado, COUNT(*) AS cantidad FROM poliza GROUP BY estado;

-- Siniestros por tipo (gráfico 2)
SELECT tipo, COUNT(*) AS cantidad FROM siniestro GROUP BY tipo ORDER BY cantidad DESC;

-- Siniestros por mes (gráfico 3)
SELECT strftime('%Y-%m', fecha) AS mes, COUNT(*) AS cantidad
FROM siniestro
GROUP BY mes
ORDER BY mes;

-- Siniestros abiertos / cerrados (tarjetas del dashboard)
SELECT estado, COUNT(*) AS cantidad FROM siniestro GROUP BY estado;
