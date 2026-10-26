import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

// Esta ruta siempre debe leer la base en el momento: sin esto, Next.js
// puede "congelar" la respuesta como página estática en el build de
// producción y el dashboard dejaría de actualizarse.
export const dynamic = "force-dynamic";

// GET /api/clientes/5 -> un cliente puntual
export async function GET(_request, { params }) {
  const result = await db.execute({
    sql: "SELECT * FROM cliente WHERE id_cliente = ?",
    args: [params.id],
  });
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
  }
  return NextResponse.json(result.rows[0]);
}

// PUT /api/clientes/5 -> UPDATE real
export async function PUT(request, { params }) {
  const body = await request.json();
  const { nombre, apellido, dni, email, telefono } = body;

  if (!nombre || !apellido || !dni) {
    return NextResponse.json(
      { error: "Nombre, apellido y DNI son obligatorios." },
      { status: 400 }
    );
  }

  try {
    await db.execute({
      sql: `UPDATE cliente
            SET nombre = ?, apellido = ?, dni = ?, email = ?, telefono = ?
            WHERE id_cliente = ?`,
      args: [nombre, apellido, dni, email || null, telefono || null, params.id],
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return NextResponse.json(
        { error: "Ya existe otro cliente con ese DNI." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/clientes/5 -> DELETE real.
// Si el cliente tiene pólizas asociadas, SQLite rechaza el borrado por la
// clave foránea: se lo informamos al usuario en vez de romper la base.
export async function DELETE(_request, { params }) {
  try {
    await db.execute({
      sql: "DELETE FROM cliente WHERE id_cliente = ?",
      args: [params.id],
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (String(err.message).includes("FOREIGN KEY")) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar: el cliente tiene pólizas asociadas. Dé de baja sus pólizas primero.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
