import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react'
import { testimonialsAPI } from '../../utils/api'
import ImageUpload from '../../components/ImageUpload'
import toast from 'react-hot-toast'

const emptyForm = { name: '', role: '', company: '', photo: '', content: '', rating: 5, project: '', featured: false, published: true, order: 0 }

export default function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetch = () => testimonialsAPI.getAllAdmin().then(r => setItems(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = t => { setEditing(t._id); setForm({ ...t }); setModal(true) }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await testimonialsAPI.update(editing, form)
      else await testimonialsAPI.create(form)
      toast.success(editing ? 'Updated!' : 'Created!')
      setModal(false)
      fetch()
    } catch { toast.error('Error saving') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this testimonial?')) return
    await testimonialsAPI.delete(id)
    toast.success('Deleted')
    fetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-light">Testimonials</h1>
          <p className="font-body text-sm text-muted mt-1">{items.length} testimonials</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs py-2.5 px-5"><Plus size={14} /> Add Testimonial</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {loading ? [...Array(4)].map(i => <div key={i} className="h-40 bg-secondary border border-border animate-pulse" />) :
          items.map(t => (
            <div key={t._id} className="bg-secondary border border-border p-5 group relative">
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {t.featured && <Star size={14} className="text-accent fill-accent" />}
                <button onClick={() => openEdit(t)} className="text-muted hover:text-accent transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(t._id)} className="text-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={12} className="text-accent fill-accent" />)}
              </div>
              <p className="font-display text-base font-light text-light/80 italic mb-4 line-clamp-3">"{t.content}"</p>
              <div className="flex items-center gap-3">
                {t.photo && <img src={t.photo} alt={t.name} className="w-9 h-9 rounded-full object-cover" />}
                <div>
                  <p className="font-body text-sm text-light">{t.name}</p>
                  <p className="font-mono text-xs text-muted">{t.role}{t.company && `, ${t.company}`}</p>
                </div>
                {!t.published && <span className="ml-auto font-mono text-xs text-muted bg-surface px-2 py-0.5">Hidden</span>}
              </div>
            </div>
          ))}
      </div>
      {!loading && items.length === 0 && (
        <div className="text-center py-16 text-muted font-body text-sm border border-border">No testimonials yet</div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-secondary border border-border w-full max-w-lg my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-display text-xl font-light text-light">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                <button onClick={() => setModal(false)} className="text-muted hover:text-light"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} className="admin-input" required />
                  </div>
                  <div>
                    <label className="admin-label">Role</label>
                    <input name="role" value={form.role} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Company</label>
                    <input name="company" value={form.company} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Project</label>
                    <input name="project" value={form.project} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Rating (1-5)</label>
                    <input name="rating" type="number" min={1} max={5} value={form.rating} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Order</label>
                    <input name="order" type="number" value={form.order} onChange={handleChange} className="admin-input" />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Photo</label>
                  <ImageUpload value={form.photo} onChange={url => setForm(f => ({ ...f, photo: url }))} folder="arrk-studio/testimonials" />
                </div>
                <div>
                  <label className="admin-label">Testimonial Content *</label>
                  <textarea name="content" value={form.content} onChange={handleChange} rows={4} className="admin-input resize-none" required />
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="accent-accent" />
                    <span className="font-body text-sm text-light">Featured</span>
                  </label>
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
