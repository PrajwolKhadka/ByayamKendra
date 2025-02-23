import { pool } from '../db/db.js';
import { 
  addWorkoutLog, 
  getWorkoutLogsByUserId, 
  updateWorkoutLog, 
  deleteWorkoutLog, 
  getWorkoutById 
} from '../model/trackerModel.js';

jest.mock('../db/db.js');

describe('Workout Model Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('addWorkoutLog should insert a workout and return it', async () => {
    const mockWorkout = { id: 1, user_id: 2, workout_name: 'Bench Press', weight: 50, reps: 10, description: 'Upper body' };
    pool.query.mockResolvedValueOnce({ rows: [mockWorkout] });

    const result = await addWorkoutLog(1, 'Bench Press', 50, 10, 'Upper body');

    expect(result).toEqual(mockWorkout);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 'Bench Press', 50, 10, 'Upper body']);
  });

  test('getWorkoutLogsByUserId should return workouts for a user', async () => {
    const mockWorkouts = [{ id: 1, workout_name: 'Bench Press' }];
    pool.query.mockResolvedValueOnce({ rows: mockWorkouts });

    const result = await getWorkoutLogsByUserId(2);

    expect(result).toEqual(mockWorkouts);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [2]);
  });

  test('updateWorkoutLog should update and return the workout', async () => {
    const updatedWorkout = { id: 1, user_id: 2, workout_name: 'Updated Workout', weight: 60, reps: 12, description: 'Updated Desc' };
    pool.query.mockResolvedValueOnce({ rows: [updatedWorkout] });

    const result = await updateWorkoutLog(1, 2, 'Updated Workout', 60, 12, 'Updated Desc');

    expect(result).toEqual(updatedWorkout);
  });

  test('deleteWorkoutLog should delete a workout and return true', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const result = await deleteWorkoutLog(1, 2);

    expect(result).toBe(true);
  });

  test('getWorkoutById should return a single workout', async () => {
    const mockWorkout = { id: 1, workout_name: 'Bench Press' };
    pool.query.mockResolvedValueOnce({ rows: [mockWorkout] });

    const result = await getWorkoutById(1, 2);

    expect(result).toEqual(mockWorkout);
  });
});
