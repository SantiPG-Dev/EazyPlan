export interface User {
  id: number
  username: string
  name?: string
  email?: string
  age?: number
  weightKg?: number
  heightCm?: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  name?: string
  email?: string
  age?: number
  weightKg?: number
  heightCm?: number
}

export interface AuthResponse {
  token: string
  type: string
  userId: number
  username: string
  name?: string
}

export interface Diet {
  id: number
  name: string
  date?: string
  breakfast?: string
  lunch?: string
  snack?: string
  dinner?: string
  calories?: number
  meals?: string[]
}

export interface Exercise {
  id: number
  name: string
  muscleGroup?: string
  description?: string
  sets?: number
  reps?: number
  durationMinutes?: number
  difficulty?: string
}

export interface ShoppingItem {
  id: number
  name: string
  category?: string
  quantity?: number
  bought: boolean
  weekOf?: string
}
