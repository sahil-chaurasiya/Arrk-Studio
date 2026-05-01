import { Link } from 'react-router-dom'
import { Instagram, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
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
                <p className="font-mono text-xs text-accent tracking-[0.2em]">ARCHITECTURAL DESIGNER</p>
              </div>
            </div>
            <p className="font-body text-muted text-sm leading-relaxed max-w-xs mb-6">
              From concept to creation — we craft spaces that tell your story through thoughtful architecture and inspired interior design.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/arrkstudio" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all duration-300">
                <Instagram size={16} />
              </a>
              <a href="mailto:hello@arrkstudio.com"
                className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all duration-300">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-xs text-accent tracking-[0.2em] uppercase mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[['Projects', '/projects'], ['Services', '/services'], ['About', '/about'], ['Contact', '/contact']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="font-body text-sm text-muted hover:text-light transition-colors duration-300 flex items-center gap-1 group">
                    <span>{label}</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs text-accent tracking-[0.2em] uppercase mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted">
                <Phone size={14} className="mt-0.5 text-accent flex-shrink-0" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted">
                <Mail size={14} className="mt-0.5 text-accent flex-shrink-0" />
                <span>hello@arrkstudio.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted">
                <MapPin size={14} className="mt-0.5 text-accent flex-shrink-0" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-muted">© {new Date().getFullYear()} ARRK Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/admin" className="font-mono text-xs text-muted hover:text-accent transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
