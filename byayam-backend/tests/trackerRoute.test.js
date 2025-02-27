import request from 'supertest';
import app from '../index.js';
import * as workoutModel from '../model/trackerModel.js';
import jwt from 'jsonwebtoken';
import { pool } from '../db/db.js';
jest.mock('../model/trackerModel.js');

jest.mock('../middleware/verifyToken.js', () => (req, res, next) => {
  req.user = { id: 1 }; 
  next();
});

const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

describe('Workout Routes Tests', () => {
    afterAll(async () => {
        await pool.end();
      });
  test('GET /api/protected/tracker/workouts should return user workouts', async () => {
    const mockWorkouts = [{ id: 1, workout_name: 'Squats', weight: '10', reps: '10', description: 'Leg exercise' }];
    workoutModel.getWorkoutLogsByUserId.mockResolvedValue(mockWorkouts);

    const res = await request(app)
      .get('/api/protected/tracker/workouts')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body.workouts).toEqual(mockWorkouts);
  });

  test('POST /api/protected/tracker/workouts should add a workout', async () => {
    const mockWorkout = { 
      id: 1, 
      workoutName: 'PushUps', // Change to workoutName
      weight: '10', 
      reps: '10', 
      description: 'Bodyweight'
    };
    workoutModel.addWorkoutLog.mockResolvedValue(mockWorkout);
  
    const res = await request(app)
      .post('/api/protected/tracker/workouts')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ 
        workoutName: 'PushUps', // Change to workoutName
        weight: '10', 
        reps: '10', 
        description: 'Bodyweight' 
      });
  
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Workout log saved successfully', newLog: mockWorkout });
  });

  test('PUT /api/protected/tracker/workouts/:id should update a workout', async () => {
    const updatedWorkout = { 
      id: 1, 
      workoutName: 'Updated Workout', // Change to workoutName
      weight: '10', 
      reps: '10', 
      description: 'Updated Desc' 
    };
    workoutModel.updateWorkoutLog.mockResolvedValue(updatedWorkout);
  
    const res = await request(app)
      .put('/api/protected/tracker/workouts/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ 
        workoutName: 'Updated Workout', // Change to workoutName
        weight: '10', 
        reps: '10', 
        description: 'Updated Desc' 
      });
  
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Workout log updated successfully', updatedLog: updatedWorkout });
  });

  test('DELETE /api/protected/tracker/workouts/:workoutId should delete a workout', async () => {
    const mockWorkout = { 
      id: 1, 
      workoutName: 'Push Ups', 
      weight: '10', 
      reps: '10', 
      description: 'Bodyweight'
    };

    // Mock the getWorkoutById to return the workout
    workoutModel.getWorkoutById.mockResolvedValue(mockWorkout);
    // Mock the deleteWorkoutLog to return 1 (indicating successful deletion)
    workoutModel.deleteWorkoutLog.mockResolvedValue(1); 

    const res = await request(app)
      .delete('/api/protected/tracker/workouts/1')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Workout deleted successfully' });
});
});