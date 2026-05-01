# 🏛 ARRK Studio — Full Stack Website

A production-ready MERN stack website for **ARRK Studio**, an architectural design firm.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Image Upload | Cloudinary |
| Auth | JWT (JSON Web Tokens) |
| Animations | Framer Motion |

---

## 🗂 Project Structure

```
arrk-studio/
├── client/                  # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Public pages
│   │   │   └── admin/       # Admin panel pages
│   │   └── utils/           # API utilities
│   └── ...config files
│
├── server/                  # Express Backend
│   ├── config/              # Cloudinary config
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── seed.js              # Database seeder
│   └── index.js             # Entry point
│
├── package.json             # Root (concurrently)
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **Cloudinary** account (free tier works)

---

## 🚀 Setup Instructions

### Step 1 — Clone / Extract the project

```bash
cd arrk-studio
```

### Step 2 — Install all dependencies

```bash
npm run install-all
```

This installs dependencies for root, server, and client.

### Step 3 — Configure the server environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/arrk-studio

# Change this to a long random string in production!
JWT_SECRET=your_super_secret_jwt_key_change_this

# Get these from cloudinary.com (free account)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

### Step 4 — Getting Cloudinary Credentials

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. From your Dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Paste into `server/.env`

### Step 5 — Seed the database

```bash
cd server
node seed.js
```

This creates:
- ✅ Admin user: `admin@arrkstudio.com` / `Admin@1234`
- ✅ 3 default services
- ✅ 3 sample testimonials
- ✅ Default site settings

### Step 6 — Run the development server

```bash
# From the root directory
cd ..
npm run dev
```

This starts:
- 🖥 **Backend** at `http://localhost:5000`
- 🌐 **Frontend** at `http://localhost:5173`

---

## 🔐 Admin Panel

Access the admin panel at: `http://localhost:5173/admin`

**Default credentials:**
- Email: `admin@arrkstudio.com`
- Password: `Admin@1234`

> ⚠️ **Change the password after first login!**

### Admin Features

| Section | Features |
|---------|----------|
| **Dashboard** | Stats overview, recent messages |
| **Projects** | CRUD, image gallery, categories, featured toggle, publish/unpublish |
| **Services** | CRUD, images, feature lists, ordering |
| **Team** | CRUD, photos, social links |
| **Testimonials** | CRUD, ratings, featured toggle |
| **Contacts** | Inbox, status management, reply via email |
| **Settings** | Site info, contact details, social links, SEO, hero section |

---

## 🌐 Public Pages

| Route | Page |
|-------|------|
| `/` | Home (hero, stats, about, services, projects, testimonials, CTA) |
| `/projects` | Portfolio with category filters |
| `/projects/:slug` | Project detail with image gallery + lightbox |
| `/services` | Services with full descriptions |
| `/about` | About, team, studio info |
| `/contact` | Contact form with project type + budget |

---

## 📡 API Endpoints

```
POST   /api/auth/login           Login
POST   /api/auth/register        Register (first run only)
GET    /api/auth/me              Get current user

GET    /api/projects             Get published projects
GET    /api/projects/all         Get all projects (admin)
POST   /api/projects             Create project (admin)
PUT    /api/projects/:id         Update project (admin)
DELETE /api/projects/:id         Delete project (admin)

GET    /api/services             Get published services
POST   /api/services             Create service (admin)

GET    /api/team                 Get published team members
POST   /api/team                 Create team member (admin)

GET    /api/testimonials         Get published testimonials
POST   /api/testimonials         Create testimonial (admin)

POST   /api/contact              Submit contact form (public)
GET    /api/contact              Get all messages (admin)

GET    /api/settings             Get public settings
PUT    /api/settings             Update settings (admin)

POST   /api/upload/single        Upload one image
POST   /api/upload/multiple      Upload multiple images
DELETE /api/upload/:public_id    Delete from Cloudinary
```

---

## 🏗 Production Deployment

### Build the client

```bash
npm run build
```

### Set environment variables on your server

```env
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=very_long_random_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Start the server

```bash
cd server
npm start
```

The Express server will serve the React build from `client/dist`.

---

## 🎨 Customisation

### Brand Colors
Edit `client/tailwind.config.js`:
```js
accent: '#c9a96e',      // Gold accent — change to your brand color
primary: '#0a0a0a',     // Main dark background
secondary: '#1a1a1a',   // Card/panel background
```

### Fonts
Edit `client/index.html` — change Google Fonts links and update `tailwind.config.js` fontFamily.

### Logo
Replace the inline SVG in `Navbar.jsx` and `Footer.jsx` with your logo image:
```jsx
<img src="/logo.png" alt="ARRK Studio" className="h-10" />
```

---

## 📋 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `MONGO_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret for JWT signing | ✅ Yes |
| `JWT_EXPIRE` | Token expiry (default: 30d) | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ Yes |
| `NODE_ENV` | development / production | No |

---

## 🐛 Troubleshooting

**MongoDB connection fails:**
- Make sure MongoDB is running: `sudo systemctl start mongod`
- Or use MongoDB Atlas (cloud) and update `MONGO_URI`

**Cloudinary upload fails:**
- Double-check your `.env` credentials
- Ensure you're not on the wrong region

**Port already in use:**
- Change `PORT` in `server/.env`
- Change Vite port in `client/vite.config.js`

---

## 📄 License

Built for ARRK Studio. All rights reserved.
