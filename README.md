# MyShop — Full-Stack E-Commerce App

A full-stack e-commerce web application built with **React + Vite**, **Express**, and **MongoDB Atlas**. Deployed on **Netlify** (frontend) with Firebase Authentication.

---

## 🚀 Live Demo

**Frontend:** https://lustrous-syrniki-1db7db.netlify.app

---

## 🗂️ Project Structure

```
my-shop/
├── public/                    # Static assets (favicon, icons)
├── src/                       # React frontend
│   ├── api/
│   │   └── client.js          # All API calls + offline fallback logic
│   ├── assets/                # Images
│   ├── components/
│   │   ├── AdminRoute.jsx     # Protects /admin routes (admin only)
│   │   ├── DashboardLayout.jsx # Shared sidebar layout for dashboards
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx         # Sticky navbar with search, cart, auth, theme toggle
│   │   ├── ProductCard.jsx    # Reusable product card component
│   │   └── ProtectedRoute.jsx # Protects routes that require login
│   ├── config/
│   │   └── admins.js          # List of admin email addresses
│   ├── context/
│   │   ├── AuthContext.jsx    # Firebase auth state + admin role detection
│   │   └── ThemeContext.jsx   # Dark/light theme with localStorage persistence
│   ├── data/
│   │   ├── products.js        # Seed product data (offline fallback)
│   │   └── reviews.js         # Seed review data (offline fallback)
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx  # Overview stats, products, reviews
│   │   │   ├── AdminOrders.jsx     # Orders table with status badges
│   │   │   ├── AdminProducts.jsx   # Full CRUD: add, edit, delete products
│   │   │   ├── AdminReviews.jsx    # Review moderation (filter + remove)
│   │   │   └── AdminUsers.jsx      # User list
│   │   ├── dashboard/
│   │   │   ├── UserDashboard.jsx   # User overview (cart, reviews, quick links)
│   │   │   ├── UserOrders.jsx      # Current cart as pending order
│   │   │   ├── UserProfile.jsx     # Edit display name, view account info
│   │   │   ├── UserReviews.jsx     # Reviews submitted by user
│   │   │   └── UserWishlist.jsx    # Top-rated product suggestions
│   │   ├── CartPage.jsx
│   │   ├── FeedbackPage.jsx        # Submit review form
│   │   ├── HomePage.jsx            # Hero + features + categories + products + testimonials
│   │   ├── LoginPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ProductsPage.jsx        # Filter + sort sidebar
│   │   └── SignupPage.jsx
│   ├── store/
│   │   ├── cartStore.js       # Zustand: cart items (add, remove, update qty)
│   │   ├── feedbackStore.js   # Zustand: legacy feedback (superseded by reviewStore)
│   │   ├── productStore.js    # Zustand: products with localStorage persistence
│   │   └── reviewStore.js     # Zustand: reviews with localStorage persistence
│   ├── App.jsx                # All routes defined here
│   ├── firebase.js            # Firebase app + auth + Google provider
│   ├── index.css              # Tailwind CSS v4 import
│   └── main.jsx               # App entry point, wraps ThemeProvider + AuthProvider
├── server/                    # Express backend
│   ├── models/
│   │   ├── Product.js         # Mongoose product schema
│   │   └── Review.js          # Mongoose review schema
│   ├── routes/
│   │   ├── products.js        # GET, POST, PUT, DELETE /api/products
│   │   └── reviews.js         # GET, POST /api/reviews
│   ├── index.js               # Express app entry point
│   ├── seed.js                # Seeds MongoDB with default products + reviews
│   └── .env                   # MongoDB URI + port (not committed to git)
├── netlify.toml               # Netlify build config + SPA redirect rule
└── vite.config.js             # Vite config with Tailwind plugin + API proxy
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | Zustand v5 (cart, products, reviews) |
| Auth | Firebase v12 (Email/Password + Google) |
| Backend | Express 4, Node.js (ESM) |
| Database | MongoDB Atlas via Mongoose 8 |
| Deployment | Netlify (frontend) |

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (or local MongoDB)
- A Firebase project with Email/Password and Google auth enabled

### 1. Clone and install frontend dependencies

```bash
cd my-shop
npm install
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure the backend

Create `server/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.cmtkdi2.mongodb.net/myshop?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Replace `<username>` and `<password>` with your Atlas credentials.

### 4. Seed the database

```bash
cd server
npm run seed
```

This clears and repopulates the `products` and `reviews` collections with default data.

### 5. Start the backend

```bash
cd server
npm run dev
```

Server runs on `http://localhost:5000`. Uses `node --watch` for auto-reload.

### 6. Start the frontend

```bash
cd my-shop
npm run dev
```

Frontend runs on `http://localhost:5173`. Vite proxies `/api/*` → `http://localhost:5000/api`.

---

## 🔑 Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a project → add a web app
3. Copy the config into `src/firebase.js`
4. Authentication → Sign-in method → enable **Email/Password** and **Google**

The Firebase config is already set in `src/firebase.js` for the `my-shop-52e32` project.

---

## 👤 Role System

Roles are determined by email address — no backend changes needed.

**To grant admin access**, open `src/config/admins.js` and add the email:

```js
export const ADMIN_EMAILS = [
  'sakib08.dev@gmail.com',
];
```

| Role | Access |
|---|---|
| Guest | Browse products, view reviews |
| User (logged in) | All of above + cart, feedback, `/dashboard` |
| Admin | All of above + `/admin` panel |

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api`.

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | List products (supports `search`, `category`, `sort`, `page`, `limit`) |
| `GET` | `/products/categories` | List distinct categories |
| `GET` | `/products/:id` | Single product by MongoDB `_id` |
| `POST` | `/products` | Create product (admin) |
| `PUT` | `/products/:id` | Update product (admin) |
| `DELETE` | `/products/:id` | Delete product (admin) |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reviews` | List all reviews (newest first) |
| `POST` | `/reviews` | Submit a new review |

---

## 📴 Offline / No-Backend Mode

The app works **without the Express server running** (e.g. on Netlify static hosting).

When any API call fails:
- **Products** — served from `useProductStore` (Zustand + localStorage), seeded from `src/data/products.js`
- **Reviews** — served from `useReviewStore` (Zustand + localStorage), seeded from `src/data/reviews.js`
- **Submitted reviews** — saved to Zustand immediately, appear on the home page
- **Admin product changes** — saved to Zustand (persist across page reloads)

When the backend comes back online, it takes over automatically.

---

## 🎨 Dark Mode

Theme is toggled by the moon/sun button in the Navbar.

- Preference persists in `localStorage`
- Defaults to the OS `prefers-color-scheme` setting on first visit
- Implemented via a `dark` class on `<html>` using Tailwind's `@custom-variant dark`
- Managed by `ThemeContext`

---

## 📦 Deployment (Netlify)

The `netlify.toml` at the project root configures the build:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200
```

The `[[redirects]]` rule is essential for React Router — without it, any direct URL (e.g. `/products/123`) returns a 404 on refresh.

To deploy:
1. Push to GitHub
2. Connect the repo to Netlify
3. Netlify auto-builds on every push to `main`

**The Express server is not deployed on Netlify.** To deploy the backend use Render, Railway, or any Node.js host. Set `VITE_API_URL` in Netlify environment variables to point to the deployed backend URL.

---

## 🗄️ Database

**MongoDB Atlas** — Cluster: `Cluster0`, database: `myshop`

Collections:
- `products` — product catalogue
- `reviews` — customer reviews

To reset the database to the original seed data:

```bash
cd server
npm run seed
```

---

## 📋 Key Workflows

### Adding a product as admin
1. Sign in with an admin email
2. Navbar → avatar → **Admin Panel**
3. `/admin/products` → **Add Product** button
4. Fill in the form → **Add Product**
5. Product is saved to MongoDB and immediately visible in the shop

### Submitting a review
1. Visit `/feedback` (or Navbar → Feedback)
2. Fill in name, email, rating, message → **Submit Review**
3. Review is saved to both the backend (if online) and Zustand store
4. Appears immediately in the **Customer Reviews** section on the home page

### Seeding / resetting data
```bash
cd server
npm run seed   # clears + repopulates products and reviews in Atlas
```

---

## 🔐 Security Notes

- **Never commit `server/.env`** — it's in `.gitignore`
- The MongoDB Atlas credentials have been shared in chat history — **change the password** at [cloud.mongodb.com](https://cloud.mongodb.com) → Database Access
- Firebase web config keys are safe to expose publicly (they're designed to be)
- Admin role is currently email-based. For production, use Firebase Custom Claims or a roles collection in MongoDB

---

## 📅 Built

July 2026 — developed iteratively with Kiro AI.
