import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

// Esta ruta siempre debe leer la base en el momento: sin esto, Next.js
// puede "congelar" la respuesta como página estática en el build de
// producción y el dashboard dejaría de actualizarse.
export const dynamic = "force-dynamic";

// Todo lo que devuelve este endpoint sale de consultas SQL contra
// seguros.db en el momento del pedido: ningún número está escrito a
// mano en el código, tal como pide la consigna (Parte 8, punto 17).
export async function GET() {
  const [clientes, polizasActivas, siniestrosAbiertos, siniestrosCerrados, porEstado, porTipo, porMes] =
    await Promise.all([
      db.execute("SELECT COUNT(*) AS n FROM cliente"),
      db.execute("SELECT COUNT(*) AS n FROM poliza WHERE estado = 'ACTIVA'"),
      db.execute("SELECT COUNT(*) AS n FROM siniestro WHERE estado = 'ABIERTO'"),
      db.execute("SELECT COUNT(*) AS n FROM siniestro WHERE estado = 'CERRADO'"),
      db.execute("SELECT estado, COUNT(*) AS cantidad FROM poliza GROUP BY estado"),
      db.execute("SELECT tipo, COUNT(*) AS cantidad FROM siniestro GROUP BY tipo ORDER BY cantidad DESC"),
      db.execute(`SELECT strftime('%Y-%m', fecha) AS mes, COUNT(*) AS cantidad
                  FROM siniestro GROUP BY mes ORDER BY mes`),
    ]);

  return NextResponse.json({
    indicadores: {
      clientes: clientes.rows[0].n,
      polizas_activas: polizasActivas.rows[0].n,
      siniestros_abiertos: siniestrosAbiertos.rows[0].n,
      siniestros_cerrados: siniestrosCerrados.rows[0].n,
    },
    polizas_por_estado: porEstado.rows,
    siniestros_por_tipo: porTipo.rows,
    siniestros_por_mes: porMes.rows,
  });
}
