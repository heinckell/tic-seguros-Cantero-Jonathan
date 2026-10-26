// Ejecuta cada consulta de db/queries.sql contra seguros.db y muestra
// el resultado por consola. Sirve para comprobar que las consultas
// obligatorias (Parte 5) funcionan de verdad contra la base cargada.
//
// Uso:  npm run db:queries
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@libsql/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = createClient({ url: "file:" + join(__dirname, "..", "seguros.db") });

const raw = readFileSync(join(__dirname, "queries.sql"), "utf-8");

// Partimos el archivo en bloques separados por línea en blanco, cada uno
// con sus líneas de comentario (el título) seguidas de la consulta.
const blocks = raw
  .split(/\n\s*\n/)
  .map((b) => b.trim())
  .filter(Boolean);

function printTable(rows) {
  if (rows.length === 0) {
    console.log("  (sin resultados)");
    return;
  }
  const cols = Object.keys(rows[0]);
  console.log("  " + cols.join(" | "));
  for (const r of rows) {
    console.log("  " + cols.map((c) => String(r[c])).join(" | "));
  }
}

async function run() {
  let n = 0;
  for (const block of blocks) {
    const lines = block.split("\n");
    const comentarios = lines.filter((l) => l.trim().startsWith("--"));
    const sqlLines = lines.filter((l) => !l.trim().startsWith("--"));
    const sql = sqlLines.join("\n").trim().replace(/;$/, "");
    if (!sql) continue; // bloque que era solo un separador de sección
    n++;
    const titulo = comentarios.map((c) => c.replace(/^--\s?/, "")).join(" ");
    console.log(`\n[${n}] ${titulo}`);
    console.log("  SQL: " + sql.replace(/\s+/g, " "));
    try {
      const result = await db.execute(sql);
      printTable(result.rows);
    } catch (err) {
      console.log("  ERROR: " + err.message);
    }
  }
}

run();
