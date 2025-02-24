import request from 'supertest';
import app from '../index.js'; // Adjust the path to your app
import { addAdminWorkout, updateAdminWorkout, deleteAdminWorkout, getAllAdminWorkouts, getWorkoutsByUserStatus } from '../model/adminModel.js';
import jwt from 'jsonwebtoken';

jest.mock('../model/adminModel.js'); // Mock the model functions

describe('Admin Workout Controller', () => {
  const mockWorkoutData = {
    name: 'Test Workout',
    description: 'A test workout description',
    minAge: 18,
    maxAge: 65,
    minWeight: 50,
    maxWeight: 100,
    minHeight: 150,
    maxHeight: 200,
    fitnessLevel: 'beginner',
    imageUrl: 'uploads/test-image.jpg',
  };

  const mockRequest = (overrides) => ({
    body: { ...mockWorkoutData, ...overrides },
    file: { path: 'uploads/test-image.jpg' },
    params: { id: '1' },
    query: {},
  });

  const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should add a new workout', async () => {
    addAdminWorkout.mockResolvedValue(mockWorkoutData); // Mock the model function

    const response = await request(app)
      .post('/api/protected/admin/adminworkouts')
      .set('Authorization', `Bearer ${mockToken}`) // Use the mocked token
      .send(mockWorkoutData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Workout added successfully');
    expect(response.body.newWorkout).toEqual(mockWorkoutData);
  });

  test('should update an existing workout', async () => {
    updateAdminWorkout.mockResolvedValue(mockWorkoutData); // Mock the model function

    const response = await request(app)
      .put('/api/protected/admin/adminworkouts/1')
      .set('Authorization', `Bearer ${mockToken}`) // Use the mocked token
      .send(mockWorkoutData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Workout updated successfully');
    expect(response.body.updatedWorkout).toEqual(mockWorkoutData);
  });

  test('should delete a workout', async () => {
    deleteAdminWorkout.mockResolvedValue(mockWorkoutData); // Mock the model function

    const response = await request(app)
      .delete('/api/protected/admin/adminworkouts/1')
      .set('Authorization', `Bearer ${mockToken}`) // Use the mocked token
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Workout deleted successfully');
    expect(response.body.deletedWorkout).toEqual(mockWorkoutData);
  });
  
  test('should get all workouts', async () => {
    const mockWorkouts = [
      { 
        ...mockWorkoutData, 
        imageUrl: 'http://localhost:3000/uploads/test-image.jpg' 
      },
      { 
        ...mockWorkoutData, 
        name: 'Another Workout', 
        imageUrl: 'http://localhost:3000/uploads/test-image.jpg' 
      }
    ];
    getAllAdminWorkouts.mockResolvedValue(mockWorkouts); // Mock the model function
  
    const response = await request(app)
      .get('/api/protected/admin/adminworkouts')
      .set('Authorization', `Bearer ${mockToken}`) // Use the mocked token
      .send();
  
    // Normalize the received URLs by removing any extra 'http://localhost:3000/' prefixes
    const normalizedResponse = response.body.map(workout => ({
      ...workout,
      imageUrl: workout.imageUrl.replace(/^http:\/\/localhost:3000\//, '')
    }));
  
    expect(response.status).toBe(200);
    expect(normalizedResponse).toEqual(mockWorkouts);
  });
  

  test('should fetch user-specific workouts', async () => {
    const mockUserWorkouts = [mockWorkoutData];
    const mockQuery = {
      age: 25,
      weight: 70,
      height: 175,
      fitness_level: 'beginner',
    };

    // Mock the function that fetches user-specific workouts
    getWorkoutsByUserStatus.mockResolvedValue(mockUserWorkouts);

    const response = await request(app)
      .get('/api/protected/admin/filter')
      .query(mockQuery)
      .set('Authorization', `Bearer ${mockToken}`) // Use the mocked token
      .send();

    expect(response.status).toBe(200);
    expect(response.body.workouts).toEqual(mockUserWorkouts);
  });
});