const User = require('../models/user'); // Pastikan model User sudah dibuat
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const errors = [];
  
      // Check if username already exists
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        errors.push({ username: 'Username has already been taken' });
      }
  
      // Check if email already exists
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        errors.push({ email: 'Email has already been registered' });
      }
  
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Failed registration', data: errors });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword });
  
      // Generate token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({
        message: 'User registered successfully',
        token,
        username: user.username,
        email: user.email
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed registration', data: [{ server: error.message }] });
    }
  };
  
  

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
    try {
      console.log("getUser called", req.userData);
      const user = await User.findByPk(req.userData.userId, {
        attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };