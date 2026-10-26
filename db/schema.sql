-- ============================================================
-- seguros.db - Script de creación de tablas
-- TIC - Sistema Web de Seguros de Accidentes Personales
-- ============================================================
-- Normalización: el modelo está en 3FN.
--  - Separamos "cobertura" de "poliza" en vez de poner el nombre de la
--    cobertura como columna de texto dentro de poliza, porque una misma
--    cobertura (ej: "Muerte accidental") la comparten muchas pólizas, y
--    una póliza puede tener más de una cobertura contratada. Si lo
--    pusiéramos como columna de texto repetiríamos el mismo nombre de
--    cobertura una y otra vez (redundancia) y no podríamos tener más
--    de una por póliza sin duplicar filas.
--  - Como la relación entre poliza y cobertura es de muchos a muchos,
--    agregamos la tabla intermedia "poliza_cobertura" (esto es lo que
--    permite llegar a 3FN: ninguna columna no clave depende de otra
--    columna no clave, solo de la clave primaria de cada tabla).
--  - "siniestro" y "pago" dependen de una sola póliza (1 a muchos), así
--    que alcanza con guardar id_poliza como clave foránea en cada una.
-- ============================================================

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS pago;
DROP TABLE IF EXISTS siniestro;
DROP TABLE IF EXISTS poliza_cobertura;
DROP TABLE IF EXISTS poliza;
DROP TABLE IF EXISTS cobertura;
DROP TABLE IF EXISTS cliente;

-- Cliente: la persona que contrata el seguro.
CREATE TABLE cliente (
  id_cliente  INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre      TEXT NOT NULL,
  apellido    TEXT NOT NULL,
  dni         TEXT UNIQUE NOT NULL,
  email       TEXT,
  telefono    TEXT
);

-- Poliza: el contrato de seguro de un cliente.
CREATE TABLE poliza (
  id_poliza      INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_poliza  TEXT UNIQUE NOT NULL,
  id_cliente     INTEGER NOT NULL,
  fecha_inicio   DATE,
  fecha_fin      DATE,
  estado         TEXT NOT NULL DEFAULT 'ACTIVA'
                 CHECK (estado IN ('ACTIVA', 'VENCIDA', 'CANCELADA')),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- Cobertura: los distintos tipos de cobertura que existen
-- (ej: Muerte accidental, Invalidez, Gastos médicos...).
CREATE TABLE cobertura (
  id_cobertura  INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT NOT NULL,
  descripcion   TEXT
);

-- Tabla intermedia para la relación muchos a muchos entre
-- poliza y cobertura (una póliza puede tener varias coberturas,
-- y una cobertura la puede tener contratada más de una póliza).
CREATE TABLE poliza_cobertura (
  id_poliza     INTEGER NOT NULL,
  id_cobertura  INTEGER NOT NULL,
  PRIMARY KEY (id_poliza, id_cobertura),
  FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza),
  FOREIGN KEY (id_cobertura) REFERENCES cobertura(id_cobertura)
);

-- Siniestro: un evento/accidente reportado sobre una póliza.
CREATE TABLE siniestro (
  id_siniestro  INTEGER PRIMARY KEY AUTOINCREMENT,
  id_poliza     INTEGER NOT NULL,
  fecha         DATE NOT NULL,
  tipo          TEXT NOT NULL,
  descripcion   TEXT,
  estado        TEXT NOT NULL DEFAULT 'ABIERTO'
                CHECK (estado IN ('ABIERTO', 'CERRADO')),
  FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza)
);

-- Pago: los pagos realizados sobre una póliza.
CREATE TABLE pago (
  id_pago   INTEGER PRIMARY KEY AUTOINCREMENT,
  id_poliza INTEGER NOT NULL,
  fecha     DATE NOT NULL,
  importe   REAL NOT NULL,
  estado    TEXT NOT NULL DEFAULT 'PAGADO'
            CHECK (estado IN ('PAGADO', 'PENDIENTE')),
  FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza)
);
