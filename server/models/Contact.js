const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  projectType: { type: String },
  budget: { type: String },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
