import request from 'supertest';
import app from '../index.js'; // Adjust the path as necessary
import jwt from 'jsonwebtoken';
import { pool } from '../db/db.js'; // Adjust the path as necessary
import { addChallenge, getChallenges } from '../model/challengesModel.js';

jest.mock('../model/challengesModel.js');

const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

describe('Challenges API Security Tests', () => {
    afterAll(async () => {
        await pool.end();
    });

    it('should prevent SQL injection in challenge text', async () => {
        const sqlInjectionPayload = {
            challenge_text: "1; DROP TABLE challenges;"
        };

        addChallenge.mockImplementation(() => {
            throw new Error('SQL Injection Attempt');
        });

        const response = await request(app)
            .post('/api/protected/admin/challenges')
            .set('Authorization', `Bearer ${mockToken}`)
            .send(sqlInjectionPayload);

        expect(response.status).toBe(500); // Expect a server error due to SQL injection
        expect(response.body.error).toContain('SQL Injection Attempt');
    });

    it('should prevent XSS attacks by sanitizing inputs', async () => {
        const xssPayload = {
            challenge_text: "<script>alert('Hacked!')</script>"
        };

        addChallenge.mockResolvedValue({ id: 1, challenge_text: xssPayload.challenge_text });

        const response = await request(app)
            .post('/api/protected/admin/challenges')
            .set('Authorization', `Bearer ${mockToken}`)
            .send(xssPayload);

        expect(response.status).toBe(201); // Should succeed
        expect(addChallenge).toHaveBeenCalledWith(expect.not.stringContaining('<script>')); // Ensure XSS is sanitized
    });

    it('should return 404 for an unknown route', async () => {
        const response = await request(app)
            .get('/api/protected/admin/challenges/unknown-route')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Route not found');
    });
});