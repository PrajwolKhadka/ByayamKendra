import request from 'supertest';
import app from '../index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {pool} from '../db/db.js'
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

describe('Workout Controller Tests', () => {
  let token;

  beforeAll(async () => {
    const userId = 1;
    token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should add a new workout log', async () => {
    const age = 25;
    const height = 175;
    const weight = 70;
    const gender = 'male';
    const fitness_level = 'beginner';

    const response = await request(app)
      .post('/api/protected/status/Status')
      .set('Authorization', `Bearer ${token}`)
      .send({ age, height, weight, gender, fitness_level });
      console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Workout log saved successfully');
    expect(response.body).toHaveProperty('newLog');
  });

  test('should get workout logs', async () => {
    const response = await request(app)
      .get('/api/protected/status/Status')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
  });

  test('should update a workout log', async () => {
    const statusId = 21;
    const age = 26;
    const height = 176;
    const weight = 71;
    const gender = 'male';
    const fitness_level = 'intermediate';

    const response = await request(app)
      .put(`/api/protected/status/Status/${statusId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ age, height, weight, gender, fitness_level });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Status updated successfully');
    expect(response.body).toHaveProperty('updatedLog');
  });
});