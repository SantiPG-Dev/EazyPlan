import api from './client'
import { LoginRequest, RegisterRequest, AuthResponse, User } from './types'

export const authService = {
  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', request)
    return response.data
  },

  async register(request: RegisterRequest): Promise<User> {
    const response = await api.post<User>('/auth/register', request)
    return response.data
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token')
    return !!token
  },
}

export default authService
