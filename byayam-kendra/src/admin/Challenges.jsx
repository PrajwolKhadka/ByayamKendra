import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Challenges.css';

function AdminPanel() {
    const [challenges, setChallenges] = useState([]);
    const [newChallenge, setNewChallenge] = useState('');
    const [editingChallenge, setEditingChallenge] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is an admin by verifying the token
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token
        } else {
            verifyAdmin(token);
        }
    }, [navigate]);

    // Check if the token is valid and if the user is an admin
    const verifyAdmin = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:3000/api/protected/admin/challenges', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // If authorized, proceed
            fetchChallenges();
        } catch (error) {
            // If the user is not an admin or token is invalid
            console.error('You are not authorized!');
            navigate('/login'); // Redirect to login page if unauthorized
        }
    };

    // Fetch all challenges from the backend
    const fetchChallenges = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:3000/api/protected/admin/challenges', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChallenges(response.data);
        } catch (error) {
            console.error('There was an error fetching challenges!', error);
        }
    };

    // Handle adding a new challenge
    const handleAddChallenge = async () => {
        if (newChallenge.trim()) {
            try {
                const token = localStorage.getItem("token");
                await axios.post(
                    'http://localhost:3000/api/protected/admin/challenges',
                    { challenge_text: newChallenge },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setNewChallenge('');
                setErrorMessage(''); // Clear error message
                fetchChallenges(); // Refresh the list of challenges
            } catch (error) {
                console.error('There was an error adding the challenge!', error);
            }
        } else {
            setErrorMessage('Please enter a challenge text!'); // Show error message
        }
    };

    // Handle updating an existing challenge
    const handleUpdateChallenge = async () => {
        if (editingChallenge) {
            try {
                const token = localStorage.getItem("token");
                await axios.put(
                    'http://localhost:3000/api/protected/admin/challenges',
                    {
                        id: editingChallenge.id,
                        challenge_text: editingChallenge.challenge_text
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setEditingChallenge(null);
                fetchChallenges(); // Refresh the list of challenges
            } catch (error) {
                console.error('There was an error updating the challenge!', error);
            }
        }
    };

    // Handle deleting a challenge
    const handleDeleteChallenge = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/api/protected/admin/challenges/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchChallenges(); // Refresh the list of challenges
        } catch (error) {
            console.error('There was an error deleting the challenge!', error);
        }
    };

    return (
        <div>
            <div className="admin-panel">
                <div className='Ch'>
                <h2>Manage Challenges</h2>
                </div>
                <input
                    type="text"
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    placeholder="New Challenge"
                />
                <button onClick={handleAddChallenge}>Add Challenge</button>

                {/* Display error message if there's one */}
                {errorMessage && <p className="error-message-panel">{errorMessage}</p>}

                {editingChallenge && (
                    <div>
                        <input
                            type="text"
                            value={editingChallenge.challenge_text}
                            onChange={(e) => setEditingChallenge({ ...editingChallenge, challenge_text: e.target.value })}
                        />
                        <button onClick={handleUpdateChallenge}>Update Challenge</button>
                    </div>
                )}

                <h3>Challenges List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Challenge Text</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {challenges.map((challenge) => (
                            <tr key={challenge.id}>
                                <td>{challenge.challenge_text}</td>
                                <td>
                                    <button onClick={() => setEditingChallenge(challenge)}>Edit</button>
                                    <button onClick={() => handleDeleteChallenge(challenge.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPanel;
