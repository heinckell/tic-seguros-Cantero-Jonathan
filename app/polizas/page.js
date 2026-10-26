"use client";

import { useEffect, useState } from "react";

const VACIO = { numero_poliza: "", id_cliente: "", fecha_inicio: "", fecha_fin: "", estado: "ACTIVA" };

function claseBadge(estado) {
  if (estado === "ACTIVA") return "badge badge-activa";
  if (estado === "VENCIDA") return "badge badge-vencida";
  return "badge badge-cancelada";
}

export default function PolizasPage() {
  const [polizas, setPolizas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState("");

  async function cargar(q = "") {
    const url = q ? `/api/polizas?q=${encodeURIComponent(q)}` : "/api/polizas";
    const res = await fetch(url);
    setPolizas(await res.json());
  }

  useEffect(() => {
    cargar();
    fetch("/api/clientes").then((r) => r.json()).then(setClientes);
  }, []);

  function nuevaPoliza() {
    setForm(VACIO);
    setEditandoId(null);
    setMostrarForm(true);
    setError("");
  }

  function editarPoliza(p) {
    setForm({
      numero_poliza: p.numero_poliza,
      id_cliente: p.id_cliente,
      fecha_inicio: p.fecha_inicio || "",
      fecha_fin: p.fecha_fin || "",
      estado: p.estado,
    });
    setEditandoId(p.id_poliza);
    setMostrarForm(true);
    setError("");
  }

  async function guardar(e) {
    e.preventDefault();
    setError("");
    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `/api/polizas/${editandoId}` : "/api/polizas";
    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Ocurrió un error al guardar.");
      return;
    }
    setMostrarForm(false);
    cargar(busqueda);
  }

  async function darDeBaja(p) {
    if (!confirm(`¿Cancelar la póliza ${p.numero_poliza}?`)) return;
    await fetch(`/api/polizas/${p.id_poliza}`, { method: "DELETE" });
    cargar(busqueda);
  }

  function buscar(e) {
    e.preventDefault();
    cargar(busqueda);
  }

  return (
    <div>
      <h1>Pólizas</h1>
      <p className="subtitulo">
        El cliente se elige de una lista (no se escribe a mano), para que siempre
        quede bien relacionado con la tabla cliente.
      </p>

      <div className="toolbar">
        <form className="buscador" onSubmit={buscar}>
          <input
            placeholder="Buscar por número o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </form>
        <button className="btn" onClick={nuevaPoliza}>+ Nueva póliza</button>
      </div>

      {error && <div className="mensaje-error">{error}</div>}

      {mostrarForm && (
        <form className="form-box" onSubmit={guardar}>
          <h2 style={{ marginTop: 0 }}>{editandoId ? "Editar póliza" : "Nueva póliza"}</h2>

          <label>Número de póliza</label>
          <input
            value={form.numero_poliza}
            onChange={(e) => setForm({ ...form, numero_poliza: e.target.value })}
            placeholder="POL-2026-0001"
            required
          />

          <label>Cliente</label>
          <select
            value={form.id_cliente}
            onChange={(e) => setForm({ ...form, id_cliente: e.target.value })}
            required
          >
            <option value="">Seleccionar...</option>
            {clientes.map((c) => (
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.nombre} {c.apellido} (DNI {c.dni})
              </option>
            ))}
          </select>

          <label>Fecha de inicio</label>
          <input
            type="date"
            value={form.fecha_inicio}
            onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
          />

          <label>Fecha de vencimiento</label>
          <input
            type="date"
            value={form.fecha_fin}
            onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
          />

          <label>Estado</label>
          <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
            <option value="ACTIVA">ACTIVA</option>
            <option value="VENCIDA">VENCIDA</option>
            <option value="CANCELADA">CANCELADA</option>
          </select>

          <div style={{ marginTop: 16 }}>
            <button type="submit" className="btn">GUARDAR</button>
            <button type="button" className="btn btn-secundario" onClick={() => setMostrarForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Inicio</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {polizas.map((p) => (
            <tr key={p.id_poliza}>
              <td>{p.numero_poliza}</td>
              <td>{p.cliente}</td>
              <td>{p.fecha_inicio}</td>
              <td>{p.fecha_fin}</td>
              <td><span className={claseBadge(p.estado)}>{p.estado}</span></td>
              <td className="acciones">
                <button className="btn" onClick={() => editarPoliza(p)}>Editar</button>
                <button className="btn btn-peligro" onClick={() => darDeBaja(p)}>Cancelar</button>
              </td>
            </tr>
          ))}
          {polizas.length === 0 && (
            <tr>
              <td colSpan={6}>No se encontraron pólizas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
