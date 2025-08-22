const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @route   GET api/stores
// @desc    Get all stores with their average rating
// @access  Public
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT s.id, s.name, s.address, s.email, COALESCE(AVG(r.rating), 0) as average_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
        `;
        const [stores] = await db.query(query);
        res.json(stores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stores
// @desc    Add a new store
// @access  Private (Admin only)
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
    const { name, email, address } = req.body;
    try {
        const newStore = { name, email, address };
        const [result] = await db.query('INSERT INTO stores SET ?', newStore);
        res.status(201).json({ id: result.insertId, ...newStore });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stores/:storeId/ratings
// @desc    Rate a store or update a rating
// @access  Private
router.post('/:storeId/ratings', authMiddleware, async (req, res) => {
    const { rating } = req.body;
    const { storeId } = req.params;
    const userId = req.user.id;

    // Validate the rating
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ msg: 'Rating must be between 1 and 5.' });
    }

    try {
        const query = `
            INSERT INTO ratings (user_id, store_id, rating) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE rating = ?;
        `;
        await db.query(query, [userId, storeId, rating, rating]);

        res.status(200).json({ msg: 'Rating submitted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;