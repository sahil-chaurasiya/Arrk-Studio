import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react'
import Layout from '../components/Layout'
import ProjectCard from '../components/ProjectCard'
import { projectsAPI, servicesAPI, testimonialsAPI, settingsAPI } from '../utils/api'

const CATEGORIES = ['architecture', 'interior', 'space-planning', 'commercial', 'residential']

const defaultStats = [
  { label: 'Projects Completed', value: '50+' },
  { label: 'Years of Experience', value: '8+' },
  { label: 'Happy Clients', value: '40+' },
  { label: 'Awards', value: '5+' },
]

const heroImages = [
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
  'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=1600&q=80',
]

export default function Home() {
  const [projects, setProjects] = useState([])
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [heroSlide, setHeroSlide] = useState(0)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  useEffect(() => {
    projectsAPI.getAll({ featured: true, limit: 6 }).then(r => setProjects(r.data)).catch(() => {})
    servicesAPI.getAll().then(r => setServices(r.data)).catch(() => {})
    testimonialsAPI.getAll().then(r => setTestimonials(r.data.filter(t => t.featured || true).slice(0, 3))).catch(() => {})
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setHeroSlide(s => (s + 1) % heroImages.length), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout>
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen flex items-end overflow-hidden">
        {/* Background slides */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          {heroImages.map((img, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ opacity: heroSlide === i ? 1 : 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <img src={img} alt="Hero" className="w-full h-full object-cover scale-105" />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
          <div className="absolute inset-0 bg-primary/20" />
        </motion.div>

        {/* Slide indicators */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroSlide(i)}
              className={`w-0.5 transition-all duration-300 ${heroSlide === i ? 'h-12 bg-accent' : 'h-4 bg-light/30'}`} />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="section-tag mb-6">From Concept to Creation</p>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-light leading-none mb-6">
              Spaces That<br />
              <span className="italic text-accent">Inspire</span>
            </h1>
            <p className="font-body text-light/60 text-lg max-w-md mb-10">
              Architecture · Interior Design · Space Planning
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/projects" className="btn-primary">
                View Our Work <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline">
                Start a Project
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-mono text-xs text-light/40 tracking-widest">SCROLL</span>
          <ChevronDown size={16} className="text-light/40" />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="bg-accent py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="font-mono text-xs text-primary tracking-[0.3em] uppercase mx-8">
              Architecture &nbsp;·&nbsp; Interior Design &nbsp;·&nbsp; Space Planning &nbsp;·&nbsp; From Concept to Creation &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="py-20 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {defaultStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-5xl md:text-6xl font-light text-accent mb-2">{stat.value}</div>
              <div className="font-mono text-xs text-muted tracking-wider uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT SNIPPET */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-tag mb-4">About ARRK Studio</p>
            <h2 className="section-title mb-6">
              Design is not just<br />
              <span className="italic">what it looks like</span>
            </h2>
            <p className="font-body text-muted text-base leading-relaxed mb-6">
              ARRK Studio is a full-service architectural design firm specializing in architecture, interior design, and space planning. We believe that every space has a story — and our job is to help you tell it beautifully.
            </p>
            <p className="font-body text-muted text-base leading-relaxed mb-8">
              From residential retreats to commercial landmarks, we bring creativity, precision, and passion to every project we undertake.
            </p>
            <Link to="/about" className="btn-outline">
              Our Story <ArrowUpRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="Studio"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-accent p-6 w-36">
              <div className="font-display text-4xl font-light text-primary">8+</div>
              <div className="font-mono text-xs text-primary/70 tracking-wider">Years of Excellence</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="py-24 bg-secondary border-y border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <p className="section-tag mb-4">What We Do</p>
                <h2 className="section-title">Our Services</h2>
              </div>
              <Link to="/services" className="btn-ghost">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-border">
              {services.slice(0, 3).map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-secondary p-8 group hover:bg-surface transition-colors duration-300"
                >
                  <div className="font-mono text-4xl text-accent/30 mb-4">0{i + 1}</div>
                  <h3 className="font-display text-2xl font-light text-light mb-3 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed mb-6">
                    {service.shortDescription || service.description?.slice(0, 120)}...
                  </p>
                  {service.features?.length > 0 && (
                    <ul className="space-y-1">
                      {service.features.slice(0, 3).map((f, fi) => (
                        <li key={fi} className="font-mono text-xs text-muted flex items-center gap-2">
                          <span className="w-1 h-1 bg-accent rounded-full" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PROJECTS */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <p className="section-tag mb-4">Our Portfolio</p>
              <h2 className="section-title">Featured Projects</h2>
            </div>
            <Link to="/projects" className="btn-ghost">
              All Projects <ArrowRight size={14} />
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="aspect-[4/3] bg-surface animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-tag mb-4">How We Work</p>
            <h2 className="section-title">Our Process</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Discovery', desc: 'We begin with a deep consultation to understand your vision, requirements, and aspirations.' },
              { num: '02', title: 'Concept', desc: 'Our team develops creative concepts and spatial layouts that reflect your unique needs.' },
              { num: '03', title: 'Design', desc: 'Detailed drawings, material selections, and 3D visualizations bring the concept to life.' },
              { num: '04', title: 'Creation', desc: 'We oversee execution to ensure every detail meets our exacting standards.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="font-display text-7xl font-light text-accent/10 mb-4 leading-none">{step.num}</div>
                <h3 className="font-display text-xl font-light text-light mb-3">{step.title}</h3>
                <p className="font-body text-sm text-muted leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 right-0 w-1/2 h-px bg-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="section-tag mb-4">Client Stories</p>
              <h2 className="section-title">What They Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-secondary border border-border p-8"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating || 5)].map((_, j) => (
                      <span key={j} className="text-accent text-sm">★</span>
                    ))}
                  </div>
                  <p className="font-display text-lg font-light text-light/80 italic leading-relaxed mb-6">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    {t.photo && (
                      <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div>
                      <div className="font-body text-sm font-medium text-light">{t.name}</div>
                      <div className="font-mono text-xs text-muted">{t.role}{t.company && `, ${t.company}`}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl md:text-6xl font-light text-primary mb-6">
              Ready to Build<br />
              <span className="italic">Your Dream Space?</span>
            </h2>
            <p className="font-body text-primary/60 mb-10 max-w-lg mx-auto">
              Let's collaborate on your next architectural journey. From concept to creation, we're with you every step.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-light font-body text-sm tracking-widest uppercase hover:bg-secondary transition-all duration-300"
            >
              Start the Conversation <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
