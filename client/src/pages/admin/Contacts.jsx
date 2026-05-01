import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Trash2, X, Tag, MessageSquare, CheckCircle } from 'lucide-react'
import { contactAPI } from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  new: 'text-accent bg-accent/10',
  read: 'text-blue-400 bg-blue-400/10',
  replied: 'text-green-400 bg-green-400/10',
  archived: 'text-muted bg-surface',
}

const STATUSES = ['new', 'read', 'replied', 'archived']

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  const fetch = () => {
    const params = filterStatus ? { status: filterStatus } : {}
    contactAPI.getAll(params).then(r => setContacts(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [filterStatus])

  const updateStatus = async (id, status) => {
    await contactAPI.update(id, { status })
    toast.success(`Marked as ${status}`)
    fetch()
    if (selected?._id === id) setSelected(s => ({ ...s, status }))
  }

  const handleDelete = async id => {
    if (!confirm('Delete this message?')) return
    await contactAPI.delete(id)
    toast.success('Deleted')
    setSelected(null)
    fetch()
  }

  const openContact = async c => {
    setSelected(c)
    if (c.status === 'new') updateStatus(c._id, 'read')
  }

  const newCount = contacts.filter(c => c.status === 'new').length

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-light">
            Messages {newCount > 0 && <span className="text-accent text-2xl">({newCount} new)</span>}
          </h1>
          <p className="font-body text-sm text-muted mt-1">{contacts.length} total</p>
        </div>
        <div className="flex gap-2">
          {['', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`font-mono text-xs px-3 py-1.5 border transition-all ${filterStatus === s ? 'border-accent text-accent' : 'border-border text-muted hover:text-light'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 h-[calc(100vh-220px)]">
        {/* List */}
        <div className="lg:col-span-2 overflow-y-auto space-y-1 pr-1">
          {loading ? [...Array(5)].map(i => <div key={i} className="h-20 bg-secondary border border-border animate-pulse" />) :
            contacts.length === 0 ? <div className="text-center py-16 text-muted font-body text-sm border border-border">No messages</div> :
            contacts.map(c => (
              <button key={c._id} onClick={() => openContact(c)}
                className={`w-full text-left p-4 border transition-all duration-200 ${selected?._id === c._id ? 'border-accent bg-surface' : 'border-border bg-secondary hover:bg-surface'}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-body text-sm text-light truncate">{c.name}</span>
                  <span className={`font-mono text-xs px-2 py-0.5 flex-shrink-0 ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                </div>
                <p className="font-body text-xs text-muted truncate mb-1">{c.message}</p>
                <p className="font-mono text-xs text-muted/50">{new Date(c.createdAt).toLocaleDateString('en-IN')}</p>
              </button>
            ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 bg-secondary border border-border overflow-y-auto">
          {selected ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl font-light text-light mb-1">{selected.name}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-muted">
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1 hover:text-accent transition-colors">
                      <Mail size={12} /> {selected.email}
                    </a>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="flex items-center gap-1 hover:text-accent transition-colors">
                        <Phone size={12} /> {selected.phone}
                      </a>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted hover:text-light lg:hidden"><X size={18} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {selected.projectType && (
                  <div className="bg-surface p-3">
                    <p className="font-mono text-xs text-muted mb-1">Project Type</p>
                    <p className="font-body text-sm text-light">{selected.projectType}</p>
                  </div>
                )}
                {selected.budget && (
                  <div className="bg-surface p-3">
                    <p className="font-mono text-xs text-muted mb-1">Budget</p>
                    <p className="font-body text-sm text-light">{selected.budget}</p>
                  </div>
                )}
                {selected.subject && (
                  <div className="bg-surface p-3 col-span-2">
                    <p className="font-mono text-xs text-muted mb-1">Subject</p>
                    <p className="font-body text-sm text-light">{selected.subject}</p>
                  </div>
                )}
              </div>

              <div className="bg-surface p-5 mb-6">
                <p className="font-mono text-xs text-muted mb-3 flex items-center gap-2"><MessageSquare size={12} /> Message</p>
                <p className="font-body text-sm text-light/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <p className="font-mono text-xs text-muted mb-4">
                Received: {new Date(selected.createdAt).toLocaleString('en-IN')}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                {STATUSES.map(s => (
                  <button key={s} onClick={() => updateStatus(selected._id, s)}
                    className={`font-mono text-xs px-3 py-1.5 border transition-all capitalize
                      ${selected.status === s ? 'border-accent text-accent' : 'border-border text-muted hover:text-light'}`}>
                    {s === 'replied' ? <span className="flex items-center gap-1"><CheckCircle size={10} /> {s}</span> : s}
                  </button>
                ))}
                <button onClick={() => handleDelete(selected._id)}
                  className="ml-auto font-mono text-xs px-3 py-1.5 border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-all flex items-center gap-1">
                  <Trash2 size={10} /> Delete
                </button>
              </div>

              <div className="mt-4">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your inquiry'}`}
                  className="btn-primary text-xs py-2.5 w-full justify-center">
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MessageSquare size={40} className="text-muted mb-4" />
              <p className="font-display text-xl font-light text-muted">Select a message</p>
              <p className="font-body text-sm text-muted/60 mt-2">Click any message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
