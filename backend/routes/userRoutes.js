const express = require('express');
const pool = require('../db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken, authorizeRoles('user'));

router.get('/stores', async (req, res) => {
  try {
    const { name = '', address = '' } = req.query;

    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.address,
              ROUND(AVG(r.rating), 1) AS overall_rating,
              MAX(CASE WHEN r.user_id = ? THEN r.rating END) AS user_rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.name LIKE ? AND s.address LIKE ?
       GROUP BY s.id
       ORDER BY s.name ASC`,
      [req.user.id, `%${name}%`, `%${address}%`]
    );
     res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/rate-store', async (req, res) => {
  try {
    const { store_id, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [req.user.id, store_id]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
        [rating, req.user.id, store_id]
      );
      return res.json({ message: 'Rating updated successfully' });
    }

    await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [req.user.id, store_id, rating]
    );

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;