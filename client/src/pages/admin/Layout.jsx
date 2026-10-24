import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderOpen, Wrench, Users, MessageSquare,
  Mail, Settings, LogOut, Menu, X, ExternalLink, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: FolderOpen, label: 'Projects', href: '/admin/projects' },
  { icon: Wrench, label: 'Services', href: '/admin/services' },
  { icon: Users, label: 'Team', href: '/admin/team' },
  { icon: MessageSquare, label: 'Testimonials', href: '/admin/testimonials' },
  { icon: Mail, label: 'Contacts', href: '/admin/contacts' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    toast.success('Logged out')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-6 h-6" fill="none">
            <path d="M20 80 L50 20 L80 80" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M35 55 L65 55" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round"/>
            <circle cx="72" cy="42" r="18" stroke="#0a0a0a" strokeWidth="10" fill="none"/>
            <line x1="84" y1="56" x2="95" y2="75" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round"/>
          </svg>
        </div>
        {sidebarOpen && (
          <div>
            <span className="font-display text-base font-medium text-light">ARRK</span>
            <p className="font-mono text-xs text-accent -mt-0.5">ADMIN</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = item.href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.href)
          return (
            <Link key={item.href} to={item.href}
              onClick={() => setMobileSidebar(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 group
                ${active ? 'bg-accent text-primary' : 'text-muted hover:text-light hover:bg-surface'}`}
            >
              <item.icon size={16} className="flex-shrink-0" />
              {sidebarOpen && <span className="font-body text-sm">{item.label}</span>}
              {sidebarOpen && active && <ChevronRight size={12} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-2">
        <Link to="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2 text-muted hover:text-accent transition-colors rounded-sm">
          <ExternalLink size={16} />
          {sidebarOpen && <span className="font-body text-sm">View Site</span>}
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-muted hover:text-red-400 transition-colors rounded-sm">
          <LogOut size={16} />
          {sidebarOpen && <span className="font-body text-sm">Log Out</span>}
        </button>
        {sidebarOpen && user && (
          <div className="px-3 pt-2 border-t border-border mt-2">
            <p className="font-body text-xs text-light">{user.name}</p>
            <p className="font-mono text-xs text-muted">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-primary overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-secondary border-r border-border transition-all duration-300 flex-shrink-0
        ${sidebarOpen ? 'w-56' : 'w-16'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary/80 z-40 md:hidden" onClick={() => setMobileSidebar(false)} />
            <motion.aside
              initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-secondary border-r border-border z-50 md:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-secondary border-b border-border h-14 flex items-center px-6 gap-4 flex-shrink-0">
          <button onClick={() => { setSidebarOpen(!sidebarOpen); setMobileSidebar(!mobileSidebar) }}
            className="text-muted hover:text-light transition-colors">
            <Menu size={18} />
          </button>
          <div className="flex-1" />
          <span className="font-mono text-xs text-muted hidden sm:block">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="font-body text-xs font-medium text-primary">{user?.name?.charAt(0) || 'A'}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
