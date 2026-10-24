import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from 'lucide-react'
import { teamAPI } from '../../utils/api'
import ImageUpload from '../../components/ImageUpload'
import toast from 'react-hot-toast'

const emptyForm = { name: '', role: '', bio: '', photo: '', email: '', linkedin: '', instagram: '', order: 0, published: true }

export default function AdminTeam() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetch = () => teamAPI.getAllAdmin().then(r => setTeam(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = m => { setEditing(m._id); setForm({ ...m }); setModal(true) }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await teamAPI.update(editing, form)
      else await teamAPI.create(form)
      toast.success(editing ? 'Member updated!' : 'Member added!')
      setModal(false)
      fetch()
    } catch { toast.error('Error saving') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Remove this team member?')) return
    await teamAPI.delete(id)
    toast.success('Member removed')
    fetch()
  }

  const togglePublished = async m => {
    await teamAPI.update(m._id, { published: !m.published })
    fetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-light">Team</h1>
          <p className="font-body text-sm text-muted mt-1">{team.length} members</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs py-2.5 px-5"><Plus size={14} /> Add Member</button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map(i => <div key={i} className="h-64 bg-secondary border border-border animate-pulse" />) :
          team.map(m => (
            <div key={m._id} className="bg-secondary border border-border group overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden relative">
                {m.photo ? (
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-surface flex items-center justify-center">
                    <span className="font-display text-5xl text-muted">{m.name?.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => togglePublished(m)} className={`w-7 h-7 bg-primary/80 flex items-center justify-center ${m.published ? 'text-green-400' : 'text-muted'}`}>
                    {m.published ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button onClick={() => openEdit(m)} className="w-7 h-7 bg-primary/80 flex items-center justify-center text-muted hover:text-accent transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleDelete(m._id)} className="w-7 h-7 bg-primary/80 flex items-center justify-center text-muted hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-body text-sm font-medium text-light">{m.name}</h3>
                <p className="font-mono text-xs text-accent">{m.role}</p>
                {m.bio && <p className="font-body text-xs text-muted mt-1 line-clamp-2">{m.bio}</p>}
              </div>
            </div>
          ))}
      </div>
      {!loading && team.length === 0 && (
        <div className="text-center py-16 text-muted font-body text-sm border border-border">No team members yet</div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-secondary border border-border w-full max-w-lg my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-display text-xl font-light text-light">{editing ? 'Edit Member' : 'New Member'}</h2>
                <button onClick={() => setModal(false)} className="text-muted hover:text-light"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="admin-label">Photo</label>
                  <ImageUpload value={form.photo} onChange={url => setForm(f => ({ ...f, photo: url }))} folder="arrk-studio/team" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} className="admin-input" required />
                  </div>
                  <div>
                    <label className="admin-label">Role *</label>
                    <input name="role" value={form.role} onChange={handleChange} className="admin-input" required />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="admin-input resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Order</label>
                    <input name="order" type="number" value={form.order} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Instagram URL</label>
                    <input name="instagram" value={form.instagram} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">LinkedIn URL</label>
                    <input name="linkedin" value={form.linkedin} onChange={handleChange} className="admin-input" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="accent-accent" />
                  <span className="font-body text-sm text-light">Published</span>
                </label>
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button type="submit" disabled={saving} className="btn-primary text-xs py-2.5 disabled:opacity-50">
                    <Save size={14} /> {saving ? 'Saving...' : editing ? 'Update' : 'Add Member'}
                  </button>
                  <button type="button" onClick={() => setModal(false)} className="btn-ghost text-xs">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
