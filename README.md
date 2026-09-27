# KurtiKraft — MERN Stack Ecommerce (Long & Short Kurtis)

Full-stack ecommerce website: React frontend, Node/Express backend, MongoDB database, Razorpay payment gateway, and an admin panel.

## 📁 Project Structure

```
kurti-ecommerce/
├── backend/          # Node + Express + MongoDB API
└── frontend/         # React app with plain CSS
```

## ⚙️ Prerequisites

- Node.js (v18+) installed
- MongoDB running locally (or a free MongoDB Atlas cluster)
- A Razorpay account (free) → https://dashboard.razorpay.com/ → get **Test Mode** API keys from Settings > API Keys

## 🚀 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/kurti-ecommerce   # or your Atlas connection string
JWT_SECRET=any_random_long_secret_string
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
CLIENT_URL=http://localhost:3000
```

Create your first admin account:
```bash
node seeder.js
```
This creates: `admin@kurtistore.com` / `admin123` — **login with this and change the password logic later if needed** (or just create a new admin directly in MongoDB).

Start the backend:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`

## 🎨 Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
cp .env.example .env
```

`.env` already points to `http://localhost:5000/api` by default — change only if your backend runs elsewhere.

Start the frontend:
```bash
npm start
```
Frontend runs at `http://localhost:3000`

## 🛍️ How to Add Products

1. Login with the admin account at `/login`
2. Go to `/admin/dashboard` → **Manage Products** → **Add New Kurti**
3. Fill details: name, type (long/short), price, color, sizes+stock
4. For images: paste direct image URLs (you can use free image hosts like Imgur, Cloudinary, or your own CDN — file upload isn't wired up yet, just URLs)
5. Check "Show on homepage as Featured" to display it on the home page

## 💳 Testing Razorpay Payments

In **Test Mode**, use these dummy card details at checkout:
- Card Number: `4111 1111 1111 1111`
- Expiry: any future date
- CVV: any 3 digits
- OTP: `1234` (or whatever the test popup shows)

No real money is charged in test mode.

## 🔑 Key Features Implemented

- Browse kurtis with filters: type (long/short), size, sort by price/rating
- Product detail page with size selection & stock display
- Cart (persisted in browser localStorage)
- Secure checkout: Razorpay order created on backend, payment signature verified on backend (prevents payment tampering)
- User auth (JWT) — register/login
- Order history for customers
- Admin panel: dashboard stats, add/edit/delete products, view & update order status
- Fully responsive design, custom CSS theme (no Tailwind/Bootstrap — pure CSS as requested)

## 🔜 Things You May Want to Add Later

- Image upload (Cloudinary/Multer) instead of pasting URLs
- Product reviews & ratings submission
- Email notifications on order placement
- Wishlist feature
- Coupon/discount codes
- Deploy: backend → Render/Railway, frontend → Vercel/Netlify, DB → MongoDB Atlas

## 🌐 Deployment Notes

- Set `CLIENT_URL` in backend `.env` to your deployed frontend URL (for CORS)
- Set `REACT_APP_API_URL` in frontend `.env` to your deployed backend URL
- Use **live** Razorpay keys only after KYC is approved on their dashboard — test keys won't work in production
