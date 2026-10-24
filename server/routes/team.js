const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const team = await Team.find({ published: true }).sort({ order: 1 });
  res.json(team);
});

router.get('/all', protect, admin, async (req, res) => {
  const team = await Team.find().sort({ order: 1 });
  res.json(team);
});

router.post('/', protect, admin, async (req, res) => {
  const member = await Team.create(req.body);
  res.status(201).json(member);
});

router.put('/:id', protect, admin, async (req, res) => {
  const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(member);
});

router.delete('/:id', protect, admin, async (req, res) => {
  await Team.findByIdAndDelete(req.params.id);
  res.json({ message: 'Team member deleted' });
});

module.exports = router;
