#!/usr/bin/env node
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Arrancamos el frontend en modo dev (Vite) y dejamos que main.js arranque el backend.
process.env.ELENV = process.env.ELENV || 'development'

console.log('[Dev] Arrancando Electron en modo desarrollo...')
const electronPath = path.join(ROOT, 'electron', 'node_modules', '.bin', 'electron')
const appPath = path.join(ROOT, 'electron', 'main.js')

const child = spawn(electronPath, [appPath], {
  cwd: ROOT,
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code) => process.exit(code || 0))
