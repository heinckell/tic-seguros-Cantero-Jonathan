// Conexión a la base de datos.
//
// Usamos @libsql/client porque habla el mismo protocolo que SQLite pero
// también sabe conectarse a Turso (una base SQLite "en la nube"). Así el
// mismo código sirve para desarrollar en la compu (archivo local seguros.db)
// y para la versión publicada en Vercel (que no tiene disco donde guardar
// un archivo, por eso ahí se usa Turso).
//
// Si existen las variables de entorno de Turso, nos conectamos a Turso.
// Si no existen (por ejemplo, cuando corremos en nuestra compu), usamos
// el archivo local seguros.db.
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL || "file:./seguros.db";
const authToken = process.env.TURSO_AUTH_TOKEN; // no hace falta si es archivo local

export const db = createClient(
  authToken ? { url, authToken } : { url }
);

// SQLite trae las claves foráneas DESACTIVADAS por defecto en cada
// conexión nueva. Sin esto, se podría borrar un cliente que todavía
// tiene pólizas y quedarían pólizas "huérfanas" apuntando a nada.
// (No usamos top-level await para no depender de esa config de webpack.)
db.execute("PRAGMA foreign_keys = ON").catch((err) =>
  console.error("No se pudo activar foreign_keys:", err.message)
);
