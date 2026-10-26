# Bitácora de uso de IA

TIC - Sistema Web de Seguros de Accidentes Personales

Durante el desarrollo usé Claude como asistente para avanzar más rápido
en partes del código, pero revisé y probé todo antes de darlo por
bueno. Dejo acá los 5 usos más relevantes.

---

### 1. Modelado de la relación entre pólizas y coberturas

**Qué le pedí:** le mostré la lista mínima de tablas que pedía la
consigna (Clientes, Pólizas, Coberturas, Pagos, Siniestros) y le
pregunté cómo convenía relacionar Pólizas con Coberturas, dado que una
póliza puede tener más de una cobertura contratada.

**Qué devolvió la IA:** propuso NO guardar la cobertura como un campo
de texto dentro de la tabla `poliza`, sino separar `cobertura` como su
propia tabla y agregar una tabla intermedia `poliza_cobertura` para
resolver la relación muchos a muchos, explicando que así se evita
repetir el nombre de la cobertura en cada póliza.

**Qué corregí:** nada de la estructura en sí, pero le pedí que agregara
comentarios en el propio `schema.sql` explicando el porqué de esa
decisión, para poder defenderla en el oral sin tener que acordarme de
memoria.

**Qué aprendí:** entendí mejor por qué una relación N:M en un modelo
relacional casi siempre se resuelve con una tabla intermedia, y no
tratando de "forzar" la relación en alguna de las dos tablas originales.

---

### 2. Generación de datos de prueba

**Qué le pedí:** generar los datos de carga mínimos que pedía la
consigna (10 clientes, 10 pólizas, 5 coberturas, 15 pagos, 10
siniestros) con nombres argentinos y fechas distribuidas en varios
meses de 2025, para que el gráfico de "siniestros por mes" del
dashboard tuviera sentido.

**Qué devolvió la IA:** un script (`db/seed_data.mjs`) con arrays de
datos de ejemplo e inserts parametrizados para cargar todo en orden
(primero clientes, después pólizas, etc., respetando las claves
foráneas).

**Qué corregí:** revisé que los DNI y números de póliza fueran todos
distintos (por las restricciones UNIQUE) y que las fechas de los
siniestros efectivamente cayeran en meses distintos, porque en la
primera tanda varias quedaron en el mismo mes y el gráfico de barras
por mes quedaba poco representativo.

**Qué aprendí:** que al generar datos de prueba hay que pensar también
para qué se van a usar (en este caso, alimentar gráficos), no solo
cumplir la cantidad mínima pedida.

---

### 3. Bug: las tablas no se creaban al correr el script de inicialización

**Qué le pedí:** le pasé el error que me tiraba Node al correr
`db/init.mjs` (`SQLITE_ERROR: no such table: cliente`) a pesar de que
el `schema.sql` sí tenía los `CREATE TABLE`.

**Qué devolvió la IA:** encontró que el script leía el archivo
`schema.sql` y primero lo partía por `;`, y recién después filtraba los
bloques que empezaban con un comentario (`--`). Como cada `CREATE
TABLE` tenía un comentario explicativo arriba sin punto y coma en el
medio, el bloque comentario+CREATE TABLE quedaba pegado y, al empezar
con `--`, se descartaba entero (comentario y sentencia SQL juntos).

**Qué corregí:** con la explicación entendí el error y confirmé que la
solución era sacar primero las líneas de comentario una por una y
recién ahí separar por `;`. Volví a correr el script y esta vez sí
cargó las 6 tablas y los datos.

**Qué aprendí:** a tener más cuidado con el orden de las operaciones de
texto (separar vs. filtrar) y, sobre todo, a no asumir que un script
"debería funcionar" sin correrlo y mirar el resultado real.

---

### 4. Bug: el dashboard no se actualizaba en producción

**Qué le pedí:** le conté que en desarrollo (`npm run dev`) el
dashboard sí se actualizaba al cargar un siniestro nuevo, pero que
después de hacer `npm run build` y `npm run start` los números del
dashboard quedaban siempre iguales aunque cargara datos nuevos.

**Qué devolvió la IA:** explicó que Next.js, si una ruta de API no usa
ninguna función "dinámica" (como leer parámetros de la URL), la trata
como contenido estático y la cachea en el momento del build, sirviendo
siempre la misma respuesta. Como la ruta `/api/dashboard` no leía nada
de la URL, quedaba marcada como estática. La solución fue agregar
`export const dynamic = "force-dynamic"` en esa ruta (y revisar las
demás rutas de API para no tener el mismo problema en otro lado).

**Qué corregí:** agregué esa línea en todas las rutas de API, no solo
en el dashboard, y volví a hacer el build para confirmar en la tabla de
salida que todas quedaran marcadas como dinámicas (antes el build
mostraba `○ (Static)` para `/api/dashboard` y `/api/coberturas`, y
después de la corrección mostraba `ƒ (Dynamic)` en todas).

**Qué aprendí:** que "funciona en desarrollo" no es lo mismo que
"funciona en producción", porque Next.js optimiza cosas distintas en
cada modo, y que conviene probar el flujo completo con `npm run build`
+ `npm run start` antes de dar algo por terminado.

---

### 5. Consultas SQL con JOIN para el dashboard

**Qué le pedí:** ayuda para escribir las consultas que alimentan los 4
indicadores y los 3 gráficos del dashboard, agrupando siniestros por
tipo y por mes.

**Qué devolvió la IA:** las consultas con `COUNT`, `GROUP BY` y, para
agrupar por mes, la función `strftime('%Y-%m', fecha)` de SQLite para
extraer año y mes de la columna fecha.

**Qué corregí:** nada en la lógica, pero las probé a mano con
`db/run_queries.mjs` contra la base real para confirmar que los números
coincidieran con los datos cargados antes de usarlas en el dashboard.

**Qué aprendí:** a usar `strftime` en SQLite para trabajar con fechas,
algo que no había usado antes.
