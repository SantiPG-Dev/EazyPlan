import { useState, useEffect } from 'react'
import { dietService } from '../api/services'
import { Diet } from '../api/types'

export default function DietasPage() {
  const [diets, setDiets] = useState<Diet[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', date: '', breakfast: '', lunch: '', snack: '', dinner: '', calories: '' })

  useEffect(() => {
    loadDiets()
  }, [])

  const loadDiets = async () => {
    try {
      const data = await dietService.getAll()
      setDiets(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dietService.create({ ...form, calories: form.calories ? Number(form.calories) : undefined })
      setForm({ name: '', date: '', breakfast: '', lunch: '', snack: '', dinner: '', calories: '' })
      setShowForm(false)
      loadDiets()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    await dietService.remove(id)
    loadDiets()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">🥗 Mis Dietas</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + Nueva dieta
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <input
            type="text"
            placeholder="Nombre de la dieta"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input-field"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Desayuno" value={form.breakfast} onChange={(e) => setForm({ ...form, breakfast: e.target.value })} className="input-field" />
            <input type="text" placeholder="Almuerzo" value={form.lunch} onChange={(e) => setForm({ ...form, lunch: e.target.value })} className="input-field" />
            <input type="text" placeholder="Merienda" value={form.snack} onChange={(e) => setForm({ ...form, snack: e.target.value })} className="input-field" />
            <input type="text" placeholder="Cena" value={form.dinner} onChange={(e) => setForm({ ...form, dinner: e.target.value })} className="input-field" />
          </div>
          <input
            type="number"
            placeholder="Calorias (kcal)"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
            className="input-field"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando dietas...</p>
      ) : diets.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aún no tienes dietas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diets.map((diet) => (
            <div key={diet.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">{diet.name}</h3>
                <button onClick={() => handleDelete(diet.id)} className="text-red-500 hover:text-red-700">🗑️</button>
              </div>
              {diet.date && <p className="text-sm text-gray-500">{new Date(diet.date).toLocaleDateString('es-ES')}</p>}
              <div className="mt-3 space-y-1 text-sm">
                {diet.breakfast && <p><span className="font-medium">Desayuno:</span> {diet.breakfast}</p>}
                {diet.lunch && <p><span className="font-medium">Almuerzo:</span> {diet.lunch}</p>}
                {diet.snack && <p><span className="font-medium">Merienda:</span> {diet.snack}</p>}
                {diet.dinner && <p><span className="font-medium">Cena:</span> {diet.dinner}</p>}
              </div>
              {diet.calories && <p className="mt-2 text-primary font-semibold">{diet.calories} kcal</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
