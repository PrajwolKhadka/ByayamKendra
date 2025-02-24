import request from 'supertest';
import app from '../index.js';
import { addAdminWorkout, getAllAdminWorkouts, getAdminWorkoutById, updateAdminWorkout, deleteAdminWorkout } from '../model/adminModel.js';
import jwt from 'jsonwebtoken';
import {pool} from '../db/db.js';
// Mock the model functions
jest.mock('../model/adminModel.js');
jest.mock('../middleware/verifyToken.js', () => (req, res, next) => {
    req.user = { id: 1 }; 
    next();
  });
  
  const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
describe('Admin Workout API Tests', () => {
    afterAll(async () => {
        await pool.end(); // If using a database connection
      });
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  test('POST /api/protected/admin/adminworkouts - should add a workout', async () => {
    const mockWorkout = { id: 1, name: 'Test Workout', description: 'A test workout', imageUrl: null };
    addAdminWorkout.mockResolvedValue(mockWorkout);

    const response = await request(app)
      .post('/api/protected/admin/adminworkouts')
      .send(mockWorkout)
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
        message: "Workout added successfully",
        newWorkout: mockWorkout
      });
      
    expect(addAdminWorkout).toHaveBeenCalledWith(mockWorkout);
  });

  test('GET /api/protected/admin/adminworkouts - should fetch all workouts', async () => {
    const mockWorkouts = [
        { id: 1, name: 'Workout 1', imageUrl: null },
        { id: 2, name: 'Workout 2', imageUrl: null }
      ];
      
    getAllAdminWorkouts.mockResolvedValue(mockWorkouts);

    const response = await request(app)
      .get('/api/protected/admin/adminworkouts')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockWorkouts);
    expect(getAllAdminWorkouts).toHaveBeenCalledTimes(1);
  });

  test('PUT /api/protected/admin/adminworkouts/:id - should update a workout', async () => {
    const updatedWorkout = { id: 1, name: 'Updated Workout' };
    updateAdminWorkout.mockResolvedValue(updatedWorkout);

    const response = await request(app)
      .put('/api/protected/admin/adminworkouts/1')
      .send(updatedWorkout)
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        message: 'Workout updated successfully',
        updatedWorkout,
      });
    expect(updateAdminWorkout).toHaveBeenCalledWith('1', updatedWorkout);
  });

  test('DELETE /api/protected/admin/adminworkouts/:id - should delete a workout', async () => {
    const mockWorkout = { id: 1, name: 'Workout to delete' };
    deleteAdminWorkout.mockResolvedValue(mockWorkout);

    const response = await request(app)
      .delete('/api/protected/admin/adminworkouts/1')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        message: 'Workout deleted successfully',
        deletedWorkout: mockWorkout,
      });
    expect(deleteAdminWorkout).toHaveBeenCalledWith('1');
  });
});
