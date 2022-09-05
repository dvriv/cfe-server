-- psql -f db/init.sql
-- should make a user and db with the same name for the command to work

DROP DATABASE IF EXISTS cfe;
CREATE DATABASE cfe;

\c cfe;

CREATE SCHEMA pasivo;

-- Resumen are the main entry done on the software, and it can have two different tipos (type) and three modos (mode)
CREATE TABLE pasivo.resumen (
  proceso TEXT NOT NULL,
  resumen_id SERIAL,
  modo TEXT,
  tipo TEXT ,
  mes INT2 NOT NULL,
  año INT2 NOT NULL,
  notas TEXT,
  ultima_modificacion TIMESTAMP,

  PRIMARY KEY (resumen_id)
);

CREATE TABLE pasivo.concepto_costo (
  cuenta_contable INTEGER NOT NULL,
  rama_aseguramiento TEXT,
  subdivision TEXT,
  concepto_costo TEXT NOT NULL,
  PRIMARY KEY (concepto_costo)
);

CREATE TABLE pasivo.eventual_concepto_costo (
  concepto_costo TEXT,
  PRIMARY KEY (concepto_costo),
  FOREIGN KEY (concepto_costo) REFERENCES pasivo.concepto_costo (concepto_costo)
);

CREATE TABLE pasivo.operacion_concepto_costo (
  concepto_costo TEXT,
  PRIMARY KEY (concepto_costo),
  FOREIGN KEY (concepto_costo) REFERENCES pasivo.concepto_costo (concepto_costo)
);

CREATE TABLE pasivo.resumen_concepto_costo(
  resumen_id SERIAL NOT NULL,
  concepto_costo TEXT NOT NULL,
  monto INTEGER NOT NULL,
  momento TEXT,
  PRIMARY KEY(resumen_id, concepto_costo),
  FOREIGN KEY(resumen_id) REFERENCES pasivo.resumen(resumen_id)
);

-- This is the result of the multiplication concepto de costo x centro de costo
CREATE TABLE pasivo.resumen_cuota(
  resumen_cuota SERIAL,
  resumen_id SERIAL NOT NULL,
  monto INTEGER NOT NULL,
  PRIMARY KEY(resumen_cuota),
  FOREIGN KEY(resumen_id) REFERENCES pasivo.resumen(resumen_id)
);

INSERT INTO pasivo.concepto_costo (
  cuenta_contable,
  concepto_costo,
  rama_aseguramiento,
  subdivision
) VALUES
(452000, '91', 'Enfermedad y Maternidad', 'Patronal'),
(452001, '9G', 'Enfermedad y Maternidad', 'Obrera'),
(452010, '92', 'Invalidez y Vida', 'Patronal'),
(452011, '9I', 'Invalidez y Vida', 'Obrera'),
(452020, '93', 'Riesgo de Trabajo', null),
(452030, '94', 'Guarderia y Prestaciones Sociales', null),
(409724, '234K1', 'Total Patronal y Obrera', null),
--
(452040, '95', 'Retiro', null),
(409518, '2342G', 'Total Retiro', null),
(451450, '9E', 'Cesantia y Vejez', 'Patronal'),
(451451, '9O', 'Cesantia y Vejez', 'Obrera'),
(409724, '234K7', 'Total Cesantai y Vejez', null);

/*
INSERT INTO pasivo.operacion_concepto_costo (
  concepto_costo
) VALUES 
('91'),
('9G'),
('92'),
('9I'),
('93'),
('94'),
('234K1'),
('95'),
('2342G'),
('9E'),
('9O'),
('234K7');
*/
