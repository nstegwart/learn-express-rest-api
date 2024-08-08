const User = require('../models/user');
const OTP = require('../models/otp');
const { Op } = require('sequelize');

const nodemailer = require('nodemailer');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendEmail = async (to, subject, text) => {
  console.log(
    'CHECK EMAIL',
    process.env.NODEMAIL_EMAIL,
    process.env.NODEMAIL_PASSWORD
  );
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAIL_EMAIL,
      pass: process.env.NODEMAIL_PASSWORD,
    },
  });

  const mailSend = await transporter.sendMail({
    from: process.env.NODEMAIL_EMAIL,
    to,
    subject,
    text,
  });
  console.log('CHECK EMAIL', mailSend);
  return mailSend;
};

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
      return res
        .status(400)
        .json({ message: 'Failed registration', data: errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({
      userId: user.id,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
    });

    // Send email
    await sendEmail(
      user.email,
      'OTP for Account Verification',
      `Your OTP is: ${otp}`
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed registration',
      data: [{ server: error.message }],
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    console.log('USER', email, password, user);
    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    console.log('getUser called', req.userData);
    const user = await User.findByPk(req.userData.userId, {
      attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.userData.userId;

    const validOTP = await OTP.findOne({
      where: {
        userId: userId,
        otp,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!validOTP) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await User.update({ isVerified: true }, { where: { id: userId } });
    await OTP.destroy({ where: { userId: userId } });

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update or create new OTP record
    await OTP.upsert({
      userId: user.id,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
    });

    // Send email
    await sendEmail(
      user.email,
      'New OTP for Account Verification',
      `Your new OTP is: ${otp}`
    );

    res.json({ message: 'New OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
