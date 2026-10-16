import { useState } from 'react'
import api from '../api/client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function IaPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await api.post<{ response: string; provider?: string }>('/ia/chat', { message: userMessage })
      setProvider(response.data.provider || '')
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.response }])
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al obtener respuesta'
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 h-[calc(100vh-220px)] flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800">🤖 Consulta con la IA</h2>

      <div className="card flex-1 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-5xl mb-4">🤖</p>
            <p>Pregúntame lo que necesites sobre dietas, ejercicios o tu lista de compra.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : provider === 'error'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.role === 'assistant' && <p className="text-xs font-semibold mb-1 opacity-70">IA</p>}
                <p>{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <span className="animate-pulse">Escribiendo...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field flex-1"
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading || !input.trim()}>
          Enviar
        </button>
      </form>

      {provider && provider !== 'local' && (
        <p className="text-center text-xs text-gray-400">Conectado a un modelo externo ({provider})</p>
      )}
    </div>
  )
}
