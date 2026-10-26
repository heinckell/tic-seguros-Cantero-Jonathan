import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

// Esta ruta siempre debe leer la base en el momento: sin esto, Next.js
// puede "congelar" la respuesta como página estática en el build de
// producción y el dashboard dejaría de actualizarse.
export const dynamic = "force-dynamic";

// GET /api/clientes            -> todos los clientes
// GET /api/clientes?q=texto    -> busca por nombre, apellido o DNI
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  let result;
  if (q) {
    const like = `%${q}%`;
    result = await db.execute({
      sql: `SELECT * FROM cliente
            WHERE nombre LIKE ? OR apellido LIKE ? OR dni LIKE ?
            ORDER BY apellido ASC`,
      args: [like, like, like],
    });
  } else {
    result = await db.execute("SELECT * FROM cliente ORDER BY apellido ASC");
  }
  return NextResponse.json(result.rows);
}

// POST /api/clientes  -> crea un cliente nuevo (INSERT real)
export async function POST(request) {
  const body = await request.json();
  const { nombre, apellido, dni, email, telefono } = body;

  if (!nombre || !apellido || !dni) {
    return NextResponse.json(
      { error: "Nombre, apellido y DNI son obligatorios." },
      { status: 400 }
    );
  }

  try {
    const result = await db.execute({
      sql: "INSERT INTO cliente (nombre, apellido, dni, email, telefono) VALUES (?, ?, ?, ?, ?)",
      args: [nombre, apellido, dni, email || null, telefono || null],
    });
    return NextResponse.json(
      { id_cliente: Number(result.lastInsertRowid) },
      { status: 201 }
    );
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return NextResponse.json(
        { error: "Ya existe un cliente con ese DNI." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
