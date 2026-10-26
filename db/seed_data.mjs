// Datos de prueba. Son ficticios (inventados para probar el sistema),
// pero coherentes entre sí: fechas que tienen sentido, estados que
// corresponden, importes razonables para un seguro de accidentes
// personales. Se armaron con ayuda de IA y después se revisaron a mano
// (ver bitacora_ia.md) antes de cargarlos.

export const clientes = [
  { nombre: "Lucía", apellido: "Gómez", dni: "30111222", email: "lucia.gomez@mail.com", telefono: "11-4455-1001" },
  { nombre: "Martín", apellido: "Pereyra", dni: "28555666", email: "martin.pereyra@mail.com", telefono: "11-4455-1002" },
  { nombre: "Ana", apellido: "Acosta", dni: "33222111", email: "ana.acosta@mail.com", telefono: "11-4455-1003" },
  { nombre: "Diego", apellido: "Fernández", dni: "27888999", email: "diego.fernandez@mail.com", telefono: "11-4455-1004" },
  { nombre: "Rocío", apellido: "Alvarez", dni: "35444333", email: "rocio.alvarez@mail.com", telefono: "11-4455-1005" },
  { nombre: "Facundo", apellido: "Medina", dni: "31777888", email: "facundo.medina@mail.com", telefono: "11-4455-1006" },
  { nombre: "Valentina", apellido: "Rojas", dni: "36000111", email: "valentina.rojas@mail.com", telefono: "11-4455-1007" },
  { nombre: "Ignacio", apellido: "Torres", dni: "29333444", email: "ignacio.torres@mail.com", telefono: "11-4455-1008" },
  { nombre: "Camila", apellido: "Aguirre", dni: "34222555", email: "camila.aguirre@mail.com", telefono: "11-4455-1009" },
  { nombre: "Santiago", apellido: "Juárez", dni: "32666777", email: "santiago.juarez@mail.com", telefono: "11-4455-1010" },
];

// id_cliente es el índice (empezando en 1) del array de clientes de arriba.
export const polizas = [
  { numero_poliza: "POL-2025-0001", id_cliente: 1, fecha_inicio: "2025-02-01", fecha_fin: "2026-02-01", estado: "ACTIVA" },
  { numero_poliza: "POL-2025-0002", id_cliente: 2, fecha_inicio: "2025-03-15", fecha_fin: "2026-03-15", estado: "ACTIVA" },
  { numero_poliza: "POL-2024-0003", id_cliente: 3, fecha_inicio: "2024-06-01", fecha_fin: "2025-06-01", estado: "VENCIDA" },
  { numero_poliza: "POL-2025-0004", id_cliente: 4, fecha_inicio: "2025-05-10", fecha_fin: "2026-05-10", estado: "ACTIVA" },
  { numero_poliza: "POL-2025-0005", id_cliente: 5, fecha_inicio: "2025-07-20", fecha_fin: "2026-07-20", estado: "ACTIVA" },
  { numero_poliza: "POL-2024-0006", id_cliente: 6, fecha_inicio: "2024-09-01", fecha_fin: "2025-09-01", estado: "CANCELADA" },
  { numero_poliza: "POL-2025-0007", id_cliente: 7, fecha_inicio: "2025-08-05", fecha_fin: "2026-08-05", estado: "ACTIVA" },
  { numero_poliza: "POL-2025-0008", id_cliente: 8, fecha_inicio: "2025-09-12", fecha_fin: "2026-09-12", estado: "ACTIVA" },
  { numero_poliza: "POL-2025-0009", id_cliente: 9, fecha_inicio: "2025-01-10", fecha_fin: "2026-01-10", estado: "ACTIVA" },
  { numero_poliza: "POL-2025-0010", id_cliente: 10, fecha_inicio: "2025-10-01", fecha_fin: "2026-10-01", estado: "ACTIVA" },
];

export const coberturas = [
  { nombre: "Muerte accidental", descripcion: "Indemnización a beneficiarios por fallecimiento a causa de un accidente." },
  { nombre: "Invalidez total y permanente", descripcion: "Cobertura por incapacidad total e irreversible a causa de un accidente." },
  { nombre: "Invalidez parcial y permanente", descripcion: "Cobertura por incapacidad parcial a causa de un accidente." },
  { nombre: "Gastos médicos y farmacéuticos", descripcion: "Reintegro de gastos médicos derivados de un accidente cubierto." },
  { nombre: "Asistencia al viajero", descripcion: "Asistencia médica y logística durante viajes dentro y fuera del país." },
];

// id_poliza / id_cobertura según el orden de los arrays de arriba.
// Cada póliza tiene entre 1 y 3 coberturas contratadas.
export const polizaCobertura = [
  { id_poliza: 1, id_cobertura: 1 }, { id_poliza: 1, id_cobertura: 2 },
  { id_poliza: 2, id_cobertura: 1 },
  { id_poliza: 3, id_cobertura: 4 },
  { id_poliza: 4, id_cobertura: 1 }, { id_poliza: 4, id_cobertura: 4 }, { id_poliza: 4, id_cobertura: 5 },
  { id_poliza: 5, id_cobertura: 2 }, { id_poliza: 5, id_cobertura: 3 },
  { id_poliza: 6, id_cobertura: 1 },
  { id_poliza: 7, id_cobertura: 4 }, { id_poliza: 7, id_cobertura: 5 },
  { id_poliza: 8, id_cobertura: 1 }, { id_poliza: 8, id_cobertura: 3 },
  { id_poliza: 9, id_cobertura: 2 },
  { id_poliza: 10, id_cobertura: 1 }, { id_poliza: 10, id_cobertura: 4 },
];

export const siniestros = [
  { id_poliza: 1, fecha: "2025-04-12", tipo: "Caída", descripcion: "Caída en la vía pública, fractura de muñeca.", estado: "CERRADO" },
  { id_poliza: 2, fecha: "2025-05-03", tipo: "Accidente de tránsito", descripcion: "Choque en moto, golpe en la pierna.", estado: "CERRADO" },
  { id_poliza: 4, fecha: "2025-06-18", tipo: "Golpe deportivo", descripcion: "Esguince de tobillo jugando al fútbol.", estado: "ABIERTO" },
  { id_poliza: 5, fecha: "2025-08-02", tipo: "Caída", descripcion: "Caída en escalera del trabajo.", estado: "ABIERTO" },
  { id_poliza: 7, fecha: "2025-08-22", tipo: "Quemadura", descripcion: "Quemadura leve en la cocina de su casa.", estado: "CERRADO" },
  { id_poliza: 8, fecha: "2025-09-20", tipo: "Accidente de tránsito", descripcion: "Caída de la bicicleta, golpe en el hombro.", estado: "ABIERTO" },
  { id_poliza: 9, fecha: "2025-02-14", tipo: "Golpe deportivo", descripcion: "Lesión de rodilla practicando running.", estado: "CERRADO" },
  { id_poliza: 1, fecha: "2025-09-30", tipo: "Caída", descripcion: "Nueva caída, golpe en la cadera.", estado: "ABIERTO" },
  { id_poliza: 10, fecha: "2025-10-05", tipo: "Accidente de tránsito", descripcion: "Accidente como peatón, policontusiones leves.", estado: "ABIERTO" },
  { id_poliza: 4, fecha: "2025-07-11", tipo: "Quemadura", descripcion: "Quemadura con agua caliente.", estado: "CERRADO" },
];

export const pagos = [
  { id_poliza: 1, fecha: "2025-02-01", importe: 15000, estado: "PAGADO" },
  { id_poliza: 1, fecha: "2025-05-01", importe: 15000, estado: "PAGADO" },
  { id_poliza: 1, fecha: "2025-08-01", importe: 15000, estado: "PAGADO" },
  { id_poliza: 2, fecha: "2025-03-15", importe: 12000, estado: "PAGADO" },
  { id_poliza: 2, fecha: "2025-06-15", importe: 12000, estado: "PENDIENTE" },
  { id_poliza: 3, fecha: "2024-06-01", importe: 10000, estado: "PAGADO" },
  { id_poliza: 3, fecha: "2024-09-01", importe: 10000, estado: "PAGADO" },
  { id_poliza: 4, fecha: "2025-05-10", importe: 18000, estado: "PAGADO" },
  { id_poliza: 4, fecha: "2025-08-10", importe: 18000, estado: "PAGADO" },
  { id_poliza: 5, fecha: "2025-07-20", importe: 20000, estado: "PAGADO" },
  { id_poliza: 6, fecha: "2024-09-01", importe: 9000, estado: "PAGADO" },
  { id_poliza: 7, fecha: "2025-08-05", importe: 16000, estado: "PAGADO" },
  { id_poliza: 8, fecha: "2025-09-12", importe: 14000, estado: "PENDIENTE" },
  { id_poliza: 9, fecha: "2025-01-10", importe: 13000, estado: "PAGADO" },
  { id_poliza: 10, fecha: "2025-10-01", importe: 17000, estado: "PENDIENTE" },
];
