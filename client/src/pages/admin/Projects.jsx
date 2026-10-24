import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, X, Save } from 'lucide-react'
import { projectsAPI } from '../../utils/api'
import ImageUpload from '../../components/ImageUpload'
import toast from 'react-hot-toast'

const CATEGORIES = ['architecture', 'interior', 'space-planning', 'commercial', 'residential', 'renovation']
const STATUSES = ['completed', 'ongoing', 'concept']

const emptyForm = { title: '', category: 'architecture', description: '', shortDescription: '', coverImage: '', images: [], location: '', area: '', year: new Date().getFullYear(), client: '', status: 'completed', featured: false, tags: '', order: 0, published: true }

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchProjects = () => {
    projectsAPI.getAllAdmin().then(r => setProjects(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchProjects() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = (p) => {
    setEditing(p._id)
    setForm({ ...p, tags: p.tags?.join(', ') || '', images: p.images?.map(i => i.url || i) || [] })
    setModal(true)
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), images: form.images.map(url => ({ url })) }
      if (editing) await projectsAPI.update(editing, payload)
      else await projectsAPI.create(payload)
      toast.success(editing ? 'Project updated!' : 'Project created!')
      setModal(false)
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving project')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    await projectsAPI.delete(id)
    toast.success('Project deleted')
    fetchProjects()
  }

  const toggleFeatured = async (p) => {
    await projectsAPI.update(p._id, { featured: !p.featured })
    fetchProjects()
  }

  const togglePublished = async (p) => {
    await projectsAPI.update(p._id, { published: !p.published })
    fetchProjects()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-light">Projects</h1>
          <p className="font-body text-sm text-muted mt-1">{projects.length} total projects</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs py-2.5 px-5">
          <Plus size={14} /> Add Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-secondary border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Image', 'Title', 'Category', 'Status', 'Featured', 'Published', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-xs text-muted tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? [...Array(3)].map(i => (
                <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-surface animate-pulse rounded w-full" /></td></tr>
              )) : projects.map(p => (
                <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    {p.coverImage ? <img src={p.coverImage} alt="" className="w-12 h-9 object-cover rounded-sm" /> : <div className="w-12 h-9 bg-surface rounded-sm" />}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm text-light line-clamp-1">{p.title}</p>
                    {p.location && <p className="font-mono text-xs text-muted">{p.location}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 capitalize">{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs px-2 py-0.5 capitalize ${p.status === 'completed' ? 'text-green-400 bg-green-400/10' : p.status === 'ongoing' ? 'text-blue-400 bg-blue-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(p)} className={`transition-colors ${p.featured ? 'text-accent' : 'text-muted hover:text-accent'}`}>
                      <Star size={16} fill={p.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublished(p)} className={`transition-colors ${p.published ? 'text-green-400' : 'text-muted'}`}>
                      {p.published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="text-muted hover:text-accent transition-colors p-1">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="text-muted hover:text-red-400 transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && projects.length === 0 && (
          <div className="text-center py-12 text-muted font-body text-sm">No projects yet. Add your first project!</div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-secondary border border-border w-full max-w-3xl my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-display text-xl font-light text-light">{editing ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setModal(false)} className="text-muted hover:text-light transition-colors"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="admin-label">Title *</label>
                    <input name="title" value={form.title} onChange={handleChange} className="admin-input" required />
                  </div>
                  <div>
                    <label className="admin-label">Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} className="admin-input">
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-secondary capitalize">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className="admin-input">
                      {STATUSES.map(s => <option key={s} value={s} className="bg-secondary capitalize">{s}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Cover Image *</label>
                    <ImageUpload value={form.coverImage} onChange={url => setForm(f => ({ ...f, coverImage: url }))} folder="arrk-studio/projects" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Gallery Images</label>
                    <ImageUpload value={form.images} onChange={imgs => setForm(f => ({ ...f, images: imgs }))} folder="arrk-studio/projects" multiple />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="admin-input resize-none" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Short Description</label>
                    <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Location</label>
                    <input name="location" value={form.location} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Area (e.g. 2500 sq.ft)</label>
                    <input name="area" value={form.area} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Year</label>
                    <input name="year" type="number" value={form.year} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Client</label>
                    <input name="client" value={form.client} onChange={handleChange} className="admin-input" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Tags (comma separated)</label>
                    <input name="tags" value={form.tags} onChange={handleChange} placeholder="modern, minimal, residential" className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Order</label>
                    <input name="order" type="number" value={form.order} onChange={handleChange} className="admin-input" />
                  </div>
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
                    <Save size={14} /> {saving ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
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
