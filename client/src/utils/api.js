import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('arrk_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getAllAdmin: () => api.get('/projects/all'),
  getBySlug: (slug) => api.get(`/projects/${slug}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
}

export const servicesAPI = {
  getAll: () => api.get('/services'),
  getAllAdmin: () => api.get('/services/all'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
}

export const teamAPI = {
  getAll: () => api.get('/team'),
  getAllAdmin: () => api.get('/team/all'),
  create: (data) => api.post('/team', data),
  update: (id, data) => api.put(`/team/${id}`, data),
  delete: (id) => api.delete(`/team/${id}`),
}

export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
  getAllAdmin: () => api.get('/testimonials/all'),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
}

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  update: (id, data) => api.put(`/contact/${id}`, data),
  delete: (id) => api.delete(`/contact/${id}`),
}

export const settingsAPI = {
  getAll: () => api.get('/settings'),
  getAllAdmin: () => api.get('/settings/all'),
  update: (data) => api.put('/settings', data),
}

export const uploadAPI = {
  single: (formData) => api.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  multiple: (formData) => api.post('/upload/multiple', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (public_id) => api.delete(`/upload/${encodeURIComponent(public_id)}`),
}

export default api
