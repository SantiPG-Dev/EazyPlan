import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User } from '../api/types'

export default function ConfiguracionPage() {
  const { user, logout } = useAuth()
  const [form, setForm] = useState<User>({
    id: user?.id || 0,
    username: user?.username || '',
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age,
    weightKg: user?.weightKg,
    heightCm: user?.heightCm,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value === '' ? undefined : Number(e.target.value) })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800">⚙️ Configuración</h2>

      <div className="card">
        <h3 className="font-bold text-lg mb-4">Información personal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Usuario</label>
            <input type="text" value={form.username} disabled className="input-field bg-gray-50 opacity-70" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
            <input type="text" name="name" value={form.name || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Correo electrónico</label>
            <input type="email" name="email" value={form.email || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Edad</label>
            <input type="number" name="age" value={form.age ?? ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Peso (kg)</label>
            <input type="number" name="weightKg" value={form.weightKg ?? ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Altura (cm)</label>
            <input type="number" name="heightCm" value={form.heightCm ?? ''} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <button className="btn-primary mt-4">Guardar cambios</button>
      </div>

      <div className="card border-l-4 border-red-400">
        <h3 className="font-bold text-lg mb-2 text-red-600">Zona de peligro</h3>
        <p className="text-sm text-gray-500 mb-4">Cerrar tu sesión en esta aplicación.</p>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
          Cerrar sesión
        </button>
      </div>

      <div className="card">
        <h3 className="font-bold text-lg mb-2">Acerca de</h3>
        <p className="text-sm text-gray-500">EazyPlan v1.0.0 — Tu asistente personal para gestionar dietas, ejercicios y tu lista de compra.</p>
      </div>
    </div>
  )
}
