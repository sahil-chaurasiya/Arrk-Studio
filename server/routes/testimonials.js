const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const testimonials = await Testimonial.find({ published: true }).sort({ order: 1 });
  res.json(testimonials);
});

router.get('/all', protect, admin, async (req, res) => {
  const testimonials = await Testimonial.find().sort({ order: 1 });
  res.json(testimonials);
});

router.post('/', protect, admin, async (req, res) => {
  const t = await Testimonial.create(req.body);
  res.status(201).json(t);
});

router.put('/:id', protect, admin, async (req, res) => {
  const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(t);
});

router.delete('/:id', protect, admin, async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ message: 'Testimonial deleted' });
});

module.exports = router;
