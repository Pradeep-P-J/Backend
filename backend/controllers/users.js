import nodemailer from 'nodemailer';
import User from '../models/User.js';

// @desc    Register a new user
export const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// @desc    Login User
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });

    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

// @desc    Fetch all users (Optional for admin/debug)
export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

// @desc    Forgot Password - Send Reset Link
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create a reset link (In production, use JWT or tokenized link)
    const resetLink = `http://localhost:5173/reset-password/${user._id}`;

    // Setup nodemailer transporter (configure in .env)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email from .env
        pass: process.env.EMAIL_PASS, // App password from .env
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Link',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error });
  }
};
