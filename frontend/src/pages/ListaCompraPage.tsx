import { useState, useEffect } from 'react'
import { shoppingService } from '../api/services'
import { ShoppingItem } from '../api/types'

export default function ListaCompraPage() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', category: '', quantity: '' })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const data = await shoppingService.getAll()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await shoppingService.create({ ...form, quantity: form.quantity ? Number(form.quantity) : undefined })
      setForm({ name: '', category: '', quantity: '' })
      loadItems()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleBought = async (item: ShoppingItem) => {
    await shoppingService.update(item.id, { bought: !item.bought })
    loadItems()
  }

  const handleDelete = async (id: number) => {
    await shoppingService.remove(id)
    loadItems()
  }

  const grouped = items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const category = item.category || 'Otros'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  const boughtCount = items.filter((i) => i.bought).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-800">🛒 Lista de la Compra</h2>
        <span className="text-sm text-gray-500">{boughtCount}/{items.length} comprados</span>
      </div>

      <form onSubmit={handleSubmit} className="card flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-gray-600 mb-1">Producto</label>
          <input type="text" placeholder="Ej: Leche" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-600 mb-1">Cantidad</label>
          <input type="number" placeholder="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="input-field" />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            <option value="">Seleccionar</option>
            <option value="Lácteos">Lácteos</option>
            <option value="Carnes y pescados">Carnes y pescados</option>
            <option value="Despensa">Despensa</option>
            <option value="Frutas y verduras">Frutas y verduras</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Añadir</button>
      </form>

      {loading ? (
        <p className="text-gray-500">Cargando lista...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">La lista está vacía.</p>
      ) : (
        Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category} className="card">
            <h3 className="font-bold text-primary mb-3">{category}</h3>
            <ul className="space-y-2">
              {categoryItems.map((item) => (
                <li key={item.id} className="flex items-center gap-3 group">
                  <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={() => toggleBought(item)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                  <span className={`flex-1 ${item.bought ? 'line-through text-gray-400' : ''}`}>
                    {item.quantity && `${item.quantity}× `}{item.name}
                  </span>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}
