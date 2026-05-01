import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Layout from '../components/Layout'
import { servicesAPI } from '../utils/api'

const DEFAULT_SERVICES = [
  {
    _id: 'd1', title: 'Architecture Design', icon: '🏛',
    shortDescription: 'Comprehensive architectural design from site analysis to construction documents.',
    description: 'We create buildings that are both beautiful and functional, blending aesthetics with structural integrity.',
    features: ['Site Analysis & Planning', 'Concept Design', 'Construction Documentation', 'Project Management', '3D Visualization'],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'
  },
  {
    _id: 'd2', title: 'Interior Design', icon: '🪑',
    shortDescription: 'Curated interior environments that reflect your personality and lifestyle.',
    description: 'Our interior design approach merges functionality with beauty to create spaces that feel uniquely yours.',
    features: ['Space Planning', 'Furniture Selection', 'Material & Finishes', 'Lighting Design', 'Styling & Decor'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
  },
  {
    _id: 'd3', title: 'Space Planning', icon: '📐',
    shortDescription: 'Strategic spatial layouts that maximize efficiency and flow.',
    description: 'We analyze your needs and craft spatial solutions that make every square foot count.',
    features: ['Flow Analysis', 'Zoning Strategy', 'Ergonomic Planning', 'Modular Design', 'Future Flexibility'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
  },
]

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    servicesAPI.getAll().then(r => setServices(r.data.length ? r.data : DEFAULT_SERVICES)).catch(() => setServices(DEFAULT_SERVICES)).finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      {/* Header */}
      <section className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary to-primary" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-tag mb-4">What We Offer</p>
            <h1 className="section-title mb-6">Our Services</h1>
            <p className="font-body text-muted max-w-xl text-lg">
              End-to-end design solutions, from the first sketch to the final nail — we handle it all with precision and passion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-0">
          {(loading ? DEFAULT_SERVICES : services).map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`grid md:grid-cols-2 gap-0 border border-border ${i > 0 ? '-mt-px' : ''} group hover:border-accent/40 transition-colors duration-500`}
            >
              {/* Image */}
              <div className={`aspect-video md:aspect-auto overflow-hidden ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                {service.image ? (
                  <img src={service.image} alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 min-h-64" />
                ) : (
                  <div className="w-full h-full min-h-64 bg-surface flex items-center justify-center">
                    <span className="text-5xl">{service.icon || '🏛'}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-10 md:p-16 flex flex-col justify-center bg-secondary group-hover:bg-surface transition-colors duration-500">
                <div className="font-mono text-5xl text-accent/20 mb-4">0{i + 1}</div>
                <h2 className="font-display text-3xl md:text-4xl font-light text-light mb-4">{service.title}</h2>
                <p className="font-body text-muted mb-8 leading-relaxed">
                  {service.description || service.shortDescription}
                </p>
                {service.features?.length > 0 && (
                  <ul className="grid grid-cols-1 gap-3 mb-8">
                    {service.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3 font-body text-sm text-light/60">
                        <CheckCircle size={14} className="text-accent flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link to="/contact" className="btn-outline self-start">
                  Enquire <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Banner */}
      <section className="py-20 bg-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-light text-primary mb-6">
            Every project starts with<br /><span className="italic">a conversation</span>
          </h2>
          <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-light font-mono text-xs tracking-widest uppercase hover:bg-secondary transition-all">
            Let's Talk <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
