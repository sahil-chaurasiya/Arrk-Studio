const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/auth');

// POST /api/contact (public)
router.post('/', async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({ message: 'Message sent successfully', id: contact._id });
});

// GET /api/contact (admin)
router.get('/', protect, admin, async (req, res) => {
  const { status } = req.query;
  let query = {};
  if (status) query.status = status;
  const contacts = await Contact.find(query).sort({ createdAt: -1 });
  res.json(contacts);
});

// PUT /api/contact/:id (admin)
router.put('/:id', protect, admin, async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(contact);
});

// DELETE /api/contact/:id (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: 'Contact deleted' });
});

module.exports = router;
