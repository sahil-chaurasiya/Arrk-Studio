import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link to={`/projects/${project.slug}`} className="group block">
        <div className="relative overflow-hidden bg-surface aspect-[4/3]">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="font-mono text-xs text-muted">No Image</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all duration-500" />

          {/* Category tag */}
          <div className="absolute top-4 left-4">
            <span className="font-mono text-xs text-accent bg-primary/80 px-3 py-1 tracking-wider uppercase">
              {project.category}
            </span>
          </div>

          {/* Arrow */}
          <div className="absolute top-4 right-4 w-10 h-10 bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight size={18} className="text-primary" />
          </div>

          {/* Status */}
          {project.status === 'ongoing' && (
            <div className="absolute bottom-4 right-4">
              <span className="font-mono text-xs text-primary bg-accent px-2 py-0.5">Ongoing</span>
            </div>
          )}
        </div>

        <div className="pt-4 pb-2">
          <h3 className="font-display text-xl font-light text-light group-hover:text-accent transition-colors duration-300">
            {project.title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            {project.location && (
              <span className="font-mono text-xs text-muted">{project.location}</span>
            )}
            {project.year && (
              <>
                <span className="text-muted text-xs">·</span>
                <span className="font-mono text-xs text-muted">{project.year}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
