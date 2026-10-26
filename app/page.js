"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";

// Colores simples, uno por estado/categoría. Nada muy elaborado, solo
// para que se distingan las barras/porciones del gráfico.
const COLORES = ["#1e3a5f", "#2e8b57", "#c9822a", "#b3382c", "#6a5acd", "#008080"];

export default function DashboardPage() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setDatos(d);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando dashboard...</p>;
  if (!datos) return <p>No se pudo cargar el dashboard.</p>;

  const { indicadores, polizas_por_estado, siniestros_por_tipo, siniestros_por_mes } = datos;

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="subtitulo">
        Los indicadores y los gráficos se calculan en el momento con consultas SQL
        contra seguros.db, no son valores fijos en el código.
      </p>

      <div className="tarjetas">
        <div className="tarjeta">
          <div className="numero">{indicadores.clientes}</div>
          <div className="etiqueta">Clientes</div>
        </div>
        <div className="tarjeta">
          <div className="numero">{indicadores.polizas_activas}</div>
          <div className="etiqueta">Pólizas activas</div>
        </div>
        <div className="tarjeta">
          <div className="numero">{indicadores.siniestros_abiertos}</div>
          <div className="etiqueta">Siniestros abiertos</div>
        </div>
        <div className="tarjeta">
          <div className="numero">{indicadores.siniestros_cerrados}</div>
          <div className="etiqueta">Siniestros cerrados</div>
        </div>
      </div>

      <h2>Gráficos</h2>
      <div className="graficos">
        <div className="grafico-box">
          <h3>Pólizas por estado</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={polizas_por_estado}
                dataKey="cantidad"
                nameKey="estado"
                outerRadius={80}
                label={(e) => `${e.estado}: ${e.cantidad}`}
              >
                {polizas_por_estado.map((_, i) => (
                  <Cell key={i} fill={COLORES[i % COLORES.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico-box">
          <h3>Siniestros por tipo</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={siniestros_por_tipo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#1e3a5f" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico-box" style={{ gridColumn: "1 / span 2" }}>
          <h3>Siniestros por mes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={siniestros_por_mes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="cantidad" stroke="#b3382c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
