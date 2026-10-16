import { useState, useEffect } from 'react'
import { exerciseService } from '../api/services'
import { Exercise } from '../api/types'

export default function EjerciciosPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', muscleGroup: '', description: '', sets: '', reps: '', durationMinutes: '', difficulty: '' })

  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    try {
      const data = await exerciseService.getAll()
      setExercises(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await exerciseService.create({
        ...form,
        sets: form.sets ? Number(form.sets) : undefined,
        reps: form.reps ? Number(form.reps) : undefined,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
      })
      setForm({ name: '', muscleGroup: '', description: '', sets: '', reps: '', durationMinutes: '', difficulty: '' })
      setShowForm(false)
      loadExercises()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    await exerciseService.remove(id)
    loadExercises()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">💪 Mis Ejercicios</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + Nuevo ejercicio
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <input type="text" placeholder="Nombre del ejercicio" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
          <input type="text" placeholder="Grupo muscular" value={form.muscleGroup} onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })} className="input-field" />
          <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="number" placeholder="Series" value={form.sets} onChange={(e) => setForm({ ...form, sets: e.target.value })} className="input-field" />
            <input type="number" placeholder="Repeticiones" value={form.reps} onChange={(e) => setForm({ ...form, reps: e.target.value })} className="input-field" />
            <input type="number" placeholder="Duración (min)" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} className="input-field" />
          </div>
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="input-field">
            <option value="">Dificultad</option>
            <option value="Básico">Básico</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando ejercicios...</p>
      ) : exercises.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aún no tienes ejercicios registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">{exercise.name}</h3>
                <button onClick={() => handleDelete(exercise.id)} className="text-red-500 hover:text-red-700">🗑️</button>
              </div>
              {exercise.muscleGroup && (
                <span className="inline-block bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full mb-2">
                  {exercise.muscleGroup}
                </span>
              )}
              {exercise.description && <p className="text-sm text-gray-600">{exercise.description}</p>}
              <div className="mt-3 flex gap-4 text-sm text-gray-500">
                {exercise.sets != null && <p>{exercise.sets} series</p>}
                {exercise.reps != null && <p>{exercise.reps} reps</p>}
                {exercise.durationMinutes != null && <p>{exercise.durationMinutes} min</p>}
              </div>
              {exercise.difficulty && (
                <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                  exercise.difficulty === 'Avanzado' ? 'bg-red-100 text-red-700' :
                  exercise.difficulty === 'Intermedio' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {exercise.difficulty}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
