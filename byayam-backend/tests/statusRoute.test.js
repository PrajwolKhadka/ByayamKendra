import request from 'supertest';
import app from '../index.js';
import * as workoutModel from '../model/workoutModel.js';
import jwt from 'jsonwebtoken';
import { pool } from '../db/db.js';
jest.mock('../model/workoutModel.js');

jest.mock('../middleware/verifyToken.js', () => (req, res, next) => {
  req.user = { id: 1 }; 
  next();
});

const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

describe('Workout Status Routes Tests', () => {
  afterAll(async () => {
    await pool.end();
  });

  test('GET /api/protected/status/Status should return user status', async () => {
    const mockStatus = [{ id: 1, age: 25, height: 175, weight: 70, gender: 'male', fitness_level: 'beginner' }];
    workoutModel.getStateByUserId.mockResolvedValue(mockStatus);

    const res = await request(app)
      .get('/api/protected/status/Status')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual(mockStatus);
  });

  test('POST /api/protected/status/Status should add a status', async () => {
    const mockStatus = { 
      id: 1, 
      age: 25, 
      height: 175, 
      weight: 70, 
      gender: 'male', 
      fitness_level: 'beginner'
    };
    workoutModel.getStateByUserId.mockResolvedValue([]); 
    workoutModel.addStatusLog.mockResolvedValue(mockStatus);
  
    const res = await request(app)
      .post('/api/protected/status/Status')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ 
        age: 25, 
        height: 175, 
        weight: 70, 
        gender: 'male', 
        fitness_level: 'beginner' 
      });
    
    console.log(res.body); // Add this to check the response details.
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Workout log saved successfully', newLog: mockStatus });
  });
  

  test('PUT /api/protected/status/Status/:id should update a status', async () => {
    const updatedStatus = { 
      id: 1, 
      age: 26, 
      height: 176, 
      weight: 72, 
      gender: 'male', 
      fitness_level: 'intermediate'
    };
    workoutModel.updateStatusLog.mockResolvedValue(updatedStatus);
  
    const res = await request(app)
      .put('/api/protected/status/Status/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ 
        age: 26, 
        height: 176, 
        weight: 72, 
        gender: 'male', 
        fitness_level: 'intermediate' 
      });
  
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Status updated successfully', updatedLog: updatedStatus }); 
  });
});
