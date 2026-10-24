const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/auth');

// GET /api/projects
router.get('/', async (req, res) => {
  const { category, featured, limit } = req.query;
  let query = { published: true };
  if (category) query.category = category;
  if (featured === 'true') query.featured = true;
  let q = Project.find(query).sort({ order: 1, createdAt: -1 });
  if (limit) q = q.limit(parseInt(limit));
  const projects = await q;
  res.json(projects);
});

// GET /api/projects/all (admin)
router.get('/all', protect, admin, async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

// GET /api/projects/:slug
router.get('/:slug', async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, published: true });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

// POST /api/projects
router.post('/', protect, admin, async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

// PUT /api/projects/:id
router.put('/:id', protect, admin, async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

// DELETE /api/projects/:id
router.delete('/:id', protect, admin, async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ message: 'Project deleted' });
});

module.exports = router;
