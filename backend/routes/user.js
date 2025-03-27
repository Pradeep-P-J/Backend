import express from 'express';
import { registerUser, loginUser, fetchUsers } from '../controllers/users.js';
import { forgotPassword } from '../controllers/users.js';
import { Router } from 'express';
const router = express.Router();
router.post('/forgot-password', forgotPassword);

// @route   POST /api/register
router.post('/register', registerUser);

// @route   POST /api/login
router.post('/login', loginUser);

// @route   GET /api/users
router.get('/users', fetchUsers); // Optional: For admin/debugging

// POST /api/register
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
  
    try {
      // Optional: Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      // Create new user
      const newUser = new User({ username, password, email });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "Registration failed", error: err.message });
    }
  });
  

export default router;
