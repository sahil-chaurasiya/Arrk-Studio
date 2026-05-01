import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Instagram, Mail, Linkedin } from 'lucide-react'
import Layout from '../components/Layout'
import { teamAPI } from '../utils/api'

export default function About() {
  const [team, setTeam] = useState([])

  useEffect(() => {
    teamAPI.getAll().then(r => setTeam(r.data)).catch(() => {})
  }, [])

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-40 pb-0 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-end pb-20 border-b border-border">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-tag mb-4">Our Story</p>
            <h1 className="section-title">
              Built on Craft.<br />
              <span className="italic text-accent">Driven by Vision.</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-body text-muted text-lg leading-relaxed self-end"
          >
            ARRK Studio is where architecture meets artistry. We are a passionate team of designers and architects dedicated to transforming spaces into experiences that resonate, inspire, and endure.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-12">
          {[
            { label: 'Our Mission', text: 'To craft spaces that go beyond aesthetics — environments that serve their purpose perfectly while uplifting the human spirit through thoughtful design.' },
            { label: 'Our Vision', text: 'To be recognized as the premier architectural design studio that seamlessly bridges the gap between concept and reality, setting new standards in design excellence.' },
            { label: 'Our Values', text: 'Creativity, integrity, and attention to detail define everything we do. We believe in collaborative partnerships with our clients built on trust and transparency.' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="border-t border-accent pt-8"
            >
              <h3 className="font-mono text-xs text-accent tracking-widest uppercase mb-4">{item.label}</h3>
              <p className="font-body text-muted leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Studio Image */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative aspect-[21/9] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&q=80"
              alt="Studio" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/30" />
            <div className="absolute bottom-8 left-8">
              <p className="font-mono text-xs text-accent tracking-widest">ARRK STUDIO — WHERE IDEAS BECOME SPACES</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: '50+', label: 'Projects Delivered' },
            { value: '8+', label: 'Years Experience' },
            { value: '40+', label: 'Happy Clients' },
            { value: '3', label: 'Design Specialties' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-5xl font-light text-accent mb-2">{s.value}</div>
              <div className="font-mono text-xs text-muted tracking-wider uppercase">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="section-tag mb-4">The Minds Behind</p>
              <h2 className="section-title">Our Team</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-surface mb-4">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-5xl text-muted">{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-light text-light">{member.name}</h3>
                  <p className="font-mono text-xs text-accent tracking-wider mb-2">{member.role}</p>
                  {member.bio && <p className="font-body text-sm text-muted leading-relaxed mb-3 line-clamp-3">{member.bio}</p>}
                  <div className="flex gap-3">
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition-colors">
                        <Instagram size={14} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition-colors">
                        <Linkedin size={14} />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-muted hover:text-accent transition-colors">
                        <Mail size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instagram CTA */}
      <section className="py-20 border-t border-border">
        <div className="max-w-xl mx-auto px-6 text-center">
          <Instagram size={32} className="text-accent mx-auto mb-4" />
          <h2 className="font-display text-3xl font-light text-light mb-3">Follow Our Journey</h2>
          <p className="font-body text-muted mb-6">See our latest projects and design inspirations on Instagram</p>
          <a href="https://instagram.com/arrkstudio" target="_blank" rel="noreferrer" className="btn-outline">
            @arrkstudio
          </a>
        </div>
      </section>
    </Layout>
  )
}
