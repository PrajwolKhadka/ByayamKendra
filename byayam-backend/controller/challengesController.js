import {getChallenges,addChallenge,updateChallenge,deleteChallenge} from "../model/challengesModel.js"

const MIN_CHALLENGE_LENGTH = 10;
const MAX_CHALLENGE_LENGTH = 500;

export const getChallenge = async (req, res) => {
    try {
        const challenges = await getChallenges();
        res.json(challenges);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
export const getDayChallenge = async (req, res) => {
    try {
        const challenges = await getChallenges(); // Fetch all challenges

        // Pick a random challenge for today
        const todayChallenge = challenges[Math.floor(Math.random() * challenges.length)];

        res.json(todayChallenge); // Return one challenge
    } catch (err) {
        res.status(500).send(err.message);
    }
};
// Add a new challenge
export const addChallenges = async (req, res) => {
    const { challenge_text } = req.body;
    try {
        if (!challenge_text?.trim()) {
            return res.status(400).json({ error: 'Challenge text is required' });
        }

        const trimmedText = challenge_text.trim();
        
        if (trimmedText.length < MIN_CHALLENGE_LENGTH) {
            return res.status(400).json({ 
                error: `Challenge text must be at least ${MIN_CHALLENGE_LENGTH} characters` 
            });
        }

        if (trimmedText.length > MAX_CHALLENGE_LENGTH) {
            return res.status(400).json({ 
                error: `Challenge text cannot exceed ${MAX_CHALLENGE_LENGTH} characters` 
            });
        }

        await addChallenge(trimmedText);
        res.status(201).json({ message: 'Challenge added successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an existing challenge
export const updateChallenges = async (req, res) => {
    const { id, challenge_text } = req.body;
    try {
        if (!challenge_text?.trim()) {
            return res.status(400).json({ error: 'Challenge text is required' });
        }

        const trimmedText = challenge_text.trim();
        
        if (trimmedText.length < MIN_CHALLENGE_LENGTH) {
            return res.status(400).json({ 
                error: `Challenge text must be at least ${MIN_CHALLENGE_LENGTH} characters` 
            });
        }

        if (trimmedText.length > MAX_CHALLENGE_LENGTH) {
            return res.status(400).json({ 
                error: `Challenge text cannot exceed ${MAX_CHALLENGE_LENGTH} characters` 
            });
        }

        // Check if challenge exists
        const existingChallenge = await getChallengeById(id);
        if (!existingChallenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        await updateChallenge(id, trimmedText);
        res.status(200).json({ message: 'Challenge updated successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a challenge
export const deleteChallenges = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteChallenge(id);
        res.status(200).send('Challenge deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
};