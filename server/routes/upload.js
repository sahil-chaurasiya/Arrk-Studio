const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/auth');

// POST /api/upload/single
router.post('/single', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: req.file.path, public_id: req.file.filename });
});

// POST /api/upload/multiple
router.post('/multiple', protect, upload.array('images', 20), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
  const files = req.files.map(f => ({ url: f.path, public_id: f.filename }));
  res.json(files);
});

// DELETE /api/upload/:public_id
router.delete('/:public_id', protect, admin, async (req, res) => {
  const public_id = decodeURIComponent(req.params.public_id);
  await cloudinary.uploader.destroy(public_id);
  res.json({ message: 'Image deleted' });
});

module.exports = router;
