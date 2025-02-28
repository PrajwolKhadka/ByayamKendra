import React, { useState, useEffect } from 'react';
import '../css/Generator.css';

const WorkoutGenerator = () => {
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [fitness_level, setFitnessLevel] = useState("");
    const [statusLogs, setStatusLogs] = useState([]);
    const [workouts, setWorkouts] = useState([]);
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
        if (data.status?.length > 0) {
            const latestStatus = data.status[data.status.length - 1]; 
            setStatusLogs(data.status);
            
            setAge(latestStatus.age);
            setGender(latestStatus.gender);
            setHeight(latestStatus.height);
            setWeight(latestStatus.weight);
            setFitnessLevel(latestStatus.fitness_level);
    
            fetchWorkouts(latestStatus.age, latestStatus.height, latestStatus.weight, latestStatus.fitness_level);
        }
    };

    const fetchWorkouts = async (age, height, weight, fitness_level) => {
        if (!age || !height || !weight || !fitness_level) return;
    
        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost:3000/api/protected/admin/filter?age=${age}&weight=${weight}&height=${height}&fitness_level=${fitness_level}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        
        if (response.ok) {
            const data = await response.json();
            setWorkouts(data.workouts?.map(w => ({ ...w, expanded: false })) || []);
        }
    };

    const toggleWorkoutExpansion = (index) => {
        const updatedWorkouts = [...workouts];
        updatedWorkouts[index].expanded = !updatedWorkouts[index].expanded;
        setWorkouts(updatedWorkouts);
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
                    setStatusLogs(prev => editing
                        ? prev.map(log => log.id === data.updatedLog.id ? data.updatedLog : log)
                        : [...prev, data.newLog]
                    );
                    resetForm();
                }
                fetchWorkouts(age, height, weight, fitness_level);
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
        <div className="workout-generator-generate">
            <h1 className="title-generate">Workout Generator</h1>
            <div className="main-content-generate">
                <div className="form-container-generate">
                    {/* Show the form if no status logs are available or if editing */}
                    {statusLogs.length === 0 || editing ? (
                        <form onSubmit={handleSubmit}>
                            <input className="input-generate" value={age} onChange={(e) => setAge(e.target.value)} placeholder='Enter Your Age' required />
                            <select className="select-generate" value={gender} onChange={(e) => setGender(e.target.value)} required>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <input className="input-generate" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Enter Your Height in foot.inches" required />
                            <input className="input-generate" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter Weight" required />
                            <select className="select-generate" value={fitness_level} onChange={(e) => setFitnessLevel(e.target.value)} required>
                                <option value="">Select Your Fitness</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <button type="submit" className="button-generate">
                                {editing ? "Update Your Status" : "Save Your Status"}
                            </button>
                        </form>
                    ) : (
                        // Display the logs with an edit button if not in edit mode
                        <ul className="status-list-generate">
                            {
                                statusLogs.map((userstate, index) => (
                                    <li className="status-item-generate" key={index}>
                                        <p><strong>Age: </strong>{userstate.age}</p>
                                        <p><strong>Height: </strong>{userstate.height}</p>
                                        <p><strong>Weight: </strong>{userstate.weight}</p>
                                        <p><strong>Gender: </strong>{userstate.gender}</p>
                                        <p><strong>Fitness Level: </strong>{userstate.fitness_level}</p>
                                        <button className="button-generate" onClick={() => handleEdit(userstate)}>Edit</button>
                                    </li>
                                ))
                            }
                        </ul>
                    )}
                </div>

                <div className="workout-list-container-generate">
                    <h2 className="title-generate">Recommended Workouts</h2>
                    <ul className="workout-list-generate">
                        {workouts.length > 0 ? (
                            workouts.map((workout, index) => (
                                <li className="workout-item-generate" key={index}>
                                    <h3>{workout.name}</h3>
                                    <img src={`http://localhost:3000/${workout.image_url}`} alt={workout.name} className="workout-image-generate" />
                                    <div className={`workout-description-generate ${!workout.expanded ? 'workout-description-blur-generate' : 'workout-description-full-generate'}`}>
                                        <div dangerouslySetInnerHTML={{ __html: workout.description }} />
                                    </div>
                                    <button 
                                        className={`view-toggle-button-generate ${workout.expanded ? 'view-less-generate' : 'view-more-generate'}`}
                                        onClick={() => toggleWorkoutExpansion(index)}
                                    >
                                        {workout.expanded ? 'View Less' : 'View More'}
                                    </button>
                                    <p>Fitness Level: {workout.fitness_level}</p>
                                </li>
                            ))
                        ) : (
                            <p>No workouts found. Please update your details.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WorkoutGenerator;
