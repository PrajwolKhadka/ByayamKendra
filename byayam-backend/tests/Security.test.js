import request from 'supertest';
import app from '../index.js'; // Import your Express app
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../db/db.js';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

// Helper function to generate a valid JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' });
};

describe('Workout Tracker API Tests', () => {
    afterAll(async () => {
        await pool.end();
      });
  let token;

  beforeAll(async () => {
    // Generate a token for a test user
    token = generateToken('testUser Id');
  });

  afterAll(async () => {
    // Clean up any resources that are being used
  });

  // Test for SQL Injection
  test('should prevent SQL injection in addWorkout', async () => {
    const sqlInjectionPayload = {
      workoutName: "Leg Press'; DROP TABLE workouts; --",
      weight: 100,
      reps: 10,
      description: "Test description"
    };

    const response = await request(app)
      .post('/api/protected/tracker/workouts') // Adjust the endpoint as necessary
      .set('Authorization', `Bearer ${token}`)
      .send(sqlInjectionPayload);

    expect(response.status).toBe(400); // Expect a 400 status code
  });

  // Test for XSS Attack
  test('should prevent XSS in addWorkout', async () => {
    const xssPayload = {
      workoutName: "<script>alert('XSS')</script>",
      weight: 100,
      reps: 10,
      description: "Test description"
    };

    const response = await request(app)
      .post('/api/protected/tracker/workouts') 
      .set('Authorization', `Bearer ${token}`)
      .send(xssPayload);

    expect(response.status).toBe(400);
  });

  // Test for 404 Unknown Route
  test('should return 404 for unknown route', async () => {
    const response = await request(app)
      .get('/api/protected/tracker/unknown-route'); // Adjust the endpoint as necessary

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Route not found'); // Adjust based on your error handling
  });
});