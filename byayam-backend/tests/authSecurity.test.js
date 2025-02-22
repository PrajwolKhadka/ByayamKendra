import request from 'supertest';
import app from '../index.js';  // Adjust to your server path
import { pool } from '../db/db.js';  // Adjust to your DB config if needed

describe('Security Tests for Authentication Routes', () => {

  // Test for SQL Injection prevention during user signup
  it('should prevent SQL Injection in signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: "testuser_OR1",
        email: 'test1@example.com',
        password: 'password123',
        gender: 'male',
      });
    
    expect(res.status).toBe(400);  // Ensure the request is rejected
    expect(res.body.error).toBe('Username or Email already exists');  // Or custom message
  });

  // Test for SQL Injection during user login
  it('should prevent SQL Injection in login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "test1@example.com",  // SQL Injection attempt
        password: 'password123 OR 1=1 --',
      });
    
    expect(res.status).toBe(400);  // Ensure the request is rejected
    expect(res.body.error).toBe('Invalid email or password');
  });

  // Test for XSS attack prevention in signup
  it('should prevent XSS attacks in signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: '<script>alert("XSS")</script>',
        email: 'test@example.com',
        password: 'password123',
        gender: 'male',
      });
      expect(res.status).toBe(201);
      expect(res.body.user.username).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
  });

  // Test for XSS attack prevention in update user
  it('should prevent XSS attacks in user update', async () => {
    const res = await request(app)
      .put('/api/auth/users/1')  // Adjust based on route
      .send({
        username: '<script>alert("XSS")</script>'
      });
    
    expect(res.status).toBe(400);  // Ensure the request is rejected
  });

  // Test for 404 error handling for unknown routes
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/auth/unknown-route');  // Unknown route
    expect(res.status).toBe(404);  // Ensure 404 status is returned
    expect(res.body.error).toBe('Route not found');  // Ensure the error message is correct
  });

  // Test for SQL Injection in password reset
  it('should prevent SQL Injection in password reset', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({
        email: "test@example.com' OR 1=1 --",  // SQL Injection attempt
        password: 'newpassword123',
      });
    
    expect(res.status).toBe(400);  // Ensure the request is rejected
    expect(res.body.error).toBe('Invalid email or password');
  });

});

afterAll(async () => {
    await pool.end();  // This closes the database connection after tests are finished
  });