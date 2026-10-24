import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from 'lucide-react'
import { servicesAPI } from '../../utils/api'
import ImageUpload from '../../components/ImageUpload'
import toast from 'react-hot-toast'

const emptyForm = { title: '', shortDescription: '', description: '', icon: '', image: '', features: '', order: 0, published: true }

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetch = () => servicesAPI.getAllAdmin().then(r => setServices(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = (s) => { setEditing(s._id); setForm({ ...s, features: s.features?.join('\n') || '' }); setModal(true) }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, features: form.features.split('\n').map(f => f.trim()).filter(Boolean) }
      if (editing) await servicesAPI.update(editing, payload)
      else await servicesAPI.create(payload)
      toast.success(editing ? 'Service updated!' : 'Service created!')
      setModal(false)
      fetch()
    } catch { toast.error('Error saving service') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this service?')) return
    await servicesAPI.delete(id)
    toast.success('Service deleted')
    fetch()
  }

  const togglePublished = async s => {
    await servicesAPI.update(s._id, { published: !s.published })
    fetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-light">Services</h1>
          <p className="font-body text-sm text-muted mt-1">{services.length} services</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs py-2.5 px-5"><Plus size={14} /> Add Service</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [...Array(3)].map(i => <div key={i} className="h-48 bg-secondary border border-border animate-pulse" />) :
          services.map(s => (
            <div key={s._id} className="bg-secondary border border-border p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {s.icon && <span className="text-2xl">{s.icon}</span>}
                  <h3 className="font-display text-lg font-light text-light">{s.title}</h3>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => togglePublished(s)} className={`p-1 transition-colors ${s.published ? 'text-green-400' : 'text-muted'}`}>
                    {s.published ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(s)} className="p-1 text-muted hover:text-accent transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(s._id)} className="p-1 text-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              {s.image && <img src={s.image} alt={s.title} className="w-full h-32 object-cover mb-3" />}
              <p className="font-body text-xs text-muted line-clamp-2 mb-3">{s.shortDescription || s.description}</p>
              {s.features?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {s.features.slice(0, 3).map(f => (
                    <span key={f} className="font-mono text-xs text-muted bg-surface px-2 py-0.5">{f}</span>
                  ))}
                  {s.features.length > 3 && <span className="font-mono text-xs text-muted">+{s.features.length - 3}</span>}
                </div>
              )}
            </div>
          ))}
      </div>
      {!loading && services.length === 0 && (
        <div className="text-center py-16 text-muted font-body text-sm border border-border">No services yet</div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-secondary border border-border w-full max-w-2xl my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-display text-xl font-light text-light">{editing ? 'Edit Service' : 'New Service'}</h2>
                <button onClick={() => setModal(false)} className="text-muted hover:text-light"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="admin-label">Title *</label>
                    <input name="title" value={form.title} onChange={handleChange} className="admin-input" required />
                  </div>
                  <div>
                    <label className="admin-label">Icon (emoji)</label>
                    <input name="icon" value={form.icon} onChange={handleChange} placeholder="🏛" className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Order</label>
                    <input name="order" type="number" value={form.order} onChange={handleChange} className="admin-input" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Image</label>
                    <ImageUpload value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} folder="arrk-studio/services" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Short Description</label>
                    <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="admin-input" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Full Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="admin-input resize-none" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Features (one per line)</label>
                    <textarea name="features" value={form.features} onChange={handleChange} rows={4} placeholder="Site Analysis&#10;3D Visualization&#10;Construction Documents" className="admin-input resize-none" />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="accent-accent" />
                    <span className="font-body text-sm text-light">Published</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button type="submit" disabled={saving} className="btn-primary text-xs py-2.5 disabled:opacity-50">
                    <Save size={14} /> {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
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
