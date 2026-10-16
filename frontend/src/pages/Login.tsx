import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../api/authService'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.username, form.password)
      } else {
        await authService.register({
          username: form.username,
          password: form.password,
          name: form.name,
          email: form.email,
        })
      }
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data || 'Error en la autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-sky-500">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">EazyPlan</h1>
          <p className="text-gray-500 mt-2">Tu asistente de salud y bienestar</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError('') }}
            className={`flex-1 py-2 rounded-md font-semibold transition-colors ${isLogin ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError('') }}
            className={`flex-1 py-2 rounded-md font-semibold transition-colors ${!isLogin ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={form.name}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            </>
          )}
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="input-field"
            required
          />

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        {!isLogin && (
          <p className="text-center text-gray-400 text-xs mt-4">
            Demo: usuario <b>demo</b> / contraseña <b>1234</b>
          </p>
        )}
      </div>
    </div>
  )
}
