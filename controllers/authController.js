const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { username, email, password } = req.body;
  
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
  
    try {
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ error: 'User registration failed', details: error.message });
    }
  };
  

const login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token, isAdmin: user.isAdmin });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

module.exports = { register, login };
