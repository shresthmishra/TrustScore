const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs'); // Import bcryptjs
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// This middleware will protect all subsequent routes in this file
router.use(authMiddleware, adminMiddleware);

// @route   GET api/admin/stats
// @desc    Get site-wide statistics
// @access  Private (Admin)
router.get('/stats', async (req, res) => {
  try {
    const [userCount] = await db.query("SELECT COUNT(*) as count FROM users");
    const [storeCount] = await db.query("SELECT COUNT(*) as count FROM stores");
    const [ratingCount] = await db.query("SELECT COUNT(*) as count FROM ratings");

    res.json({
      users: userCount[0].count,
      stores: storeCount[0].count,
      ratings: ratingCount[0].count,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/users
// @desc    Get a list of all users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, address, role FROM users');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/users
// @desc    Create a new user by an admin
// @access  Private (Admin)
router.post('/users', async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      address,
      role,
    };

    const [result] = await db.query('INSERT INTO users SET ?', newUser);
    res.status(201).json({ msg: 'User created successfully', userId: result.insertId });
  } catch (err) {
    console.error(err.message);
    // Send a more specific error if the email is a duplicate
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ msg: 'An account with this email already exists. Try another one.' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;