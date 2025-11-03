const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const storeOwnerMiddleware = require('../middleware/storeOwnerMiddleware');

// Protect all routes in this file
router.use(authMiddleware, storeOwnerMiddleware);

// @route   GET api/owner/dashboard
// @desc    Get dashboard data for the store owner's store
// @access  Private (Store Owner)
router.get('/dashboard', async (req, res) => {
  try {
    // Find the store owned by the logged-in user
    const [stores] = await db.query('SELECT id FROM stores WHERE owner_id = ?', [req.user.id]);
    if (stores.length === 0) {
      return res.status(404).json({ msg: 'No store associated with this owner. Try another?' });
    }
    const storeId = stores[0].id;

    // Get the average rating for that store
    const [avgRatingResult] = await db.query('SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = ?', [storeId]);
    const averageRating = avgRatingResult[0].average_rating || 0;

    // Get the list of users who rated this store
    const [ratingsList] = await db.query(`
      SELECT u.name, u.email, r.rating 
      FROM ratings r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.store_id = ?`, 
      [storeId]
    );

    res.json({
      averageRating,
      ratings: ratingsList
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;