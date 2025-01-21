import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createUser, findUserByEmail, findUserByEmailOrUsername } from '../model/userModel.js';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
// Signup
export const signup = async (req, res) => {
  const { username, email, password, gender } = req.body;

  try {
    console.log('Checking if user exists...');
    const existingUser = await findUserByEmailOrUsername(email, username);

    if (existingUser && existingUser.length > 0) {
      console.log('User exists: ', existingUser);
      return res.status(400).json({ error: 'Username or Email already exists' });
    }

    console.log('Creating new user...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, email, hashedPassword, gender);

    console.log('User created: ', newUser);
    
    if (!newUser) {
      console.log('Failed to create user');
      return res.status(500).json({ error: 'Failed to create user' });
    }

    console.log('Generating JWT...');
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email }, 
      jwtSecret, 
      { expiresIn: '24h' }
    );

    console.log('Sending response...');
    res.status(201).json({ message: 'User created successfully', token });

  } catch (error) {
    console.error('Signup error:', error); // Logs full error details
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};



// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    // If no user is found, return an error
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);  // Compare with user.password

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // If the password is correct, generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Make sure to use user.id and user.email
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Send the response with user data and token
    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });

  } catch (error) {
    console.error('Login error:', error); // Logs full error details
    res.status(500).json({ error: 'Server error' });
  }
};

