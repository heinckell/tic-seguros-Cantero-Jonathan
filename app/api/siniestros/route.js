import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

// Esta ruta siempre debe leer la base en el momento: sin esto, Next.js
// puede "congelar" la respuesta como página estática en el build de
// producción y el dashboard dejaría de actualizarse.
export const dynamic = "force-dynamic";

const base = `
  SELECT s.id_siniestro, s.id_poliza, p.numero_poliza,
         c.nombre || ' ' || c.apellido AS cliente,
         s.fecha, s.tipo, s.descripcion, s.estado
  FROM siniestro s
  JOIN poliza p ON s.id_poliza = p.id_poliza
  JOIN cliente c ON p.id_cliente = c.id_cliente
`;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  let result;
  if (q) {
    result = await db.execute({
      sql: base + " WHERE p.numero_poliza LIKE ? OR s.tipo LIKE ? ORDER BY s.fecha DESC",
      args: [`%${q}%`, `%${q}%`],
    });
  } else {
    result = await db.execute(base + " ORDER BY s.fecha DESC");
  }
  return NextResponse.json(result.rows);
}

export async function POST(request) {
  const body = await request.json();
  const { id_poliza, fecha, tipo, descripcion, estado } = body;

  if (!id_poliza || !fecha || !tipo) {
    return NextResponse.json(
      { error: "Póliza, fecha y tipo son obligatorios." },
      { status: 400 }
    );
  }

  try {
    const result = await db.execute({
      sql: `INSERT INTO siniestro (id_poliza, fecha, tipo, descripcion, estado)
            VALUES (?, ?, ?, ?, ?)`,
      args: [id_poliza, fecha, tipo, descripcion || null, estado || "ABIERTO"],
    });
    return NextResponse.json({ id_siniestro: Number(result.lastInsertRowid) }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
