const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken, authorizeRoles('admin'));

router.get('/dashboard', async (req, res) => {
  try {
    const [[usersCount]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[storesCount]] = await pool.query('SELECT COUNT(*) AS totalStores FROM stores');
    const [[ratingsCount]] = await pool.query('SELECT COUNT(*) AS totalRatings FROM ratings');

    res.json({
      totalUsers: usersCount.totalUsers,
      totalStores: storesCount.totalStores,
      totalRatings: ratingsCount.totalRatings,
    });
    } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add-user', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/add-store', async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id || null]
    );

    res.status(201).json({ message: 'Store added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/users', async (req, res) => {
  try {
    const { name = '', email = '', address = '', role = '' } = req.query;

    const [rows] = await pool.query(
      `SELECT id, name, email, address, role
       FROM users
       WHERE name LIKE ? AND email LIKE ? AND address LIKE ? AND role LIKE ?
       ORDER BY name ASC`,
      [`%${name}%`, `%${email}%`, `%${address}%`, `%${role}%`]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/stores', async (req, res) => {
  try {
    const { name = '', email = '', address = '' } = req.query;

    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating), 1) AS rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
       GROUP BY s.id
       ORDER BY s.name ASC`,
      [`%${name}%`, `%${email}%`, `%${address}%`]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const [rows] = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    if (user.role === 'owner') {
      const [[ratingRow]] = await pool.query(
        `SELECT ROUND(AVG(r.rating), 1) AS ownerRating
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ?`,
        [userId]
      );
      user.rating = ratingRow.ownerRating;
    }
     res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;