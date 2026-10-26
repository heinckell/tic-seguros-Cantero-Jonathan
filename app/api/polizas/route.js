import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

// Esta ruta siempre debe leer la base en el momento: sin esto, Next.js
// puede "congelar" la respuesta como página estática en el build de
// producción y el dashboard dejaría de actualizarse.
export const dynamic = "force-dynamic";

// GET /api/polizas -> todas las pólizas, con el nombre del cliente ya
// resuelto (hacemos el JOIN acá para no mandar solo IDs al front-end).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  const base = `
    SELECT p.id_poliza, p.numero_poliza, p.id_cliente,
           c.nombre || ' ' || c.apellido AS cliente,
           p.fecha_inicio, p.fecha_fin, p.estado
    FROM poliza p
    JOIN cliente c ON p.id_cliente = c.id_cliente
  `;

  let result;
  if (q) {
    result = await db.execute({
      sql: base + " WHERE p.numero_poliza LIKE ? OR c.nombre LIKE ? OR c.apellido LIKE ? ORDER BY p.numero_poliza",
      args: [`%${q}%`, `%${q}%`, `%${q}%`],
    });
  } else {
    result = await db.execute(base + " ORDER BY p.numero_poliza");
  }
  return NextResponse.json(result.rows);
}

// POST /api/polizas -> INSERT real
export async function POST(request) {
  const body = await request.json();
  const { numero_poliza, id_cliente, fecha_inicio, fecha_fin, estado } = body;

  if (!numero_poliza || !id_cliente) {
    return NextResponse.json(
      { error: "Número de póliza y cliente son obligatorios." },
      { status: 400 }
    );
  }

  try {
    const result = await db.execute({
      sql: `INSERT INTO poliza (numero_poliza, id_cliente, fecha_inicio, fecha_fin, estado)
            VALUES (?, ?, ?, ?, ?)`,
      args: [numero_poliza, id_cliente, fecha_inicio || null, fecha_fin || null, estado || "ACTIVA"],
    });
    return NextResponse.json({ id_poliza: Number(result.lastInsertRowid) }, { status: 201 });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return NextResponse.json({ error: "Ya existe una póliza con ese número." }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
