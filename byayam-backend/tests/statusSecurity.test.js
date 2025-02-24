import request from 'supertest';
import app from '../index.js'; 
import jwt from 'jsonwebtoken';
import { addStatusLog, getStateByUserId, deleteStatusLog, updateStatusLog, getStatusById } from '../model/workoutModel.js';
import { pool } from '../db/db.js';

jest.mock('../model/workoutModel.js');


const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

describe('Workout Status Security Tests', () => {
    afterAll(async () => {
        await pool.end();
    });
  it('should prevent SQL injection in input fields', async () => {
    const sqlInjectionPayload = {
      age: "1; DROP TABLE users;",
      height: "180; DELETE FROM workouts;",
      weight: "75; SELECT * FROM users;",
      gender: "male",
      fitness_level: "beginner"
    };

    getStateByUserId.mockResolvedValue([]); // Mock database response to simulate new entry
    addStatusLog.mockResolvedValue({ id: 1, ...sqlInjectionPayload });

    const response = await request(app)
      .post('/api/protected/status/Status')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(sqlInjectionPayload);

    expect(response.status).toBe(400); // Expect rejection due to invalid numerical values
    expect(response.body.error).toContain('Age, height, and weight must be valid numbers');
  });

  // Test for XSS Attack Prevention
  it('should prevent XSS attacks by sanitizing inputs', async () => {
    const xssPayload = {
      age: '25',
      height: '180',
      weight: '75',
      gender: `<script>alert('Hacked!')</script>`,
      fitness_level: 'beginner'
    };

    getStateByUserId.mockResolvedValue([]); // Mock database response
    addStatusLog.mockResolvedValue({ id: 1, ...xssPayload });

    const response = await request(app)
      .post('/api/protected/status/Status')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(xssPayload);

    expect(response.status).toBe(400); // Should reject invalid gender input
    expect(response.body.error).toContain('Invalid gender');
  });

  // Test for 404 Unknown Route
  it('should return 404 for an unknown route', async () => {
    const response = await request(app)
      .get('/api/protected/status/unknown-route')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Route not found');
  });

});
