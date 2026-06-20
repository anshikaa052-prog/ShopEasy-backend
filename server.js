const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// SIMPLE CORS - Sab allow kar abhi. Baad me lock karenge
app.use(cors({
  origin: true,
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization'],
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