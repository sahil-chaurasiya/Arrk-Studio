import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Instagram, Send, CheckCircle } from 'lucide-react'
import Layout from '../components/Layout'
import { contactAPI } from '../utils/api'
import toast from 'react-hot-toast'

const PROJECT_TYPES = ['Residential Architecture', 'Commercial Architecture', 'Interior Design', 'Space Planning', 'Renovation', 'Consultation', 'Other']
const BUDGETS = ['Under ₹10L', '₹10L - ₹25L', '₹25L - ₹50L', '₹50L - ₹1Cr', 'Above ₹1Cr', 'To be discussed']

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', projectType: '', budget: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill required fields')
    setLoading(true)
    try {
      await contactAPI.submit(form)
      setSent(true)
      toast.success('Message sent! We\'ll be in touch soon.')
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      {/* Header */}
      <section className="pt-40 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-tag mb-4">Get In Touch</p>
            <h1 className="section-title">Let's Create<br /><span className="italic text-accent">Together</span></h1>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-5 gap-16">
          {/* Info */}
          <div className="md:col-span-2 space-y-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-display text-2xl font-light text-light mb-6">Start a Conversation</h2>
              <p className="font-body text-muted leading-relaxed mb-8">
                Whether you have a dream home in mind or a commercial space to transform, we'd love to hear about your project. Reach out and let's explore the possibilities together.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@arrkstudio.com', href: 'mailto:hello@arrkstudio.com' },
                  { icon: Phone, label: 'Phone', value: '+91 XXXXX XXXXX', href: 'tel:+91XXXXXXXXXX' },
                  { icon: Instagram, label: 'Instagram', value: '@arrkstudio', href: 'https://instagram.com/arrkstudio' },
                  { icon: MapPin, label: 'Location', value: 'India', href: null },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                      <item.icon size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-mono text-xs text-muted tracking-wider uppercase mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                          className="font-body text-sm text-light hover:text-accent transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-body text-sm text-light">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Working Hours */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="border-t border-border pt-8"
            >
              <h3 className="font-mono text-xs text-accent tracking-widest uppercase mb-4">Studio Hours</h3>
              <div className="space-y-2 font-body text-sm text-muted">
                <div className="flex justify-between"><span>Monday – Friday</span><span>9:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>10:00 AM – 4:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-6 py-20">
                <CheckCircle size={48} className="text-accent" />
                <h3 className="font-display text-3xl font-light text-light text-center">Message Received!</h3>
                <p className="font-body text-muted text-center max-w-sm">
                  Thank you for reaching out. We'll review your message and get back to you within 24 hours.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '', projectType: '', budget: '' }) }}
                  className="btn-outline">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-mono text-xs text-muted tracking-widest uppercase block mb-2">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                      className="input-field" required />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-muted tracking-widest uppercase block mb-2">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com"
                      className="input-field" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-mono text-xs text-muted tracking-widest uppercase block mb-2">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX"
                      className="input-field" />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-muted tracking-widest uppercase block mb-2">Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="Project inquiry"
                      className="input-field" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-mono text-xs text-muted tracking-widest uppercase block mb-2">Project Type</label>
                    <select name="projectType" value={form.projectType} onChange={handleChange}
                      className="input-field bg-transparent">
                      <option value="">Select type</option>
                      {PROJECT_TYPES.map(t => <option key={t} value={t} className="bg-secondary">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-xs text-muted tracking-widest uppercase block mb-2">Budget Range</label>
                    <select name="budget" value={form.budget} onChange={handleChange}
                      className="input-field bg-transparent">
                      <option value="">Select budget</option>
                      {BUDGETS.map(b => <option key={b} value={b} className="bg-secondary">{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs text-muted tracking-widest uppercase block mb-2">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell us about your project, timeline, and any specific requirements..."
                    rows={6} className="input-field resize-none" required />
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-50">
                  {loading ? 'Sending...' : (<>Send Message <Send size={16} /></>)}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
