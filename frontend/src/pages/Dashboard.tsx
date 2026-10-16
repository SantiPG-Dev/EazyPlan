import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Tab {
  id: string
  label: string
  icon: string
}

const tabs: Tab[] = [
  { id: 'dietas', label: 'Dietas', icon: '🥗' },
  { id: 'ejercicios', label: 'Ejercicios', icon: '💪' },
  { id: 'lista-compra', label: 'Lista de la compra', icon: '🛒' },
  { id: 'ia', label: 'Consulta con la IA', icon: '🤖' },
  { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dietas')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Redirigir a dietas si se accede a la raíz sin pestaña activa
  if (location.pathname === '/') {
    return <div className="p-6">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥗</span>
            <h1 className="text-2xl font-bold text-primary">EazyPlan</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">Hola, {user?.name || user?.username}</span>
            <button onClick={handleLogout} className="btn-secondary text-sm">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navegación por pestañas */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <ul className="flex overflow-x-auto gap-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Contenido de la pestaña activa */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
