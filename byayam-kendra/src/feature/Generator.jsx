import React, { useState, useEffect } from 'react';

const WorkoutGenerator = () => {
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [fitness_level, setFitnessLevel] = useState("");
    const [statusLogs, setStatusLogs] = useState([]);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        fetchStatus();
    }, []);
    
    const fetchStatus = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/protected/status/Status', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        console.log('Fetched workout logs:', data);
        setStatusLogs(data.status || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = editing ? `http://localhost:3000/api/protected/status/Status/${editing.id}` : 'http://localhost:3000/api/protected/status/Status';
        const method = editing ? 'PUT' : 'POST';
    
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ StatusId: editing?.id, age, height, weight, gender, fitness_level })
            });
        
            if (response.ok) {
                const data = await response.json();
                if (data.newLog || data.updatedLog) {
                    setStatusLogs((prev) =>
                        editing
                            ? prev.map((log) => (log.id === data.updatedLog.id ? data.updatedLog : log))
                            : [...prev, data.newLog]
                    );
                    resetForm();
                }
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    const handleEdit = (log) => {
        setAge(log.age);
        setGender(log.gender);
        setHeight(log.height);
        setWeight(log.weight);
        setFitnessLevel(log.fitness_level);
        setEditing(log);
    };

    const resetForm = () => {
        setAge("");
        setGender("");
        setHeight("");
        setWeight("");
        setFitnessLevel("");
        setEditing(null);
    };

    return (
        <div>
            <h1>Workout Generator</h1>
           
                <input value={age} onChange={(e) => setAge(e.target.value)} placeholder='Enter Your Age' required />
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Enter Your Height in cm" required />
                <input 
                    type="number" 
                     value={weight} 
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter Weight"
                    required 
                />
                <select value={fitness_level} onChange={(e) => setFitnessLevel(e.target.value)} required>
                    <option value="">Select Your Fitness</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
                <button onClick={handleSubmit} type="submit" className="button-track">
                    {editing ? "Update Your Status" : "Save Your Status"}
                </button>
            <ul>
                {statusLogs.length > 0 ? (
                    statusLogs.map((userstate, index) => (
                        <li key={index}>
                            <h2>{userstate.age}</h2>
                            <p>{userstate.height}</p>
                            <p>{userstate.weight}</p>
                            <p>{userstate.gender}</p>
                            <p>{userstate.fitness_level}</p>
                            <button onClick={() => handleEdit(userstate)}>Edit</button>
                        </li>
                    ))
                ) : (
                    <p>No workout logs available. Please add a new status.</p>
                )}
            </ul>
        </div>
    );
};

export default WorkoutGenerator;