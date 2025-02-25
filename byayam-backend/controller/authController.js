import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from 'validator'; 
import xssClean from 'xss-clean'; 
import xss from 'xss';
import { createUser, updatePassword,findUserByEmail,findUserForEmail, findUserByEmailOrUsername, getAllUsers,updateUser,deleteUser,findOtherUserByEmailOrUsername,getUserById } from '../model/userModel.js';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
// Signup
export const signup = async (req, res) => {
  const { username, email, password, gender, role='user' } = req.body;

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validator.matches(username, /^[a-zA-Z0-9_-]+$/)) {
      return res.status(400).json({ error: 'Invalid username format' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    console.log('Checking if user exists...');
    const sanitizedUsername = xss(username);
    const sanitizedEmail = xss(email);
    const sanitizedGender = xss(gender);
    const existingUser = await findUserByEmailOrUsername(email, username);

    if (existingUser && existingUser.length > 0) {
      console.log('User exists: ', existingUser);
      return res.status(400).json({ error: 'Username or Email already exists' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long' 
      });
    }
    console.log('Creating new user...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(sanitizedUsername, sanitizedEmail, hashedPassword, sanitizedGender, role);

    console.log('User created: ', newUser);
    
    if (!newUser) {
      console.log('Failed to create user');
      return res.status(500).json({ error: 'Failed to create user' });
    }

    console.log('Generating JWT...');
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role:newUser.role}, 
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
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
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
      { id: user.id, email: user.email , role: user.role}, // Make sure to use user.id and user.email
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Send the response with user data and token
    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email ,role: user.role},
      token,
    });

  } catch (error) {
    console.error('Login error:', error); // Logs full error details
    res.status(500).json({ error: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password in the database
    await updatePassword(email, hashedPassword);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
    console.log(users);
  } catch (error) {
    
    res.status(500).json({ error: 'Error fetching users' });
  }
};
export const getEmailUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await findUserForEmail(userId);
    res.json(users);
    console.log(users);
  } catch (error) {
    
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const updateUsers = async (req, res) => {
  const { id } = req.params;
  let updateData = { ...req.body };

  try {
    if (updateData.username) {
      updateData.username = xss(updateData.username); // Correct sanitization
    }
    if (updateData.email) {
      updateData.email = xss(updateData.email); // Apply XSS sanitization
    }
    
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check for email/username changes
    if (updateData.email || updateData.username) {
      const newEmail = updateData.email || existingUser.email;
      const newUsername = updateData.username || existingUser.username;

      // Check against other users
      const otherUser = await findOtherUserByEmailOrUsername(
        newEmail,
        newUsername,
        id
      );
      
      if (otherUser.length > 0) {
        return res.status(400).json({ error: 'Email/username already exists' });
      }
    }

    // Validate password
    if (updateData.password) {
      if (updateData.password.length < 8) {
        return res.status(400).json({ 
          error: 'Password must be at least 8 characters' 
        });
      }
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Perform update
    const updatedUser = await updateUser(id, updateData);
    res.json(updatedUser);

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};


export const deleteUsers  = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser  = await deleteUser (id);
    if (!deletedUser ) {
      return res.status(404).json({ error: 'User  not found' });
    }
    res.json({ message: 'User  deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};