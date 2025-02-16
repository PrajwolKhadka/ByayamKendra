import { pool } from "../db/db.js";

export const getChallenges = async () => {
    try {
        const result = await pool.query('SELECT * FROM challenges');
        return result.rows;
    } catch (err) {
        throw new Error('Error fetching challenges');
    }
};

// Add a new challenge
export const addChallenge = async (challenge_text) => {
    try {
        await pool.query('INSERT INTO challenges (challenge_text) VALUES ($1)', [challenge_text]);
    } catch (err) {
        throw new Error('Error adding challenge');
    }
};

// Update an existing challenge
export const updateChallenge = async (id, challenge_text) => {
    try {
        await pool.query('UPDATE challenges SET challenge_text = $1 WHERE id = $2', [challenge_text, id]);
    } catch (err) {
        throw new Error('Error updating challenge');
    }
};

// Delete a challenge
export const deleteChallenge = async (id) => {
    try {
        await pool.query('DELETE FROM challenges WHERE id = $1', [id]);
    } catch (err) {
        throw new Error('Error deleting challenge');
    }
};