"use client";

import { useEffect, useState } from "react";

const VACIO = { nombre: "", apellido: "", dni: "", email: "", telefono: "" };

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function cargar(q = "") {
    const url = q ? `/api/clientes?q=${encodeURIComponent(q)}` : "/api/clientes";
    const res = await fetch(url);
    setClientes(await res.json());
  }

  useEffect(() => {
    cargar();
  }, []);

  function nuevoCliente() {
    setForm(VACIO);
    setEditandoId(null);
    setMostrarForm(true);
    setError("");
  }

  function editarCliente(c) {
    setForm({
      nombre: c.nombre,
      apellido: c.apellido,
      dni: c.dni,
      email: c.email || "",
      telefono: c.telefono || "",
    });
    setEditandoId(c.id_cliente);
    setMostrarForm(true);
    setError("");
  }

  async function guardar(e) {
    e.preventDefault();
    setError("");
    setOk("");
    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `/api/clientes/${editandoId}` : "/api/clientes";
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
    setOk(editandoId ? "Cliente actualizado." : "Cliente creado.");
    setMostrarForm(false);
    cargar(busqueda);
  }

  async function eliminar(c) {
    if (!confirm(`¿Dar de baja a ${c.nombre} ${c.apellido}?`)) return;
    const res = await fetch(`/api/clientes/${c.id_cliente}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    cargar(busqueda);
  }

  function buscar(e) {
    e.preventDefault();
    cargar(busqueda);
  }

  return (
    <div>
      <h1>Clientes</h1>
      <p className="subtitulo">Alta, consulta, edición y baja de clientes.</p>

      <div className="toolbar">
        <form className="buscador" onSubmit={buscar}>
          <input
            placeholder="Buscar por nombre, apellido o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </form>
        <button className="btn" onClick={nuevoCliente}>+ Nuevo cliente</button>
      </div>

      {error && <div className="mensaje-error">{error}</div>}
      {ok && <div className="mensaje-ok">{ok}</div>}

      {mostrarForm && (
        <form className="form-box" onSubmit={guardar}>
          <h2 style={{ marginTop: 0 }}>{editandoId ? "Editar cliente" : "Nuevo cliente"}</h2>

          <label>Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />

          <label>Apellido</label>
          <input value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} required />

          <label>DNI</label>
          <input value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} required />

          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <label>Teléfono</label>
          <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />

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
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id_cliente}>
              <td>{c.nombre}</td>
              <td>{c.apellido}</td>
              <td>{c.dni}</td>
              <td>{c.email}</td>
              <td>{c.telefono}</td>
              <td className="acciones">
                <button className="btn" onClick={() => editarCliente(c)}>Editar</button>
                <button className="btn btn-peligro" onClick={() => eliminar(c)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {clientes.length === 0 && (
            <tr>
              <td colSpan={6}>No se encontraron clientes.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
