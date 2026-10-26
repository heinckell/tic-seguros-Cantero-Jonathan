import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

// Esta ruta siempre debe leer la base en el momento: sin esto, Next.js
// puede "congelar" la respuesta como página estática en el build de
// producción y el dashboard dejaría de actualizarse.
export const dynamic = "force-dynamic";

// Se usa para llenar el combo de "cliente" en el form de Pólizas, y acá
// para listar coberturas (no tiene pantalla de CRUD propia en el menú,
// pero la tabla y sus datos sí existen y se usan).
export async function GET() {
  const result = await db.execute("SELECT * FROM cobertura ORDER BY nombre");
  return NextResponse.json(result.rows);
}
