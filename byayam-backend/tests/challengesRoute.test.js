import request from 'supertest';
import app from '../index.js';
import { pool } from '../db/db.js'; // Import database connection
import {
    getChallenge,
    updateChallenges,
    deleteChallenges,
    addChallenges,
    getDayChallenge
} from '../controller/challengesController.js';
import jwt from 'jsonwebtoken';
// Mock the controller functions
jest.mock('../controller/challengesController.js', () => ({
    getChallenge: jest.fn((req, res) => res.status(200).json([{ id: 1, challenge_text: 'Mock Challenge' }])),
    addChallenges: jest.fn((req, res) => res.status(201).json({ message: 'Challenge added' })),
    updateChallenges: jest.fn((req, res) => res.status(200).json({ message: 'Challenge updated' })),
    deleteChallenges: jest.fn((req, res) => res.status(200).json({ message: 'Challenge deleted' })),
    getDayChallenge: jest.fn((req, res) => res.status(200).json({ message: 'Daily challenge' })),
}));
jest.mock('../middleware/verifyToken.js', () => (req, res, next) => {
    req.user = { id: 1 }; 
    next();
  });
const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

// Suppress console logs during tests
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

// Restore console logs after tests
afterAll(async () => {
    console.log.mockRestore();
    await pool.end(); // Close database connection
});

describe('Challenges Routes', () => {
    test('GET /api/protected/admin/challenges should return challenges', async () => {
        const response = await request(app)
            .get('/api/protected/admin/challenges')
            .set("Authorization", mockToken); // Include token

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, challenge_text: 'Mock Challenge' }]);
    });

    test('POST /api/protected/admin/challenges should add a challenge', async () => {
        const response = await request(app)
            .post('/api/protected/admin/challenges')
            .set("Authorization", mockToken) // Include token
            .send({ challenge_text: 'New Challenge' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Challenge added' });
    });

    test('PUT /api/protected/admin/challenges/:id should update a challenge', async () => {
        const response = await request(app)
            .put('/api/protected/admin/challenges/1')
            .set("Authorization", mockToken) // Include token
            .send({ challenge_text: 'Updated Challenge' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Challenge updated' });
    });

    test('DELETE /api/protected/admin/challenges/:id should delete a challenge', async () => {
        const response = await request(app)
            .delete('/api/protected/admin/challenges/1')
            .set("Authorization", mockToken); // Include token

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Challenge deleted' });
    });
});
