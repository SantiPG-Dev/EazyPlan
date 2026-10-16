import { Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DietasPage from './pages/DietasPage'
import EjerciciosPage from './pages/EjerciciosPage'
import ListaCompraPage from './pages/ListaCompraPage'
import IaPage from './pages/IaPage'
import ConfiguracionPage from './pages/ConfiguracionPage'

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dietas"
        element={
          <PrivateRoute>
            <DietasPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ejercicios"
        element={
          <PrivateRoute>
            <EjerciciosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/lista-compra"
        element={
          <PrivateRoute>
            <ListaCompraPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ia"
        element={
          <PrivateRoute>
            <IaPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracion"
        element={
          <PrivateRoute>
            <ConfiguracionPage />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
