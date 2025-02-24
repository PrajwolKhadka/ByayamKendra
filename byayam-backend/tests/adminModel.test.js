import { pool } from '../db/db.js'; // Mock the DB
import { addAdminWorkout, getAllAdminWorkouts, getAdminWorkoutById, updateAdminWorkout, deleteAdminWorkout } from '../model/adminModel.js';

// Mock the pool.query function
jest.mock('../db/db.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Admin Workout Model Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should add a new admin workout', async () => {
    const mockWorkout = {
      name: 'Test Workout',
      description: 'A sample workout',
      minAge: 18,
      maxAge: 40,
      minWeight: 50,
      maxWeight: 100,
      minHeight: 150,
      maxHeight: 190,
      fitnessLevel: 'Beginner',
      imageUrl: '/uploads/test.jpg',
    };

    const mockResult = { rows: [mockWorkout] };
    pool.query.mockResolvedValue(mockResult);

    const result = await addAdminWorkout(mockWorkout);
    expect(result).toEqual(mockWorkout);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test('should fetch all admin workouts', async () => {
    const mockResult = { rows: [{ id: 1, name: 'Workout 1' }, { id: 2, name: 'Workout 2' }] };
    pool.query.mockResolvedValue(mockResult);

    const result = await getAllAdminWorkouts();
    expect(result).toEqual(mockResult.rows);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test('should fetch a single workout by ID', async () => {
    const mockResult = { rows: [{ id: 1, name: 'Workout 1' }] };
    pool.query.mockResolvedValue(mockResult);

    const result = await getAdminWorkoutById(1);
    expect(result).toEqual(mockResult.rows[0]);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
  });

  test('should update a workout', async () => {
    const updatedWorkout = { name: 'Updated Workout', description: 'Updated description', minAge: 20, maxAge: 50, minWeight: 55, maxWeight: 110, minHeight: 160, maxHeight: 200, fitnessLevel: 'Advanced', imageUrl: '/uploads/updated.jpg' };
    const mockResult = { rows: [updatedWorkout] };
    pool.query.mockResolvedValue(mockResult);

    const result = await updateAdminWorkout(1, updatedWorkout);
    expect(result).toEqual(updatedWorkout);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
  });

  test('should delete a workout', async () => {
    const mockResult = { rows: [{ id: 1, name: 'Workout to delete' }] };
    pool.query.mockResolvedValue(mockResult);

    const result = await deleteAdminWorkout(1);
    expect(result).toEqual(mockResult.rows[0]);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
  });
});
