import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import ProjectCard from '../components/ProjectCard'
import { projectsAPI } from '../utils/api'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'interior', label: 'Interior' },
  { value: 'space-planning', label: 'Space Planning' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'residential', label: 'Residential' },
  { value: 'renovation', label: 'Renovation' },
]

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [filtered, setFiltered] = useState([])
  const [active, setActive] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectsAPI.getAll().then(r => {
      setProjects(r.data)
      setFiltered(r.data)
    }).finally(() => setLoading(false))
  }, [])

  const filterProjects = (cat) => {
    setActive(cat)
    setFiltered(cat === 'all' ? projects : projects.filter(p => p.category === cat))
  }

  return (
    <Layout>
      {/* Header */}
      <section className="pt-40 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="section-tag mb-4">Our Portfolio</p>
            <h1 className="section-title">Projects</h1>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-primary/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => filterProjects(cat.value)}
                className={`px-6 py-4 font-mono text-xs tracking-widest uppercase whitespace-nowrap transition-all duration-300 border-b-2
                  ${active === cat.value ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-light'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map(i => <div key={i} className="aspect-[4/3] bg-surface animate-pulse" />)}
            </div>
          ) : filtered.length > 0 ? (
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((p, i) => <ProjectCard key={p._id} project={p} index={i} />)}
            </motion.div>
          ) : (
            <div className="text-center py-32">
              <p className="font-display text-3xl text-muted font-light">No projects found</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
