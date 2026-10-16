# 📝 Nota de Continuidad — EazyPlan
## ⚠️ Pendiente de verificación (UI real)

- [ ] **La UI funciona de verdad**: abrir la app en un entorno con GUI y comprobar que:
  - El login redirige a la pestaña **Dietas**.
  - Las 5 pestañas (🥗 Dietas, 💪 Ejercicios, 🛒 Lista de compra, 🤖 IA, ⚙️ Configuración) cargan datos de ejemplo.
  - Los CRUD funcionan y persisten en H2.
- [ ] Probar el **registro** de un usuario nuevo (solo se probó login con `demo`).
- [ ] Comprobar la pestaña de **IA** (modo local y, si hay clave, modo OpenAI).

> En esta máquina no hay GUI instalada (`Xvfb` ausente), así que Electron corre en headless: arranca bien pero no se puede ver la ventana. La lógica del backend y el arranque están verificados; falta comprobar la UI visualmente.
**Fecha:** lunes, 21 septiembre 2026
**Última actualización:** martes, 22 septiembre 2026
**Estado:** Backend ARRANCADO y verificado ✅. Electron arranca sin errores ✅. Pendiente: **verificar la UI real** (las pestañas cargando datos) — en headless no hay ventana gráfica.

---

## ✅ Qué ya está hecho

### Estructura del proyecto (`~/Proyectos/Apps/EazyPlan/`)
```
EazyPlan/
├── backend/          # Spring Boot 3.4 + Java 25 (puerto 8080, contexto /api)
│   ├── pom.xml
│   ├── mvnw + .mvn/wrapper/   # Maven wrapper generado (3.9.16)
│   └── src/main/java/com/eazyplan/
│       ├── EazyPlanApplication.java
│       ├── config/    CorsConfig, DataInitializer, WebMvcConfig
│       ├── controller/  AuthController, DietController, ExerciseController,
│       │              ShoppingItemController, IaController, GlobalExceptionHandler
│       ├── model/     User, Diet, Exercise, ShoppingItem
│       ├── repository/ UserRepository + 3 repos
│       ├── service/   AuthService, DietService, ExerciseService, ShoppingItemService
│       ├── security/  JwtService, JwtAuthenticationFilter, CustomUser, SecurityConfig
│       └── dto/       LoginRequest, RegisterRequest, AuthResponse
│   └── src/main/resources/
│       ├── application.properties
│       └── static/dist/    # frontend compilado (copiado)
├── frontend/         # React 19 + Vite + TS + Tailwind (puerto 5173 en dev)
│   ├── package.json (dependencias instaladas, compila OK)
│   └── src/
│       ├── api/     client.ts, authService.ts, services.ts, types.ts
│       ├── context/AuthContext.tsx
│       └── pages/   Login, Dashboard, DietasPage, EjerciciosPage,
│                      ListaCompraPage, IaPage, ConfiguracionPage
├── electron/         # Lanzador desktop (Electron instalado)
│   ├── package.json (sin postinstall problemático)
│   ├── main.js      # arranca backend + ventana Electron
│   └── dev.js       # modo desarrollo
├── README.md        # documentación completa
└── NOTA_CONTINUACION.md  # este archivo
```

### Funcionalidades implementadas
- ✅ Login/registro con **JWT** (HS256)
- ✅ Al entrar redirige a pestaña **Dietas**
- ✅ 5 pestañas: 🥗 Dietas, 💪 Ejercicios, 🛒 Lista de compra, 🤖 IA, ⚙️ Configuración
- ✅ CRUD completo para dietas, ejercicios y productos de compra
- ✅ Asistente IA con fallback local (sin API key) y modo OpenAI (con API key)
- ✅ Datos de ejemplo precargados: **usuario `demo` / contraseña `1234`**
- ✅ Tailwind con diseño responsive

---

## 🚫 El problema actual — RESUELTO

Anteriormente, al arrancar el backend con `mvn spring-boot:run` fallaba con:
```
Unsupported class file major version 69
```

**Causa:** Java 25 = "major version 69". Spring Boot **3.4.1** no soporta Java 25 en su plugin de ejecución.

**Solución aplicada:** Subir `spring-boot-starter-parent` a **3.5.16** (compatible con Java 25) en `backend/pom.xml`. Java sigue siendo el 25 (`/usr/lib/jvm/java-25-openjdk`).

**Verificación (2026-09-22):**
- ✅ `mvn clean compile` compila sin errores.
- ✅ Backend arranca en Tomcat puerto **8080**, contexto `/api`, con H2 en memoria y datos precargados.
- ✅ Login `demo`/`1234` devuelve un JWT válido (HS256).

**Entorno disponible:**
- Java 25 (`/usr/lib/jvm/java-25-openjdk`).
- Maven 3.9.16 en `/home/santipg/.local/opt/maven` (añadir al PATH).

---

## 🔧 Qué falta por hacer (mañana)

### 1. ✅ ARREGLO DE COMPATIBILIDAD JAVA 25 — HECHO
Subir Spring Boot a una versión compatible con Java 25.

- Editar `backend/pom.xml` → `<version>3.4.1</version>` → **`<version>3.5.16</version>`**.
- Compilar: `mvn -q clean compile` (OK).
- Arrancar: `./mvnw spring-boot:run` y comprobar:
  ```bash
  curl http://localhost:8080/api/auth/me   # requiere header Authorization
  curl -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"demo","password":"1234"}'
  ```

> Nota: `jjwt 0.12.6`, `h2 2.3.232` y los starters ya están en caché para 3.4.1; al subir de versión Maven descargará las nuevas.

### 2. ✅ Verificar el arranque completo — HECHO
- [x] Backend responde en `http://localhost:8080/api`
- [x] Login con `demo`/`1234` devuelve un JWT válido
- [ ] Las pestañas de Dietas/Ejercicios/Listade compra cargan datos de ejemplo (probar UI)

### 3. Probar el lanzador Electron — HECHO (con matices)
```bash
cd ~/Proyectos/Apps/EazyPlan/electron
npm start        # app desktop completa (arranca backend + ventana)
# o: npm run dev  # modo desarrollo con Vite en 5173
```

**Verificación (2026-09-22):**
- ✅ Electron arranca sin errores (`./node_modules/.bin/electron .`).
- ✅ En modo dev: Vite responde en `http://localhost:5173` y el backend en 8080.
- ✅ En producción: backend listo, app cargada desde `http://localhost:8080/api`.

**Bugs encontrados y corregidos hoy:**

1. **`main.js` tenía sintaxis de TypeScript** (`ChildProcess | null`, `new Promise<void>`).
   Node/Electron ejecutan `.js` sin transpilar → `SyntaxError: Unexpected token`. Se limpiaron las anotaciones de tipo.
2. **En headless, la ventana se cierra al instante y el handler `window-all-closed` mataba el backend.**
   Separé el ciclo de vida del backend de las ventanas: ahora el servidor sigue corriendo aunque se cierren ventanas (solo mata a Vite).
3. **Bug en `/auth/me`:** el controlador pasaba el *token* JWT como si fuera un username → "Usuario no encontrado".
   Corregido: extraer el username con `jwtService.extractUsername(token)` antes de consultar la DB.

> Nota: para arrancar Electron y que sobreviva entre terminales, usar `setsid` (un `nohup &` normal se apaga al cerrar la shell).

---

## 📌 Comandos útiles

| Tarea | Comando |
|-------|---------|
| Arrancar backend | `cd backend && export PATH="$PATH:/home/santipg/.local/opt/maven/bin" && ./mvnw spring-boot:run` |
| Compilar frontend | `cd frontend && npm run build` |
| Dev frontend | `cd frontend && npm run dev` (puerto 5173) |
| Preview prod frontend | `cd frontend && npm run preview` (puerto 8081) |
| Arrancar Electron | `cd electron && npm start` |
| Consola H2 | http://localhost:8080/api/h2-console |

---

## ⚙️ Notas de configuración

- **JWT:** cambiar `jwt.secret` en `application.properties` antes de producción.
- **IA:** si se quiere conectar a OpenAI, rellenar `ai.api-key` en `application.properties`. Sin clave → modo local.
- **Frontend → Backend:** variable `VITE_API_URL` (defecto `http://localhost:8080/api`).

---

## ✅ Checklist final al terminar
- [x] Backend arranca sin errores con Java 25 (Spring Boot 3.5.16)
- [x] Login funciona y devuelve JWT
- [x] `/auth/me` corregido (extrae username del token)
- [ ] Verificar UI: las 5 pestañas cargan datos de ejemplo (requiere GUI)
- [x] Electron lanza la app desktop completa (verificado en headless)
- [ ] Probar registro + pestaña IA
- [ ] README actualizado si ha cambiado algo
