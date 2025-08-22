// Add this to the top with your other imports
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST api/users/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
    const { name, email, password, address } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all required fields' });
    }

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
        const newUser = {
            name,
            email,
            password: hashedPassword,
            address,
            role: 'Normal User' // Default role for signup
        };

        const [result] = await db.query('INSERT INTO users SET ?', newUser);

        res.status(201).json({
            msg: 'User registered successfully!',
            userId: result.insertId
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

// @route   POST api/users/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const user = users[0];

        // Compare submitted password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // User is authenticated, create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // Token expires in 5 hours
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
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // The user's id is available from the middleware via req.user.id
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