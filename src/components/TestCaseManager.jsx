import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Clock3 } from 'lucide-react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function TestCaseManager({ projectId }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', description: '', status: 'Pending' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (projectId) fetchItems()
  }, [projectId])

  const fetchItems = async () => {
    const res = await fetch(`${baseUrl}/projects/${projectId}/testcases`)
    const data = await res.json()
    setItems(data)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!projectId) return
    if (editingId) {
      await fetch(`${baseUrl}/testcases/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } else {
      await fetch(`${baseUrl}/projects/${projectId}/testcases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, project_id: projectId }),
      })
    }
    setForm({ name: '', description: '', status: 'Pending' })
    setEditingId(null)
    fetchItems()
  }

  const remove = async (id) => {
    await fetch(`${baseUrl}/testcases/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  const setStatus = async (id, status) => {
    await fetch(`${baseUrl}/testcases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchItems()
  }

  if (!projectId) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-6 text-neutral-400">
        Select a project to manage test cases.
      </div>
    )
  }

  return (
    <section className="grid md:grid-cols-2 gap-4">
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-medium">Test Cases</h2>
          <span className="text-xs text-neutral-400">{items.length} total</span>
        </div>
        <ul className="space-y-2">
          {items.map((t) => (
            <li key={t.id} className="group rounded border border-neutral-800/60 bg-neutral-900/40 px-3 py-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-white font-medium">{t.name}</p>
                  {t.description && <p className="text-xs text-neutral-400">{t.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.status} />
                  <button onClick={() => setEditingId(t.id) || setForm({ name: t.name, description: t.description || '', status: t.status })} className="p-1 rounded hover:bg-neutral-800 text-neutral-300"><Pencil size={16} /></button>
                  <button onClick={() => remove(t.id)} className="p-1 rounded hover:bg-neutral-800 text-red-400"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <QuickAction label="Pass" onClick={() => setStatus(t.id, 'Pass')} icon={<CheckCircle2 size={14} className="text-emerald-400" />} />
                <QuickAction label="Fail" onClick={() => setStatus(t.id, 'Fail')} icon={<XCircle size={14} className="text-rose-400" />} />
                <QuickAction label="Pending" onClick={() => setStatus(t.id, 'Pending')} icon={<Clock3 size={14} className="text-amber-300" />} />
              </div>
            </li>
          ))}
          {items.length === 0 && <li className="text-sm text-neutral-400">No test cases yet.</li>}
        </ul>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        <h3 className="text-white font-medium mb-3">{editingId ? 'Edit Test Case' : 'New Test Case'}</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-neutral-400">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full bg-neutral-800/70 border border-neutral-700 rounded px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-600"
              placeholder="e.g. Login with valid credentials"
              required
              maxLength={160}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="mt-1 w-full bg-neutral-800/70 border border-neutral-700 rounded px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full bg-neutral-800/70 border border-neutral-700 rounded px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-600"
            >
              <option>Pending</option>
              <option>Pass</option>
              <option>Fail</option>
            </select>
          </div>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
            <Plus size={16} /> {editingId ? 'Save Changes' : 'Add Test Case'}
          </button>
          {editingId && (
            <button type="button" onClick={() => setEditingId(null) || setForm({ name: '', description: '', status: 'Pending' })} className="ml-2 text-sm text-neutral-300 underline">Cancel</button>
          )}
        </form>
      </div>
    </section>
  )
}

function StatusBadge({ status }) {
  const map = {
    Pass: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/30',
    Fail: 'text-rose-400 bg-rose-400/10 border-rose-500/30',
    Pending: 'text-amber-300 bg-amber-300/10 border-amber-400/30',
  }
  return <span className={`text-xs px-2 py-0.5 rounded border ${map[status]}`}>{status}</span>
}

function QuickAction({ label, onClick, icon }) {
  return (
    <button onClick={onClick} className="text-xs px-2 py-1 rounded border border-neutral-700 hover:border-neutral-600 text-neutral-300 inline-flex items-center gap-1">
      {icon} {label}
    </button>
  )
}
