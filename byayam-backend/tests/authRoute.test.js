import request from 'supertest';
import app from '../index.js';  // Express app

describe('Auth Routes Tests', () => {
  
  it('should hit the /signup route and create a user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'newUser',
        email: 'newuser@example.com',
        password: 'password123',
        gender: 'M'
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should hit the /login route and login successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'newuser@example.com',
        password: 'password123'
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });
});
