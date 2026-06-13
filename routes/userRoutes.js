const express = require('express');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: 'Signup Successful',
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 👇 YAHI CHANGE KIYA HAI - user.save() hata diya
router.put('/shipping', protect, async (req, res) => {
  try {
    const { address, city, postalCode, country } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        shippingAddress: { address, city, postalCode, country }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      shippingAddress: updatedUser.shippingAddress,
    });
  } catch (error) {
    console.log('Shipping Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;