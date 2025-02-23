import { pool } from '../db/db.js';
import { getChallenges, addChallenge, updateChallenge, deleteChallenge } from '../model/challengesModel.js';

jest.mock('../db/db.js', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Challenges Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch all challenges', async () => {
        const mockChallenges = [{ id: 1, challenge_text: 'Do 50 push-ups' }];
        pool.query.mockResolvedValue({ rows: mockChallenges });

        const result = await getChallenges();
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM challenges');
        expect(result).toEqual(mockChallenges);
    });

    test('should add a new challenge', async () => {
        pool.query.mockResolvedValue({});
        await addChallenge('Run 5km');
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO challenges (challenge_text) VALUES ($1)',
            ['Run 5km']
        );
    });

    test('should update a challenge', async () => {
        pool.query.mockResolvedValue({});
        await updateChallenge(1, 'Updated Challenge');
        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE challenges SET challenge_text = $1 WHERE id = $2',
            ['Updated Challenge', 1]
        );
    });

    test('should delete a challenge', async () => {
        pool.query.mockResolvedValue({});
        await deleteChallenge(1);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM challenges WHERE id = $1', [1]);
    });
});
