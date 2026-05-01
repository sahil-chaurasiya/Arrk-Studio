import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Maximize2, User, X } from 'lucide-react'
import Layout from '../components/Layout'
import { projectsAPI } from '../utils/api'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    projectsAPI.getBySlug(slug).then(r => setProject(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    </Layout>
  )

  if (!project) return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-display text-3xl text-muted">Project not found</p>
        <Link to="/projects" className="btn-outline">Back to Projects</Link>
      </div>
    </Layout>
  )

  const allImages = [project.coverImage, ...(project.images?.map(i => i.url) || [])].filter(Boolean)

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/projects" className="inline-flex items-center gap-2 font-mono text-xs text-accent tracking-widest uppercase mb-6 hover:text-accent-light transition-colors">
              <ArrowLeft size={14} /> Back to Projects
            </Link>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className="font-mono text-xs text-accent tracking-widest uppercase bg-accent/10 px-3 py-1 mb-4 inline-block">
                  {project.category}
                </span>
                <h1 className="font-display text-5xl md:text-6xl font-light text-light">{project.title}</h1>
              </div>
              {project.status === 'ongoing' && (
                <span className="font-mono text-xs bg-accent text-primary px-3 py-1 self-start">Ongoing</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meta + Description */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-12">
          {/* Description */}
          <div className="md:col-span-2">
            <p className="section-tag mb-4">Project Overview</p>
            <p className="font-body text-light/70 leading-relaxed text-lg">{project.description}</p>
            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {project.tags.map(tag => (
                  <span key={tag} className="font-mono text-xs text-muted border border-border px-3 py-1">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="space-y-6">
            {[
              { icon: MapPin, label: 'Location', value: project.location },
              { icon: Calendar, label: 'Year', value: project.year },
              { icon: Maximize2, label: 'Area', value: project.area },
              { icon: User, label: 'Client', value: project.client },
            ].filter(m => m.value).map(meta => (
              <div key={meta.label} className="flex items-start gap-3 pb-4 border-b border-border">
                <meta.icon size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-mono text-xs text-muted tracking-wider uppercase mb-1">{meta.label}</p>
                  <p className="font-body text-sm text-light">{meta.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {allImages.length > 1 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="section-tag mb-8">Gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allImages.map((url, i) => (
                <motion.div
                  key={i}
                  className={`overflow-hidden cursor-pointer group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setLightbox(i)}
                >
                  <div className={`relative ${i === 0 ? 'aspect-[16/9]' : 'aspect-square'} overflow-hidden`}>
                    <img src={url} alt={`${project.title} ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300 flex items-center justify-center">
                      <Maximize2 size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-primary/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-light hover:text-accent transition-colors">
            <X size={24} />
          </button>
          <div className="flex items-center gap-4 w-full max-w-5xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox((lightbox - 1 + allImages.length) % allImages.length)}
              className="text-light/50 hover:text-accent transition-colors p-4 text-2xl">‹</button>
            <img src={allImages[lightbox]} alt="" className="flex-1 max-h-[80vh] object-contain" />
            <button onClick={() => setLightbox((lightbox + 1) % allImages.length)}
              className="text-light/50 hover:text-accent transition-colors p-4 text-2xl">›</button>
          </div>
          <div className="absolute bottom-6 font-mono text-xs text-muted">
            {lightbox + 1} / {allImages.length}
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <section className="py-20 bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-light text-light mb-4">Like what you see?</h2>
          <p className="font-body text-muted mb-8">Let's discuss your next project</p>
          <Link to="/contact" className="btn-primary">Start a Conversation</Link>
        </div>
      </section>
    </Layout>
  )
}
