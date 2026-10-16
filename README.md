# EazyPlan 🥗

Tu asistente personal para gestionar dietas, ejercicios físicos y tu lista de compra.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| **Backend** | Spring Boot 3.4 + Java 25 |
| **Frontend** | React 19 + Vite + TypeScript + Tailwind CSS |
| **Desktop** | Electron (lanzador independiente) |
| **Base de datos** | H2 en memoria |
| **Autenticación** | JWT |

## Funcionalidades

La aplicación incluye una pantalla de login/registro y, al acceder, redirige directamente a la pestaña **Dietas**. Dispone de 5 pestañas:

1. 🥗 **Dietas** — Crear y gestionar planes de dieta por día
2. 💪 **Ejercicios** — Biblioteca de ejercicios con series, repeticiones y dificultad
3. 🛒 **Lista de la compra** — Lista semanal organizada por categorías (marcar como comprada)
4. 🤖 **Consulta con la IA** — Asistente para resolver dudas sobre dieta y ejercicio
5. ⚙️ **Configuración** — Información personal y cierre de sesión

## Estructura del proyecto

```
EazyPlan/
├── backend/          # Spring Boot (puerto 8080)
│   └── src/main/java/com/eazyplan/
│       ├── config/   # Seguridad, CORS, datos iniciales
│       ├── controller/
│       ├── model/    # User, Diet, Exercise, ShoppingItem
│       ├── repository/
│       ├── service/
│       ├── security/# JWT + Spring Security
│       └── dto/
├── frontend/         # React 19 (puerto 5173 en dev)
│   └── src/
│       ├── api/      # Cliente axios, servicios, tipos
│       ├── context/  # AuthContext
│       └── pages/    # Login + pestañas
├── electron/         # Lanzador desktop
└── README.md
```

## Requisitos previos

- **Java 25** (OpenJDK)
- **Node.js** 18+ y npm
- Maven (se usa el wrapper `./mvnw` dentro de `backend/`)

## Configuración del entorno

### Backend

El backend se sirve en el puerto `8080` con contexto `/api`.

```bash
cd backend
# Opción A: con Maven global
export PATH="$PATH:/home/santipg/.local/opt/maven/bin"
mvn spring-boot:run

# Opción B: con el wrapper (recomendado)
./mvnw spring-boot:run
```

> La primera vez descargará las dependencias de Maven Central.

### Frontend

```bash
cd frontend
npm install
npm run dev        # arranca en http://localhost:5173
# o para producción:
npm run build
```

El frontend se comunica con el backend a través de la variable `VITE_API_URL`
(por defecto `http://localhost:8080/api`).

## Ejecutar la aplicación

### Modo navegador (desarrollo)

1. Arranca el backend en un terminal (`cd backend && ./mvnw spring-boot:run`)
2. Arranca el frontend en otro (`cd frontend && npm run dev`)
3. Abre `http://localhost:5173`

> Los datos de ejemplo ya vienen precargados: **usuario `demo` / contraseña `1234`**.

### Modo desktop (Electron)

```bash
cd electron
npm install
npm start            # arranca la app desktop completa
# o en modo desarrollo:
npm run dev
```

El lanzador de Electron arranca automáticamente el backend Spring Boot y carga
la interfaz dentro de una ventana independiente del navegador.

## Endpoints del API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Iniciar sesión (devuelve JWT) |
| POST | `/auth/register` | Registrar un nuevo usuario |
| GET | `/auth/me` | Usuario actual |
| GET/POST | `/diets` | Listar / crear dietas |
| GET/PUT/DELETE | `/diets/{id}` | Operaciones con una dieta |
| GET/POST | `/exercises` | Listar / crear ejercicios |
| GET/PUT/DELETE | `/exercises/{id}` | Operaciones con un ejercicio |
| GET/POST | `/shopping` | Listar / crear productos |
| PUT/DELETE | `/shopping/{id}` | Marcar/comprar o eliminar |
| POST | `/ia/chat` | Consulta al asistente de IA |

Todas las rutas salvo `/auth/**` requieren el encabezado
`Authorization: Bearer <token>`.

## Configuración del asistente de IA

En `backend/src/main/resources/application.properties`:

```properties
ai.api-key=sk-tu-clave-aqui      # opcional; si se deja vacía usa el modo local
ai.base-url=https://api.openai.com/v1
ai.model=gpt-4o-mini
```

Si no se configura una API key válida, la IA funciona en **modo local** con
respuestas predefinidas sobre dieta y ejercicio.

## Notas de desarrollo

- La autenticación usa JWT (HS256). En producción es obligatorio cambiar la clave `jwt.secret`.
- Los usuarios se almacenan en H2 en memoria; los datos de ejemplo se cargan al arrancar.
- El frontend compilado (`frontend/dist`) se sirve automáticamente desde el backend, por lo que
  la app desktop puede cargar todo desde un solo servicio.
