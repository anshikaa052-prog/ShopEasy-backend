const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://shop-easy-frontend-kdry4x4qa-anshikaa052-orggs-projects.vercel.app',
  'https://shop-easy-frontend-psi.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('Request from origin:', origin); // Debug ke liye
    // Postman ya server-to-server request ke liye origin null hota hai
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS BLOCKED:', origin);
      callback(new Error('CORS error: Origin not allowed'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 204
}));

// 👇 Ye line 404 preflight fix karegi - Sabse Important
app.options('*', cors()); 

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
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.log("MongoDB Error:", err);
  process.exit(1);  
});