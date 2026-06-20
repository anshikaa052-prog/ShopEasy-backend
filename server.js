const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// CORS FIX - Vercel + Localhost dono allow
app.use(cors({
  origin: function (origin, callback) {
    // Postman ya server-to-server request ke liye allow
    if (!origin) return callback(null, true);
    
    // Saare vercel.app subdomains + localhost allow karo
    if (origin.endsWith('.vercel.app') || origin === 'http://localhost:3000') {
      return callback(null, true);
    }
    
    // Agar koi aur specific domain add karna ho
    const allowedOrigins = [
      'https://shop-easy-frontend-psi.vercel.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('CORS policy: Origin not allowed'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('ShopEasy Backend Chal Gaya Bhai!');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected Successfully");
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
.catch(err => {
  console.log("MongoDB Error:", err);
  process.exit(1);
});