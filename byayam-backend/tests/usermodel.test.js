import { createUser, findUserByEmailOrUsername, findUserByEmail } from '../model/userModel.js';
import { pool } from '../db/db.js';

jest.mock('../db/db.js');  // Mock the database query function for unit testing

describe('User Model Tests', () => {
  
  afterEach(() => {
    jest.clearAllMocks();  // Clear mock data after each test
  });

  it('should create a user', async () => {
    const mockUser = {
      id: 1,
      username: 'testUser',
      email: 'test@example.com',
      password: 'hashedPassword',
      gender: 'M',
      role: 'user'
    };
    
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });  // Mock query response
    
    const result = await createUser('testUser', 'test@example.com', 'hashedPassword', 'M', 'user');
    
    expect(result).toEqual(mockUser);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'), // Check if correct SQL is used
      expect.arrayContaining(['testUser', 'test@example.com', 'hashedPassword', 'M', 'user']) // Check values
    );
  });

  it('should find a user by email or username', async () => {
    const mockUser = {
      id: 1,
      username: 'testUser',
      email: 'test@example.com',
      password: 'hashedPassword',
      gender: 'M',
      role: 'user'
    };
    
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });  // Mock query response
    
    const result = await findUserByEmailOrUsername('test@example.com', 'testUser');
    
    expect(result).toEqual([mockUser]);
  });

  it('should return null if no user found by email', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });  // No user found
    
    const result = await findUserByEmail('nonexistent@example.com');
    
    expect(result).toBeUndefined();
  });
});

afterAll(async () => {
    await pool.end();  // This closes the database connection after tests are finished
  });