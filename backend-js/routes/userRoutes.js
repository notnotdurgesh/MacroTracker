import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../database/user.js';
import { validate, registerSchema, loginSchema } from '../validations/zod.js';
const router = express.Router();

// Registration Route
router.post('/register', validate(registerSchema), async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ success: false, error: 'Username already taken.' });
        }

        const user = new User({ username, password });
        await user.save();
        res.status(201).send({ success: true, message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});


// Login Route
router.post('/login', validate(loginSchema), async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({ success: false, error: 'Invalid username or password.' });
        }

        const validPassword = await user.comparePassword(password);
        if (!validPassword) {
            return res.status(400).send({ success: false, error: 'Invalid username or password.' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.send({ success: true, token });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});

export default router;
