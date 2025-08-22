const express = require('express');
const { body, validationResult } = require('express-validator'); // Import express-validator
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST api/users/signup
// @desc    Register a new user
router.post('/signup',
  // --- Add Validation Rules ---
  [
    body('name', 'Name must be between 20 and 60 characters').isLength({ min: 20, max: 60 }),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 8-16 characters and include one uppercase letter and one special character (!@#$&*)')
      .isLength({ min: 8, max: 16 })
      .matches(/^(?=.*[A-Z])(?=.*[!@#$&*])/),
    body('address', 'Address cannot exceed 400 characters').optional().isLength({ max: 400 }),
  ],
  async (req, res) => {
    // --- Check for Validation Errors ---
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address } = req.body;

    try {
      // Check for existing user
      let [users] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
      if (users.length > 0) {
        return res.status(400).json({ msg: 'User with that email already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save the user to the database
      const newUser = { name, email, password: hashedPassword, address, role: 'Normal User' };
      const [result] = await db.query('INSERT INTO users SET ?', newUser);

      res.status(201).json({
        msg: 'User registered successfully!',
        userId: result.insertId
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/users/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/me
// @desc    Get current logged-in user's data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, address, role FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(users[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/password
// @desc    Update user's password
router.put('/password',
  authMiddleware,
  // --- Add Validation Rules ---
  [
    body('newPassword', 'Password must be 8-16 characters and include one uppercase letter and one special character (!@#$&*)')
      .isLength({ min: 8, max: 16 })
      .matches(/^(?=.*[A-Z])(?=.*[!@#$&*])/),
  ],
  async (req, res) => {
    // --- Check for Validation Errors ---
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    try {
      const [users] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
      const user = users[0];
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid current password.' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
      res.json({ msg: 'Password updated successfully.' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;