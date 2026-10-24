const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, admin } = require('../middleware/auth');

// GET /api/settings (public - returns non-sensitive settings)
router.get('/', async (req, res) => {
  const settings = await Settings.find({ group: { $ne: 'private' } });
  const obj = {};
  settings.forEach(s => { obj[s.key] = s.value; });
  res.json(obj);
});

// GET /api/settings/all (admin)
router.get('/all', protect, admin, async (req, res) => {
  const settings = await Settings.find();
  const obj = {};
  settings.forEach(s => { obj[s.key] = s.value; });
  res.json(obj);
});

// PUT /api/settings (admin - bulk update)
router.put('/', protect, admin, async (req, res) => {
  const updates = req.body;
  const promises = Object.entries(updates).map(([key, value]) =>
    Settings.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true })
  );
  await Promise.all(promises);
  res.json({ message: 'Settings updated' });
});

module.exports = router;
