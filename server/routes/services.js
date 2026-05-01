const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const services = await Service.find({ published: true }).sort({ order: 1 });
  res.json(services);
});

router.get('/all', protect, admin, async (req, res) => {
  const services = await Service.find().sort({ order: 1 });
  res.json(services);
});

router.post('/', protect, admin, async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
});

router.put('/:id', protect, admin, async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(service);
});

router.delete('/:id', protect, admin, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: 'Service deleted' });
});

module.exports = router;
