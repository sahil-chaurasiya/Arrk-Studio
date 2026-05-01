import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/admin')
      toast.success('Welcome back!')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Left decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
          alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-4">ARRK Studio</p>
          <h1 className="font-display text-5xl font-light text-light leading-tight mb-4">
            From Concept<br /><span className="italic text-accent">to Creation</span>
          </h1>
          <p className="font-body text-muted max-w-xs">Admin panel — manage your projects, services, team, and more.</p>
        </div>
      </div>

      {/* Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none">
                  <path d="M20 80 L50 20 L80 80" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M35 55 L65 55" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round"/>
                  <circle cx="72" cy="42" r="18" stroke="#0a0a0a" strokeWidth="10" fill="none"/>
                  <line x1="84" y1="56" x2="95" y2="75" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <span className="font-display text-xl font-medium text-light">ARRK STUDIO</span>
                <p className="font-mono text-xs text-accent tracking-[0.2em]">ADMIN PANEL</p>
              </div>
            </div>
            <h2 className="font-display text-3xl font-light text-light mb-2">Sign In</h2>
            <p className="font-body text-sm text-muted">Access your studio dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-mono text-xs text-muted tracking-widest uppercase block mb-2">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@arrkstudio.com" className="admin-input" required />
            </div>
            <div>
              <label className="font-mono text-xs text-muted tracking-widest uppercase block mb-2">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" className="admin-input pr-10" required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50">
              {loading ? 'Signing in...' : (<>Sign In <LogIn size={16} /></>)}
            </button>
          </form>

          <p className="font-mono text-xs text-muted text-center mt-8">
            First time? Visit <code className="text-accent">/api/auth/register</code> to create admin account
          </p>
        </motion.div>
      </div>
    </div>
  )
}
