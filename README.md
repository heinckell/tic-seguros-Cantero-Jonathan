# TIC - Sistema Web de Seguros de Accidentes Personales

Trabajo integrador cuatrimestral — ISFT N.º 199 — Tecnicatura en
Inteligencia Artificial / Ciencia de Datos.

Sistema web para gestionar clientes, pólizas, coberturas, pagos y
siniestros de una aseguradora de accidentes personales, con un
dashboard de indicadores en vivo.

## Stack

- **Front-end / Back-end**: Next.js 14 (App Router), JavaScript.
- **Base de datos**: SQLite en local (`seguros.db`) / Turso (libSQL) en
  producción — mismo código para los dos, cambia solo la variable de
  entorno.
- **Gráficos**: Recharts.
- **Hosting**: Vercel (plan free).

## Estructura del proyecto

```
seguros-app/
├── app/
│   ├── api/              # Rutas de API (clientes, polizas, siniestros, coberturas, dashboard)
│   ├── clientes/         # Pantalla CRUD de Clientes
│   ├── polizas/          # Pantalla CRUD de Pólizas
│   ├── siniestros/       # Pantalla CRUD de Siniestros
│   └── page.js           # Dashboard (INICIO)
├── components/NavBar.js
├── db/
│   ├── schema.sql         # Script de creación de tablas
│   ├── seed_data.mjs      # Datos de prueba
│   ├── init.mjs           # Crea tablas + carga datos
│   ├── queries.sql        # 8 consultas básicas + 3 JOIN pedidas por la consigna
│   └── run_queries.mjs    # Corre queries.sql contra la base y muestra el resultado
├── docs/
│   ├── der.png             # Diagrama entidad-relación
│   ├── documento_explicativo.md
│   └── bitacora_ia.md
├── lib/db.js               # Conexión a la base (local o Turso)
└── seguros.db              # Base SQLite local, ya cargada con datos de prueba
```

## Correrlo en local

```bash
npm install
npm run db:init      # crea las tablas y carga los datos de prueba en seguros.db
npm run dev           # http://localhost:3000
```

Para ver las 8 consultas básicas + las 3 JOIN corriendo contra la base real:

```bash
npm run db:queries
```

## Publicarlo (Turso + GitHub + Vercel)

Esta parte requiere cuentas personales (Turso, GitHub, Vercel), así que
son los pasos que hay que seguir manualmente:

### 1. Crear la base en Turso

1. Crear una cuenta gratuita en [turso.tech](https://turso.tech).
2. Instalar la CLI de Turso y loguearse (los comandos están en su
   documentación oficial, "Quickstart").
3. Crear una base nueva, por ejemplo:
   ```bash
   turso db create seguros-tic
   ```
4. Subir el esquema y los datos de la base local a Turso:
   ```bash
   turso db shell seguros-tic < db/schema.sql
   ```
   Después, para los datos, lo más simple es correr `npm run db:init`
   una vez apuntando las variables de entorno (ver paso 4) a la base de
   Turso en vez de a la local, para que el mismo script de carga
   inserte los datos ahí.
5. Conseguir la URL y el token de conexión:
   ```bash
   turso db show seguros-tic --url
   turso db tokens create seguros-tic
   ```

### 2. Subir el proyecto a GitHub

```bash
cd seguros-app
git init
git add .
git commit -m "TIC - Sistema de Seguros de Accidentes Personales"
```

Crear un repositorio nuevo en GitHub (por ejemplo
`tic-seguros-apellido-apellido`) y seguir las instrucciones que da
GitHub para "push an existing repository":

```bash
git remote add origin https://github.com/TU_USUARIO/tic-seguros-apellido-apellido.git
git branch -M main
git push -u origin main
```

**Importante**: `seguros.db` ya está commiteado porque es la base
local de prueba que pide la consigna como entregable, pero las
credenciales de Turso (paso 1) NUNCA deben subirse al repositorio. El
archivo `.env.local` con esas credenciales no se commitea (ya está en
`.gitignore`).

### 3. Deployar en Vercel

1. Crear cuenta gratuita en [vercel.com](https://vercel.com) (se puede
   loguear directo con la cuenta de GitHub).
2. "Add New... → Project" y elegir el repositorio recién subido.
3. Vercel detecta solo que es un proyecto Next.js, no hace falta tocar
   nada de la configuración de build.
4. Antes de darle "Deploy", ir a **Environment Variables** y cargar:
   - `TURSO_DATABASE_URL` → la URL que dio `turso db show` en el paso 1.
   - `TURSO_AUTH_TOKEN` → el token que dio `turso db tokens create`.
5. Deploy. Vercel da una URL pública (`https://tic-seguros-....vercel.app`)
   — esa es la URL que hay que entregar.

Con esas dos variables de entorno cargadas, `lib/db.js` se conecta
automáticamente a Turso en vez de al archivo local, sin cambiar nada de
código.

## Demo (lo que se muestra en la defensa)

1. Crear un cliente nuevo desde la pantalla **Clientes** → confirmar que
   aparece en la tabla / buscarlo.
2. Crear una póliza nueva para ese cliente desde **Pólizas** (el
   cliente se elige de un combo, no se escribe a mano).
3. Registrar un siniestro para esa póliza desde **Siniestros**, con
   estado ABIERTO.
4. Ver el **Dashboard** (INICIO) y anotar los indicadores.
5. Volver a Siniestros, editar ese siniestro y cambiar su estado a
   CERRADO.
6. Volver al Dashboard y mostrar que "Siniestros abiertos" bajó uno y
   "Siniestros cerrados" subió uno — confirma que los indicadores salen
   de consultas reales, no de números fijos en el código.

## Entregables

- URL pública de Vercel.
- Repositorio de GitHub.
- `seguros.db` (ya en el repo).
- `db/schema.sql`, `db/seed_data.mjs` / `db/init.mjs`, `db/queries.sql`.
- `docs/der.png`.
- Código fuente completo (este repositorio).
- `docs/documento_explicativo.md`.
- `docs/bitacora_ia.md`.
