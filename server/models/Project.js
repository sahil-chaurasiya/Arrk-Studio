const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  category: { type: String, enum: ['architecture', 'interior', 'space-planning', 'commercial', 'residential', 'renovation'], required: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  coverImage: { type: String, required: true },
  images: [{ url: String, caption: String }],
  location: { type: String },
  area: { type: String },
  year: { type: Number },
  client: { type: String },
  status: { type: String, enum: ['completed', 'ongoing', 'concept'], default: 'completed' },
  featured: { type: Boolean, default: false },
  tags: [String],
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
