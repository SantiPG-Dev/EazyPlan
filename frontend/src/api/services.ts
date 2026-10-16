import api from './client'
import { Diet, Exercise, ShoppingItem } from './types'

export const dietService = {
  getAll: () => api.get<Diet[]>('/diets').then((r) => r.data),
  create: (data: Partial<Diet>) => api.post<Diet>('/diets', data).then((r) => r.data),
  update: (id: number, data: Partial<Diet>) => api.put<Diet>(`/diets/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/diets/${id}`),
}

export const exerciseService = {
  getAll: () => api.get<Exercise[]>('/exercises').then((r) => r.data),
  create: (data: Partial<Exercise>) => api.post<Exercise>('/exercises', data).then((r) => r.data),
  update: (id: number, data: Partial<Exercise>) => api.put<Exercise>(`/exercises/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/exercises/${id}`),
}

export const shoppingService = {
  getAll: () => api.get<ShoppingItem[]>('/shopping').then((r) => r.data),
  create: (data: Partial<ShoppingItem>) => api.post<ShoppingItem>('/shopping', data).then((r) => r.data),
  update: (id: number, data: Partial<ShoppingItem>) => api.put<ShoppingItem>(`/shopping/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/shopping/${id}`),
}

export default { dietService, exerciseService, shoppingService }
