import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

// Esta ruta siempre debe leer la base en el momento: sin esto, Next.js
// puede "congelar" la respuesta como página estática en el build de
// producción y el dashboard dejaría de actualizarse.
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const result = await db.execute({
    sql: "SELECT * FROM poliza WHERE id_poliza = ?",
    args: [params.id],
  });
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Póliza no encontrada." }, { status: 404 });
  }
  return NextResponse.json(result.rows[0]);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const { numero_poliza, id_cliente, fecha_inicio, fecha_fin, estado } = body;

  if (!numero_poliza || !id_cliente) {
    return NextResponse.json(
      { error: "Número de póliza y cliente son obligatorios." },
      { status: 400 }
    );
  }

  try {
    await db.execute({
      sql: `UPDATE poliza
            SET numero_poliza = ?, id_cliente = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?
            WHERE id_poliza = ?`,
      args: [numero_poliza, id_cliente, fecha_inicio || null, fecha_fin || null, estado, params.id],
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return NextResponse.json({ error: "Ya existe otra póliza con ese número." }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// En vez de borrar la póliza (podría tener siniestros/pagos cargados),
// la "baja" la hacemos cambiando su estado a CANCELADA (DELETE lógico).
// Es más realista: una aseguradora no borra el historial de una póliza.
export async function DELETE(_request, { params }) {
  await db.execute({
    sql: "UPDATE poliza SET estado = 'CANCELADA' WHERE id_poliza = ?",
    args: [params.id],
  });
  return NextResponse.json({ ok: true });
}
