import request from 'supertest';
import app from '../index.js';  
import { pool } from '../db/db.js';

jest.mock('../db/db.js');  
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'), 
  compare: jest.fn().mockResolvedValue(true),
}));

describe('Auth Controller Tests', () => {
  
  afterEach(() => {
    jest.clearAllMocks();  // Clear mock data after each test
  });

  it('should sign up a new user', async () => {
    // Mock database to simulate no existing user
    pool.query.mockResolvedValueOnce({ rows: [] });
    const mockUser = { id: 1, username: 'testUser', email: 'test@example.com' };
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });
    
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'testUser', email: 'test@example.com', password: 'password123', gender: 'M' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.token).toBeDefined(); 
  });

  it('should fail to sign up if email/username already exists', async () => {
    const mockUser = { id: 1, username: 'testUser', email: 'test@example.com' };

    pool.query.mockResolvedValueOnce({ rows: [mockUser] });

    const response = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'testUser', email: 'test@example.com', password: 'password123', gender: 'M' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username or Email already exists');
  });

  it('should login a user successfully', async () => {
    const mockUser = {
      id: 1,
      username: 'testUser',
      email: 'test@example.com',
      password: 'hashedPassword',
      gender: 'M',
      role: 'user'
    };

    pool.query.mockResolvedValueOnce({ rows: [mockUser] });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();  // Ensure token is returned
  });
});

afterAll(async () => {
  await pool.end();  // This closes the database connection after tests are finished
});