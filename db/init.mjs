// Script de inicialización de la base.
// Lee db/schema.sql, crea las tablas en seguros.db y después carga los
// datos de prueba de db/seed_data.mjs.
//
// Uso:  npm run db:init
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@libsql/client";
import { clientes, polizas, coberturas, polizaCobertura, siniestros, pagos } from "./seed_data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Para inicializar siempre usamos el archivo local, aunque exista Turso
// configurado: este script se corre una vez desde la compu del desarrollador
// para generar seguros.db, que después se sube/migra a Turso (ver README).
const db = createClient({ url: "file:" + join(__dirname, "..", "seguros.db") });

async function run() {
  console.log("1) Creando tablas desde schema.sql...");
  const schemaRaw = readFileSync(join(__dirname, "schema.sql"), "utf-8");
  // Sacamos las líneas de comentario ANTES de separar por ";", porque si no,
  // un comentario pegado arriba de un CREATE TABLE hace que se descarte
  // el bloque entero (el comentario y la sentencia quedan juntos).
  const schema = schemaRaw
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  // libsql ejecuta una sentencia por vez; separamos por ";".
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const stmt of statements) {
    await db.execute(stmt);
  }
  console.log(`   ${statements.length} sentencias ejecutadas.`);

  console.log("2) Cargando clientes...");
  for (const c of clientes) {
    await db.execute({
      sql: "INSERT INTO cliente (nombre, apellido, dni, email, telefono) VALUES (?, ?, ?, ?, ?)",
      args: [c.nombre, c.apellido, c.dni, c.email, c.telefono],
    });
  }

  console.log("3) Cargando pólizas...");
  for (const p of polizas) {
    await db.execute({
      sql: "INSERT INTO poliza (numero_poliza, id_cliente, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)",
      args: [p.numero_poliza, p.id_cliente, p.fecha_inicio, p.fecha_fin, p.estado],
    });
  }

  console.log("4) Cargando coberturas...");
  for (const c of coberturas) {
    await db.execute({
      sql: "INSERT INTO cobertura (nombre, descripcion) VALUES (?, ?)",
      args: [c.nombre, c.descripcion],
    });
  }

  console.log("5) Cargando relación póliza-cobertura...");
  for (const pc of polizaCobertura) {
    await db.execute({
      sql: "INSERT INTO poliza_cobertura (id_poliza, id_cobertura) VALUES (?, ?)",
      args: [pc.id_poliza, pc.id_cobertura],
    });
  }

  console.log("6) Cargando siniestros...");
  for (const s of siniestros) {
    await db.execute({
      sql: "INSERT INTO siniestro (id_poliza, fecha, tipo, descripcion, estado) VALUES (?, ?, ?, ?, ?)",
      args: [s.id_poliza, s.fecha, s.tipo, s.descripcion, s.estado],
    });
  }

  console.log("7) Cargando pagos...");
  for (const p of pagos) {
    await db.execute({
      sql: "INSERT INTO pago (id_poliza, fecha, importe, estado) VALUES (?, ?, ?, ?)",
      args: [p.id_poliza, p.fecha, p.importe, p.estado],
    });
  }

  const counts = {};
  for (const t of ["cliente", "poliza", "cobertura", "poliza_cobertura", "siniestro", "pago"]) {
    const r = await db.execute(`SELECT COUNT(*) as n FROM ${t}`);
    counts[t] = r.rows[0].n;
  }
  console.log("\nListo. Filas cargadas por tabla:", counts);
}

run().catch((err) => {
  console.error("Error inicializando la base:", err);
  process.exit(1);
});
