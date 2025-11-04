import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Lock } from 'lucide-react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ProjectManager({ onSelect, selectedId, plan, onNeedUpgrade }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const fetchProjects = async () => {
    const res = await fetch(`${baseUrl}/projects`)
    const data = await res.json()
    setProjects(data)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const resetForm = () => {
    setForm({ name: '', description: '' })
    setEditingId(null)
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (editingId) {
        const res = await fetch(`${baseUrl}/projects/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Update failed')
      } else {
        const res = await fetch(`${baseUrl}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.status === 402) {
          const msg = (await res.json()).detail || 'Upgrade to Pro'
          setError(msg)
          onNeedUpgrade && onNeedUpgrade()
        }
        if (!res.ok) throw new Error('Create failed')
      }
      await fetchProjects()
      resetForm()
    } catch (err) {
      // keep error state if set
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    await fetch(`${baseUrl}/projects/${id}`, { method: 'DELETE' })
    if (selectedId === id) onSelect(null)
    fetchProjects()
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setForm({ name: p.name, description: p.description || '' })
  }

  return (
    <section className="grid md:grid-cols-2 gap-4">
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-medium">Projects</h2>
          <span className="text-xs text-neutral-400">{projects.length} total</span>
        </div>
        <ul className="space-y-2">
          {projects.map((p) => (
            <li key={p.id} className={`group flex items-center justify-between px-3 py-2 rounded border border-neutral-800/60 hover:border-neutral-700 ${selectedId === p.id ? 'bg-neutral-800/60' : 'bg-neutral-900/40'}`}>
              <button onClick={() => onSelect(p.id)} className="text-left">
                <p className="text-sm text-white font-medium">{p.name}</p>
                {p.description && <p className="text-xs text-neutral-400 line-clamp-1">{p.description}</p>}
              </button>
              <div className="flex items-center gap-2 opacity-80">
                <button onClick={() => startEdit(p)} className="p-1 rounded hover:bg-neutral-800 text-neutral-300"><Pencil size={16} /></button>
                <button onClick={() => remove(p.id)} className="p-1 rounded hover:bg-neutral-800 text-red-400"><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
          {projects.length === 0 && (
            <li className="text-sm text-neutral-400">No projects yet. Create your first project.</li>
          )}
        </ul>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">{editingId ? 'Edit Project' : 'New Project'}</h3>
          {plan !== 'pro' && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-300"><Lock size={14} /> Free tier: 1 project</span>
          )}
        </div>
        {error && (
          <p className="text-sm text-amber-300 mb-2">{error}</p>
        )}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-neutral-400">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full bg-neutral-800/70 border border-neutral-700 rounded px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-600"
              placeholder="e.g. Mobile App Testing"
              required
              maxLength={120}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full bg-neutral-800/70 border border-neutral-700 rounded px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-600"
              rows={3}
              maxLength={500}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-cyan-600 to-blue-600 text-white disabled:opacity-60"
          >
            <Plus size={16} /> {editingId ? 'Save Changes' : 'Create Project'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="ml-2 text-sm text-neutral-300 underline">Cancel</button>
          )}
        </form>
      </div>
    </section>
  )
}
