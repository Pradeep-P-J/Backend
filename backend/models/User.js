import mongoose from 'mongoose';

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,         // Prevent duplicate usernames
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {                // Optional: Add email field
    type: String,
    required: false,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the User model
const User = mongoose.model('User', userSchema);
export default User;
