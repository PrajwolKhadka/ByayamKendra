import request from 'supertest';
import app from '../index.js'; 
import * as workoutModel from '../model/trackerModel.js';
import jwt from 'jsonwebtoken';

jest.mock('../model/trackerModel.js');

jest.mock('../middleware/verifyToken.js', () => (req, res, next) => {
  req.user = { id: 1 }; 
  next();
});

const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

describe('Workout Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('POST /api/protected/tracker/workouts should add a workout', async () => {
    const mockWorkout = { 
      id: 1, 
      workoutName: 'PushUps', 
      weight: '10', 
      reps: '10', 
      description: 'Bodyweight'
    };
    workoutModel.addWorkoutLog.mockResolvedValue(mockWorkout);
  
    const res = await request(app)
      .post('/api/protected/tracker/workouts')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ 
        workoutName: 'PushUps', 
        weight: '10', 
        reps: '20', 
        description: 'Bodyweight' 
      });
  
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Workout log saved successfully', newLog: mockWorkout });
  });

  test('POST /api/protected/tracker/workouts should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/protected/tracker/workouts')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ 
        workoutName: '', // Missing workout name
        weight:'10', 
        reps: '10', 
        description: 'Bodyweight' 
      });
  
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'All fields are required' });
  });

  test('GET /api/protected/tracker/workouts should return user workouts', async () => {
    const mockWorkouts = [{ id: 1, workout_name: 'Squats', weight: 80, reps: 10, description: 'Leg exercise' }];
    workoutModel.getWorkoutLogsByUserId.mockResolvedValue(mockWorkouts);

    const res = await request(app)
      .get('/api/protected/tracker/workouts')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body.workouts).toEqual(mockWorkouts);
  });

  test('GET /api/protected/tracker/workouts should return 404 if no workouts found', async () => {
    workoutModel.getWorkoutLogsByUserId.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/protected/tracker/workouts')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'No workout logs found' });
  });

  test('PUT /api/protected/tracker/workouts/:id should update a workout', async () => {
    const updatedWorkout = { 
      id: 1, 
      workoutName: 'Updated Workout', 
      weight: '10', 
      reps: '10', 
      description: 'Updated Desc' 
    };
    workoutModel.updateWorkoutLog.mockResolvedValue(updatedWorkout);
  
    const res = await request(app)
      .put('/api/protected/tracker/workouts/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ 
        workoutName: 'Updated Workout', 
        weight: '10', 
        reps: '10', 
        description: 'Updated Desc' 
      });
  
    expect(res.status ).toBe(200);
    expect(res.body).toEqual({ message: 'Workout log updated successfully', updatedLog: updatedWorkout });
  });

  test('PUT /api/protected/tracker/workouts/:id should return 400 for missing fields', async () => {
    const res = await request(app)
      .put('/api/protected/tracker/workouts/1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ 
        workoutName: '', // Missing workout name
        weight: '10', 
        reps: '10', 
        description: 'Updated Desc' 
      });
  
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'All fields are required' });
  });

  test('DELETE /api/protected/tracker/workouts/:id should delete a workout', async () => {
    workoutModel.getWorkoutById.mockResolvedValue({ id: 1 });
    workoutModel.deleteWorkoutLog.mockResolvedValue(1); // Simulate successful deletion

    const res = await request(app)
      .delete('/api/protected/tracker/workouts/1')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Workout deleted successfully' });
  });

  test('DELETE /api/protected/tracker/workouts/:id should return 404 if workout not found', async () => {
    workoutModel.getWorkoutById.mockResolvedValue(null); // Simulate workout not found

    const res = await request(app)
      .delete('/api/protected/tracker/workouts/1')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Workout log not found or unauthorized' });
  });

  test('DELETE /api/protected/tracker/workouts/:id should return 500 on server error', async () => {
    workoutModel.getWorkoutById.mockResolvedValue({ id: 1 });
    workoutModel.deleteWorkoutLog.mockResolvedValue(0); // Simulate failure to delete

    const res = await request(app)
      .delete('/api/protected/tracker/workouts/1')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to delete workout log' });
  });
});