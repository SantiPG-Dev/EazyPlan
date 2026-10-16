import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BACKEND_DIR = path.join(ROOT, 'backend')
const FRONTEND_DIR = path.join(ROOT, 'frontend')

// Puerto donde corre el backend Spring Boot (sirve también los estáticos del frontend)
const PORT = process.env.PORT || 8080
const API_URL = `http://localhost:${PORT}/api`
const APP_URL = `http://localhost:${PORT}`

let backendProcess = null
let viteProcess = null

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 700,
    title: 'EazyPlan',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // En modo dev se usa el servidor de Vite; en prod se sirve desde el backend.
  const isDev = process.env.ELENV !== 'production'
  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    // Con context-path=/api, los estáticos del frontend se sirven en /api/
    win.loadURL(`${APP_URL}/api`)
  }

  win.webContents.on('did-finish-load', () => {
    // eslint-disable-next-line no-console
    console.log('[Electron] App cargada desde:', APP_URL)
  })
}

function startBackend() {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === 'win32'
    const mvnCmd = isWindows ? 'mvnw.cmd' : './mvnw'
    const args = ['spring-boot:run', `-Dspring.boot.run.arguments=--server.port=${PORT}`]

    // eslint-disable-next-line no-console
    console.log('[Electron] Arrancando backend Spring Boot...')
    backendProcess = spawn(mvnCmd, args, {
      cwd: BACKEND_DIR,
      stdio: 'inherit',
      shell: isWindows,
    })

    backendProcess.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error('[Electron] Error al arrancar el backend:', err)
      reject(err)
    })

    backendProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        // eslint-disable-next-line no-console
        console.error('[Electron] El backend se cerró con código:', code)
      }
    })

    // Esperamos a que el backend esté listo (polling del puerto)
    const maxAttempts = 60
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      fetch(`${API_URL}/auth/me`)
        .then(() => {
          clearInterval(interval)
          // eslint-disable-next-line no-console
          console.log('[Electron] Backend listo en', APP_URL)
          resolve()
        })
        .catch(() => {
          if (attempts >= maxAttempts) {
            clearInterval(interval)
            reject(new Error('Timeout esperando que el backend esté listo'))
          }
        })
    }, 2000)
  })
}

function startVite() {
  // eslint-disable-next-line no-console
  console.log('[Electron] Arrancando servidor de Vite (dev)...')
  viteProcess = spawn('npm', ['run', 'dev'], {
    cwd: FRONTEND_DIR,
    stdio: 'inherit',
    shell: true,
  })

  viteProcess.on('error', (err) => console.error('[Electron] Error al arrancar Vite:', err))
}

async function main() {
  await app.whenReady()

  try {
    // En modo dev arrancamos Vite; en prod el backend ya sirve los estáticos.
    if (process.env.ELENV !== 'production') {
      startVite()
    }
    await startBackend()
    createWindow()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Electron] Error al iniciar la aplicación:', err)
    app.quit()
  }
}

app.on('window-all-closed', () => {
  // eslint-disable-next-line no-console
  console.log('[Electron] window-all-closed: se mantiene el backend corriendo')
  // El servidor Spring Boot debe seguir sirviendo aunque se cierren ventanas.
  // Solo cerramos la app explícitamente con app.quit() (p. ej. al salir del menú).
  if (viteProcess) {
    viteProcess.kill()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

main()
