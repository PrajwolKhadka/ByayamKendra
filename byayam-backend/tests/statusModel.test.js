import { addStatusLog, getStateByUserId, deleteStatusLog, updateStatusLog, getStatusById } from '../model/workoutModel.js';
import { pool } from '../db/db.js';

// Mock the database functions
jest.mock('../model/workoutModel.js', () => ({
  addStatusLog: jest.fn(),
  getStateByUserId: jest.fn(),
  deleteStatusLog: jest.fn(),
  updateStatusLog: jest.fn(),
  getStatusById: jest.fn(),
}));

describe('Workout Model Tests', () => {
  test('should add a new workout log', async () => {
    const userId = 'testUser';
    const age = 25;
    const height = 175;
    const weight = 70;
    const gender = 'male';
    const fitnessLevel = 'beginner';

    const mockResponse = {
      id: 1,
      user_id: userId,
      age,
      height,
      weight,
      gender,
      fitness_level: fitnessLevel,
    };

    addStatusLog.mockResolvedValue(mockResponse);

    const result = await addStatusLog(userId, age, height, weight, gender, fitnessLevel);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('user_id', userId);
    expect(result).toHaveProperty('age', age);
    expect(result).toHaveProperty('height', height);
    expect(result).toHaveProperty('weight', weight);
    expect(result).toHaveProperty('gender', gender);
    expect(result).toHaveProperty('fitness_level', fitnessLevel);
  });

  test('should get workout logs by user ID', async () => {
    const userId = 'testUser';
    const mockResponse = [
      { id: 1, user_id: userId, age: 25, height: 175, weight: 70, gender: 'male', fitness_level: 'beginner' },
    ];

    getStateByUserId.mockResolvedValue(mockResponse);

    const result = await getStateByUserId(userId);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty('user_id', userId);
  });

  test('should return an empty array if no logs are found', async () => {
    const userId = 'testUser';
    getStateByUserId.mockResolvedValue([]);

    const result = await getStateByUserId(userId);
    expect(result).toEqual([]);
  });

  test('should delete a workout log', async () => {
    const userId = 'testUser';
    const statusId = 1;

    deleteStatusLog.mockResolvedValue(true);

    const result = await deleteStatusLog(statusId, userId);
    expect(result).toBe(true);
  });

  test('should return false if deletion fails', async () => {
    const userId = 'testUser';
    const statusId = 1;

    deleteStatusLog.mockResolvedValue(false);

    const result = await deleteStatusLog(statusId, userId);
    expect(result).toBe(false);
  });

  test('should update a workout log', async () => {
    const userId = 'testUser';
    const statusId = 1;
    const age = 26;
    const height = 176;
    const weight = 71;
    const gender = 'male';
    const fitnessLevel = 'intermediate';

    const mockResponse = {
      id: statusId,
      user_id: userId,
      age,
      height,
      weight,
      gender,
      fitness_level: fitnessLevel,
    };

    updateStatusLog.mockResolvedValue(mockResponse);

    const result = await updateStatusLog(statusId, userId, age, height, weight, gender, fitnessLevel);
    expect(result).toHaveProperty('id', statusId);
    expect(result).toHaveProperty('user_id', userId);
    expect(result).toHaveProperty('age', age);
    expect(result).toHaveProperty('height', height);
    expect(result).toHaveProperty('weight', weight);
    expect(result).toHaveProperty('gender', gender);
    expect(result).toHaveProperty('fitness_level', fitnessLevel);
  });

  test('should return null if update fails', async () => {
    const userId = 'testUser';
    const statusId = 1;
    const age = 26;
    const height = 176;
    const weight = 71;
    const gender = 'male';
    const fitnessLevel = 'intermediate';

    updateStatusLog.mockResolvedValue(null);

    const result = await updateStatusLog(statusId, userId, age, height, weight, gender, fitnessLevel);
    expect(result).toBeNull();
  });

  test('should get a workout log by ID', async () => {
    const statusId = 1;
    const userId = 'testUser';

    const mockResponse = {
      id: statusId,
      user_id: userId,
      age: 25,
      height: 175,
      weight: 70,
      gender: 'male',
      fitness_level: 'beginner',
    };

    getStatusById.mockResolvedValue(mockResponse);

    const result = await getStatusById(statusId, userId);
    expect(result).toHaveProperty('id', statusId);
    expect(result).toHaveProperty('user_id', userId);
  });

  test('should return null if log not found by ID', async () => {
    const statusId = 999; // Non-existent log
    const userId = 'testUser';

    getStatusById.mockResolvedValue(null);

    const result = await getStatusById(statusId, userId);
    expect(result).toBeNull();
  });
});
