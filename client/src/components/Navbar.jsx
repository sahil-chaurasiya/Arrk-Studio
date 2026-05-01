import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Projects', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-primary/95 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none">
                <path d="M20 80 L50 20 L80 80" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M35 55 L65 55" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round"/>
                <circle cx="72" cy="42" r="18" stroke="#0a0a0a" strokeWidth="10" fill="none"/>
                <line x1="84" y1="56" x2="95" y2="75" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span className="font-display text-xl font-medium text-light tracking-wide">ARRK</span>
              <span className="font-mono text-xs text-accent tracking-[0.2em] block -mt-1">STUDIO</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-body text-sm tracking-widest uppercase transition-colors duration-300 relative group
                  ${location.pathname.startsWith(link.href) ? 'text-accent' : 'text-light/70 hover:text-light'}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 
                  ${location.pathname.startsWith(link.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
            <Link to="/contact" className="btn-primary text-xs py-2.5 px-6">
              Get In Touch
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-light p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-primary flex flex-col pt-24 px-8"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <Link
                    to={link.href}
                    className="font-display text-4xl font-light text-light/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto mb-16 border-t border-border pt-8">
              <p className="font-mono text-xs text-muted tracking-widest">FROM CONCEPT TO CREATION</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
