const jwt = require('jsonwebtoken')
const User = require('../models/User') // Ye sahi hai

const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('DECODED ID:', decoded.id) // <-- Debug ke liye

      req.user = await User.findById(decoded.id).select('-password')
      console.log('USER MILA:', req.user) // <-- Debug ke liye

      if (!req.user) {
        return res.status(401).json({ message: 'User not found, token invalid' })
      }

      next()
    } catch (error) {
      console.error('TOKEN ERROR:', error.message)
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
}

module.exports = { protect }