import request from 'supertest';
import app from '../index.js'; 
import { pool } from '../db/db.js';  

describe('Security Tests for Authentication Routes', () => {

  // Test for SQL Injection prevention during user signup
  it('should prevent SQL Injection in signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: "testuser' OR 1=1 --",
        email: 'test1@example.com',
        password: 'password123',
        gender: 'male',
      });
    
    expect(res.status).toBe(400);  
    expect(res.body.error).toMatch(/Invalid username format/);  
  });

  // Test for SQL Injection during user login
  it('should prevent SQL Injection in login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "test1@example.com",  // SQL Injection attempt
        password: 'password123 OR 1=1 --',
      });
    
    expect(res.status).toBe(400); 
    expect(res.body.error).toBe('Invalid email or password');
  });

  // Test for XSS attack prevention in signup
  it('should prevent XSS attacks in signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: '<script>alert("XSS")</script>',
        email: 'test_xss@example.com',
        password: 'password123',
        gender: 'male',
      });
      expect(res.status).toBe(400);
  });

  // Test for XSS attack prevention in update user
  it('should prevent XSS attacks in user update', async () => {
    const res = await request(app)
      .put('/api/auth/users/1') 
      .send({
        username: '<script>alert("XSS")</script>'
      });
    
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
  });

  // Test for 404 error handling for unknown routes
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/auth/unknown-route');  // Unknown route
    expect(res.status).toBe(404);  //  404 status is returned
    expect(res.body.error).toBe('Route not found');  
  });

  // Test for SQL Injection in password reset
  it('should prevent SQL Injection in password reset', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({
        email: "tracker@example.com' OR 1=1 --",  // SQL Injection attempt
        password: 'newpassword123',
      });
    
    expect(res.status).toBe(404);  
    expect(res.body.error).toBe('Email not found');
  });

});

afterAll(async () => {
    await pool.end(); 
  });