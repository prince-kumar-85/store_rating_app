const express = require('express');
const pool = require('../db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken, authorizeRoles('owner'));

router.get('/dashboard', async (req, res) => {
  try {
    const [storeRows] = await pool.query('SELECT id, name FROM stores WHERE owner_id = ?', [req.user.id]);

    if (storeRows.length === 0) {
      return res.json({ averageRating: null, users: [], store: null });
    }

    const store = storeRows[0];
    const [[avgRow]] = await pool.query(
      'SELECT ROUND(AVG(rating), 1) AS averageRating FROM ratings WHERE store_id = ?',
      [store.id]
    );

    const [users] = await pool.query(
      `SELECT u.id, u.name, u.email, r.rating
       FROM ratings r
       INNER JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY u.name ASC`,
      [store.id]
    );

    res.json({
      store,
      averageRating: avgRow.averageRating,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;