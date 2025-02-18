import {getChallenges,addChallenge,updateChallenge,deleteChallenge} from "../model/challengesModel.js"
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
        if (!challenge_text) {
            return res.status(400).json({ error: 'Challenge text is required' });
        }
        await addChallenge(challenge_text);
        res.status(201).json({ message: 'Challenge added successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an existing challenge
export const updateChallenges = async (req, res) => {
    const { id, challenge_text } = req.body;
    if (!id || !challenge_text) {
        return res.status(400).json({ error: 'ID and challenge text are required' });
    }
    try {
        await updateChallenge(id, challenge_text);
        res.status(200).send('Challenge updated');
    } catch (err) {
        res.status(500).send(err.message);
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