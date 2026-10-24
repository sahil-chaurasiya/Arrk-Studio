import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FolderOpen, Wrench, Users, Mail, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'
import { projectsAPI, servicesAPI, teamAPI, contactAPI, testimonialsAPI } from '../../utils/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, services: 0, team: 0, contacts: 0, testimonials: 0 })
  const [recentContacts, setRecentContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      projectsAPI.getAllAdmin(),
      servicesAPI.getAllAdmin(),
      teamAPI.getAllAdmin(),
      contactAPI.getAll(),
      testimonialsAPI.getAllAdmin(),
    ]).then(([p, s, t, c, test]) => {
      setStats({ projects: p.data.length, services: s.data.length, team: t.data.length, contacts: c.data.length, testimonials: test.data.length })
      setRecentContacts(c.data.slice(0, 5))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-400' },
    { label: 'Services', value: stats.services, icon: Wrench, href: '/admin/services', color: 'text-green-400' },
    { label: 'Team Members', value: stats.team, icon: Users, href: '/admin/team', color: 'text-purple-400' },
    { label: 'Messages', value: stats.contacts, icon: Mail, href: '/admin/contacts', color: 'text-accent' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, href: '/admin/testimonials', color: 'text-pink-400' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-light text-light">Dashboard</h1>
        <p className="font-body text-sm text-muted mt-1">Overview of your studio's content</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={card.href}
              className="block bg-secondary border border-border p-5 hover:border-accent/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <card.icon size={20} className={card.color} />
                <ArrowRight size={14} className="text-muted group-hover:text-accent transition-colors" />
              </div>
              <div className="font-display text-4xl font-light text-light mb-1">
                {loading ? '—' : card.value}
              </div>
              <div className="font-mono text-xs text-muted tracking-wider">{card.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Contacts */}
      <div className="bg-secondary border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-body text-sm font-medium text-light flex items-center gap-2">
            <Mail size={16} className="text-accent" /> Recent Messages
          </h2>
          <Link to="/admin/contacts" className="font-mono text-xs text-accent hover:text-accent-light transition-colors">
            View All →
          </Link>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            [...Array(3)].map(i => (
              <div key={i} className="px-6 py-4 animate-pulse">
                <div className="h-4 bg-surface rounded w-1/3 mb-2" />
                <div className="h-3 bg-surface rounded w-2/3" />
              </div>
            ))
          ) : recentContacts.length > 0 ? (
            recentContacts.map(c => (
              <div key={c._id} className="px-6 py-4 flex items-start gap-4">
                <div className="w-8 h-8 bg-surface flex items-center justify-center flex-shrink-0 rounded-full">
                  <span className="font-body text-xs font-medium text-accent">{c.name?.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-body text-sm text-light truncate">{c.name}</span>
                    <span className={`font-mono text-xs px-2 py-0.5 flex-shrink-0
                      ${c.status === 'new' ? 'bg-accent/20 text-accent' :
                        c.status === 'read' ? 'bg-blue-500/20 text-blue-400' : 'bg-surface text-muted'}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted truncate mt-0.5">{c.message}</p>
                  <p className="font-mono text-xs text-muted/50 mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center font-body text-sm text-muted">No messages yet</div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Add New Project', href: '/admin/projects', icon: FolderOpen, desc: 'Upload portfolio work' },
          { label: 'Manage Services', href: '/admin/services', icon: Wrench, desc: 'Update your offerings' },
          { label: 'Site Settings', href: '/admin/settings', icon: TrendingUp, desc: 'Configure banners & info' },
        ].map(item => (
          <Link key={item.href} to={item.href}
            className="bg-surface border border-border p-5 hover:border-accent/40 transition-all duration-300 group flex items-start gap-4">
            <item.icon size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm text-light group-hover:text-accent transition-colors">{item.label}</p>
              <p className="font-mono text-xs text-muted mt-1">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
