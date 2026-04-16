const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

const isValidName = (name) =>
  typeof name === 'string' &&
  name.trim().length >= 10 &&
  name.trim().length <= 60;

const isValidAddress = (address) =>
  typeof address === 'string' && address.length <= 400;

const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password);

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const allowedRoles = ['admin', 'user', 'owner'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    if (!isValidName(name)) {
      return res.status(400).json({ message: 'Name must be 10 to 60 characters' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Password must be 8-16 chars with one uppercase and one special character',
      });
    }

    if (!isValidAddress(address)) {
      return res.status(400).json({ message: 'Address max length is 400' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, userRole]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log('SIGNUP ERROR:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    console.log('LOGIN ERROR:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/update-password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ message: 'New password is not valid' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;