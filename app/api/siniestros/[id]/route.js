import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

// Esta ruta siempre debe leer la base en el momento: sin esto, Next.js
// puede "congelar" la respuesta como página estática en el build de
// producción y el dashboard dejaría de actualizarse.
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const result = await db.execute({
    sql: "SELECT * FROM siniestro WHERE id_siniestro = ?",
    args: [params.id],
  });
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Siniestro no encontrado." }, { status: 404 });
  }
  return NextResponse.json(result.rows[0]);
}

// Se usa tanto para editar los datos del siniestro como para el caso
// puntual que pide la consigna: pasar el estado de ABIERTO a CERRADO.
export async function PUT(request, { params }) {
  const body = await request.json();
  const { id_poliza, fecha, tipo, descripcion, estado } = body;

  if (!id_poliza || !fecha || !tipo) {
    return NextResponse.json(
      { error: "Póliza, fecha y tipo son obligatorios." },
      { status: 400 }
    );
  }

  await db.execute({
    sql: `UPDATE siniestro
          SET id_poliza = ?, fecha = ?, tipo = ?, descripcion = ?, estado = ?
          WHERE id_siniestro = ?`,
    args: [id_poliza, fecha, tipo, descripcion || null, estado, params.id],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request, { params }) {
  await db.execute({
    sql: "DELETE FROM siniestro WHERE id_siniestro = ?",
    args: [params.id],
  });
  return NextResponse.json({ ok: true });
}
