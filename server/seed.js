require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const Project = require('./models/Project');
const Testimonial = require('./models/Testimonial');
const Settings = require('./models/Settings');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Create admin user
  const existingUser = await User.findOne({ email: 'admin@arrkstudio.com' });
  if (!existingUser) {
    await User.create({ name: 'ARRK Admin', email: 'admin@arrkstudio.com', password: 'Admin@1234', role: 'admin' });
    console.log('✅ Admin user created: admin@arrkstudio.com / Admin@1234');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Seed Services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        title: 'Architecture Design',
        icon: '🏛',
        shortDescription: 'Comprehensive architectural design from site analysis to construction documents.',
        description: 'We create buildings that are both beautiful and functional, seamlessly blending aesthetics with structural integrity. Our architectural design process encompasses everything from the initial site analysis to the final construction documents, ensuring every detail is considered.',
        features: ['Site Analysis & Planning', 'Concept Design', '3D Visualization', 'Construction Documentation', 'Project Management'],
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
        order: 1,
        published: true
      },
      {
        title: 'Interior Design',
        icon: '🪑',
        shortDescription: 'Curated interior environments that reflect your personality and lifestyle.',
        description: 'Our interior design approach merges functionality with beauty to create spaces that feel uniquely yours. We carefully curate every element — from furniture and lighting to materials and accessories — to craft interiors that tell your story.',
        features: ['Space Planning', 'Furniture Selection', 'Material & Finishes', 'Lighting Design', 'Styling & Decor'],
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        order: 2,
        published: true
      },
      {
        title: 'Space Planning',
        icon: '📐',
        shortDescription: 'Strategic spatial layouts that maximize efficiency and flow.',
        description: 'We analyze your needs and craft spatial solutions that make every square foot count. Through careful study of how people interact with space, we design layouts that feel natural, functional, and effortlessly organized.',
        features: ['Flow Analysis', 'Zoning Strategy', 'Ergonomic Planning', 'Modular Design', 'Future Flexibility'],
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        order: 3,
        published: true
      }
    ]);
    console.log('✅ Services seeded');
  }

  // Seed default settings
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    const defaultSettings = [
      { key: 'site_name', value: 'ARRK Studio', group: 'general' },
      { key: 'site_tagline', value: 'From Concept to Creation', group: 'general' },
      { key: 'about_short', value: 'ARRK Studio is a full-service architectural design firm specializing in architecture, interior design, and space planning.', group: 'general' },
      { key: 'contact_phone', value: '+91 XXXXX XXXXX', group: 'contact' },
      { key: 'contact_email', value: 'hello@arrkstudio.com', group: 'contact' },
      { key: 'social_instagram', value: 'https://instagram.com/arrkstudio', group: 'social' },
      { key: 'stat_projects', value: '50+', group: 'general' },
      { key: 'stat_experience', value: '8+', group: 'general' },
      { key: 'stat_clients', value: '40+', group: 'general' },
      { key: 'stat_awards', value: '5+', group: 'general' },
      { key: 'meta_title', value: 'ARRK Studio — Architecture & Interior Design', group: 'seo' },
      { key: 'meta_description', value: 'From concept to creation — ARRK Studio crafts exceptional architectural and interior design experiences.', group: 'seo' },
      { key: 'hero_heading', value: 'Spaces That Inspire', group: 'hero' },
      { key: 'hero_subheading', value: 'Architecture · Interior Design · Space Planning', group: 'hero' },
      { key: 'hours_weekday', value: '9:00 AM – 6:00 PM', group: 'contact' },
      { key: 'hours_saturday', value: '10:00 AM – 4:00 PM', group: 'contact' },
    ];
    await Settings.insertMany(defaultSettings);
    console.log('✅ Settings seeded');
  }

  // Seed sample testimonial
  const testCount = await Testimonial.countDocuments();
  if (testCount === 0) {
    await Testimonial.insertMany([
      {
        name: 'Priya Sharma',
        role: 'Homeowner',
        content: 'ARRK Studio transformed our house into a dream home. Their attention to detail and understanding of our vision was extraordinary. The team was professional, creative, and delivered beyond our expectations.',
        rating: 5,
        featured: true,
        published: true,
        order: 1
      },
      {
        name: 'Rahul Mehta',
        role: 'CEO',
        company: 'Mehta Ventures',
        content: 'We hired ARRK Studio for our new commercial office space and the results were stunning. They created an environment that truly reflects our brand and motivates our team every day.',
        rating: 5,
        featured: true,
        published: true,
        order: 2
      },
      {
        name: 'Ananya Singh',
        role: 'Restaurant Owner',
        content: 'The interior design for our restaurant exceeded all expectations. ARRK Studio created an ambiance that our customers constantly compliment. Our bookings have increased significantly since the renovation.',
        rating: 5,
        featured: true,
        published: true,
        order: 3
      }
    ]);
    console.log('✅ Testimonials seeded');
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Admin Login: admin@arrkstudio.com');
  console.log('🔑 Password: Admin@1234');
  console.log('\n⚠️  Please change the admin password after first login!');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
