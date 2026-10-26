# Documento explicativo — Sistema Web de Seguros de Accidentes Personales

TIC - Trabajo Integrador Cuatrimestral
Tecnicatura en Inteligencia Artificial / Ciencia de Datos — ISFT N.º 199

---

## 1. Descripción breve del sistema

### ¿Qué hace el sistema?

Es una aplicación web para gestionar el ciclo de trabajo básico de una
aseguradora de accidentes personales: alta de clientes, emisión de
pólizas, registro de los siniestros (accidentes) que reportan los
clientes y seguimiento del estado de cada cosa (póliza activa o
vencida, siniestro abierto o cerrado, pago realizado o pendiente).
También muestra un dashboard con indicadores generales para tener una
vista rápida de cómo está la cartera de clientes sin tener que entrar
a revisar tabla por tabla.

### ¿Quién lo utiliza?

Lo usaría el personal administrativo de la aseguradora: la persona que
atiende al cliente cuando contrata un seguro, la que carga un siniestro
cuando el cliente llama para avisar que tuvo un accidente, y alguien de
gestión que necesita ver de un vistazo cuántos siniestros están
abiertos o cuántas pólizas activas hay.

### ¿Qué datos necesita guardar?

- **Clientes**: nombre, apellido, DNI, email, teléfono.
- **Pólizas**: número de póliza, a qué cliente pertenece, fecha de
  inicio y fin, estado (activa / vencida / cancelada).
- **Coberturas**: los distintos tipos de cobertura que existen (muerte
  accidental, invalidez, gastos médicos, etc.) y qué coberturas tiene
  contratada cada póliza.
- **Siniestros**: a qué póliza corresponde, fecha, tipo de accidente,
  una descripción y si está abierto o cerrado.
- **Pagos**: a qué póliza corresponden, fecha, importe y si están
  pagados o pendientes.

### ¿Qué operaciones debería permitir?

Básicamente, de cada entidad principal (cliente, póliza, siniestro) el
sistema tiene que permitir dar de alta, consultar, modificar y dar de
baja. En el caso de las pólizas la "baja" no borra el registro: lo pasa
a estado CANCELADA, porque en la realidad una aseguradora necesita
conservar el historial de una póliza aunque ya no esté vigente. También
hay que poder buscar (por ejemplo un cliente por apellido o DNI, una
póliza por número) y cambiar el estado de un siniestro de ABIERTO a
CERRADO cuando se termina de atender.

### ¿Qué información sería útil analizar?

Principalmente cuatro cosas, que son las que terminaron en el
dashboard: cuántos clientes hay en total, cuántas pólizas están
activas en este momento, cuántos siniestros siguen abiertos (que es lo
que más le importa a la gestión, porque son los casos pendientes) y
cuántos ya se cerraron. También sirve ver cómo se reparten los
siniestros por tipo de accidente y por mes, para detectar si hay algún
mes con más siniestralidad que otro.

---

## 2. Modelo de datos: DER y normalización

El diagrama entidad-relación completo está en `der.png` (carpeta
`docs/`). Hay 6 tablas: `cliente`, `poliza`, `cobertura`,
`poliza_cobertura`, `siniestro` y `pago`.

### Cardinalidades

- Un **cliente** puede tener muchas **pólizas**, pero cada póliza es de
  un solo cliente → 1:N.
- Una **póliza** puede tener muchos **siniestros** reportados, cada
  siniestro pertenece a una sola póliza → 1:N.
- Una **póliza** puede tener muchos **pagos**, cada pago es de una sola
  póliza → 1:N.
- Una **póliza** puede tener contratadas varias **coberturas**, y una
  misma cobertura (ej. "Gastos médicos") la puede tener contratada más
  de una póliza → relación N:M, resuelta con la tabla intermedia
  `poliza_cobertura`.

### Por qué el modelo llega a 3FN

El único punto no trivial de la normalización fue decidir qué hacer con
las coberturas. La consigna pedía como mínimo las tablas Clientes,
Pólizas, Coberturas, Pagos y Siniestros, pero no decía cómo relacionar
Pólizas con Coberturas. La primera idea que se nos ocurrió fue poner un
campo de texto `cobertura` directo en la tabla `poliza` (por ejemplo
"Muerte accidental"). El problema es que:

1. Si una póliza tiene más de una cobertura contratada (que es lo normal
   en un seguro real), con un solo campo de texto no se puede representar
   sin duplicar la fila entera de la póliza.
2. El nombre de la cobertura se repetiría en cada póliza que la tuviera
   contratada, generando redundancia y el riesgo de escribirlo distinto
   cada vez (ej. "Muerte Accidental" vs "muerte accidental").

Por eso separamos `cobertura` como su propia tabla (así el nombre de
cada cobertura se guarda una sola vez) y agregamos la tabla intermedia
`poliza_cobertura`, que solo tiene `id_poliza` + `id_cobertura` como
clave primaria compuesta. Con esto:

- **1FN**: todos los atributos son atómicos (no hay una columna con
  "varias coberturas separadas por coma").
- **2FN**: en las tablas con clave compuesta (`poliza_cobertura`) no hay
  ningún atributo que dependa de una sola parte de la clave — de hecho
  no tiene atributos propios, solo las dos claves foráneas.
- **3FN**: en el resto de las tablas, cada columna no clave depende
  únicamente de la clave primaria de su tabla y no de otra columna no
  clave. Por ejemplo, en `poliza` el `estado` depende de `id_poliza`,
  no del cliente ni de ninguna otra columna.

`siniestro` y `pago` no necesitaron una tabla intermedia porque su
relación con `poliza` es simple (1 a muchos): alcanza con guardar
`id_poliza` como clave foránea en cada una.

### Reglas de integridad aplicadas

- Claves primarias autoincrementales en todas las tablas (clave
  compuesta en `poliza_cobertura`).
- Claves foráneas con `FOREIGN KEY` en `poliza.id_cliente`,
  `siniestro.id_poliza`, `pago.id_poliza` y en ambas columnas de
  `poliza_cobertura`.
- `UNIQUE` en `cliente.dni` y en `poliza.numero_poliza`, para no poder
  cargar dos veces el mismo cliente o el mismo número de póliza.
- `CHECK` en los campos de estado (`poliza.estado`, `siniestro.estado`,
  `pago.estado`) para que solo acepten los valores válidos definidos
  para cada uno.
- `PRAGMA foreign_keys = ON` activado en cada conexión, porque SQLite
  trae las claves foráneas desactivadas por defecto y si no se activa
  no se respetan las restricciones de integridad referencial.

El script completo de creación está en `db/schema.sql`.
