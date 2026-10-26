"use client";

import { useEffect, useState } from "react";

const VACIO = { id_poliza: "", fecha: "", tipo: "", descripcion: "", estado: "ABIERTO" };

const TIPOS = ["Caída", "Accidente de tránsito", "Golpe deportivo", "Quemadura", "Otro"];

function claseBadge(estado) {
  return estado === "CERRADO" ? "badge badge-cerrado" : "badge badge-abierto";
}

export default function SiniestrosPage() {
  const [siniestros, setSiniestros] = useState([]);
  const [polizas, setPolizas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState("");

  async function cargar(q = "") {
    const url = q ? `/api/siniestros?q=${encodeURIComponent(q)}` : "/api/siniestros";
    const res = await fetch(url);
    setSiniestros(await res.json());
  }

  useEffect(() => {
    cargar();
    fetch("/api/polizas").then((r) => r.json()).then(setPolizas);
  }, []);

  function nuevoSiniestro() {
    setForm(VACIO);
    setEditandoId(null);
    setMostrarForm(true);
    setError("");
  }

  function editarSiniestro(s) {
    setForm({
      id_poliza: s.id_poliza,
      fecha: s.fecha,
      tipo: s.tipo,
      descripcion: s.descripcion || "",
      estado: s.estado,
    });
    setEditandoId(s.id_siniestro);
    setMostrarForm(true);
    setError("");
  }

  async function guardar(e) {
    e.preventDefault();
    setError("");
    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `/api/siniestros/${editandoId}` : "/api/siniestros";
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

  async function eliminar(s) {
    if (!confirm(`¿Eliminar el siniestro #${s.id_siniestro}?`)) return;
    await fetch(`/api/siniestros/${s.id_siniestro}`, { method: "DELETE" });
    cargar(busqueda);
  }

  function buscar(e) {
    e.preventDefault();
    cargar(busqueda);
  }

  return (
    <div>
      <h1>Siniestros</h1>
      <p className="subtitulo">Registrar y actualizar el estado de los siniestros de cada póliza.</p>

      <div className="toolbar">
        <form className="buscador" onSubmit={buscar}>
          <input
            placeholder="Buscar por póliza o tipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </form>
        <button className="btn" onClick={nuevoSiniestro}>+ Nuevo siniestro</button>
      </div>

      {error && <div className="mensaje-error">{error}</div>}

      {mostrarForm && (
        <form className="form-box" onSubmit={guardar}>
          <h2 style={{ marginTop: 0 }}>{editandoId ? "Editar siniestro" : "Nuevo siniestro"}</h2>

          <label>Póliza</label>
          <select
            value={form.id_poliza}
            onChange={(e) => setForm({ ...form, id_poliza: e.target.value })}
            required
          >
            <option value="">Seleccionar...</option>
            {polizas.map((p) => (
              <option key={p.id_poliza} value={p.id_poliza}>
                {p.numero_poliza} - {p.cliente}
              </option>
            ))}
          </select>

          <label>Fecha</label>
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            required
          />

          <label>Tipo</label>
          <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} required>
            <option value="">Seleccionar...</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <label>Descripción</label>
          <textarea
            rows={3}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <label>Estado</label>
          <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
            <option value="ABIERTO">ABIERTO</option>
            <option value="CERRADO">CERRADO</option>
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
            <th>Póliza</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {siniestros.map((s) => (
            <tr key={s.id_siniestro}>
              <td>{s.numero_poliza}</td>
              <td>{s.cliente}</td>
              <td>{s.fecha}</td>
              <td>{s.tipo}</td>
              <td><span className={claseBadge(s.estado)}>{s.estado}</span></td>
              <td className="acciones">
                <button className="btn" onClick={() => editarSiniestro(s)}>Editar</button>
                <button className="btn btn-peligro" onClick={() => eliminar(s)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {siniestros.length === 0 && (
            <tr>
              <td colSpan={6}>No se encontraron siniestros.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
