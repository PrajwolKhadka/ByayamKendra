import React, { useState, useEffect } from "react";
import "../css/Tracker.css";

const Tracker = () => {
  const [workoutName, setWorkoutName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [description, setDescription] = useState("");
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(""); // State to store error message

  // Load workouts when the component mounts
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const token = localStorage.getItem('token');
    console.log('Fetching workouts from:', 'http://localhost:3000/api/protected/tracker/workouts');
    const response = await fetch('http://localhost:3000/api/protected/tracker/workouts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    console.log('Fetched workout logs:', data);
    setWorkoutLogs(data.workouts || []);
  };

  const handleSave = async () => {
    // Validate fields
    if (!workoutName || !weight || !reps || !description) {
      setError("All fields are required!"); // Set error message
      return; // Exit the function if validation fails
    }

    setError(""); // Clear any previous error message

    const token = localStorage.getItem('token');
    const url = editing ? 'http://localhost:3000/api/protected/tracker/workouts/' + editing.id : 'http://localhost:3000/api/protected/tracker/workouts';
    const method = editing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workoutId: editing?.id, workoutName, weight, reps, description })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.newLog || data.updatedLog) {
          setWorkoutLogs((prev) =>
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
  const weightOptions = [];
  for (let i = 10; i <= 100; i += 10) {
    weightOptions.push(<option key={i} value={`${i}kg`}>{i}kg</option>);
  }

  // Generate reps options programmatically
  const repsOptions = [];
  for (let i = 5; i <= 30; i += 5) {
    repsOptions.push(<option key={i} value={i}>{i}</option>);
  }
  const handleEdit = (log) => {
    setWorkoutName(log.workout_name);
    setWeight(log.weight);
    setReps(log.reps);
    setDescription(log.description);
    setEditing(log);
  };

  const handleDelete = async (logId) => {
    console.log('Deleting workout with ID:', logId);
    const token = localStorage.getItem('token');
    const url = `http://localhost:3000/api/protected/tracker/workouts/${logId}`;
    console.log("Attempting to delete workout with ID:", logId);  // Ensure ID is correct

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    if (response.ok && data.message === 'Workout log deleted successfully') {
      // Directly remove the deleted log from the state
      setWorkoutLogs(workoutLogs.filter((log) => log.id !== logId));
    } else {
      console.error('Delete failed:', data);
    }
  };

  const resetForm = () => {
    setWorkoutName("");
    setWeight("");
    setReps("");
    setDescription("");
    setEditing(null);
  };

  return (
    <div className="tracker-container">
      <div className="tracker-section">
        <h1>Workout Log</h1>
        {/* Workout Name */}
        <input
          type="text"
          value ={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="Enter workout name"
          className="text-area"
        />

        {/* Weight dropdown */}
        <select value={weight} onChange={(e) => setWeight(e.target.value)} className="dropdown">
          <option value="">Select weight</option>
          <option value="daily challenge">Daily Challenge</option>
          {weightOptions}
        </select>

        {/* Reps dropdown */}
        <select value={reps} onChange={(e) => setReps(e.target.value)} className="dropdown">
          <option value="">Select reps</option>
          <option value="daily challenge">Daily Challenge</option>
          {repsOptions}
        </select>

        {/* Description input */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description..."
        /><br/>

        {/* Save button */}
        <button onClick={handleSave} className="button-track">
          {editing ? "Update Progress" : "Save Progress"}
        </button>

        {/* Error message display */}
        {error && <p className="error-message-tracker">{error}</p>}
      </div>

      <div className="tracker-section-table">
        <div className="log-display">
          <h3>Saved Workouts</h3>
          <table className="workout-table">
            <thead>
              <tr>
                <th>Workout Name</th>
                <th>Weight</th>
                <th>Reps</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workoutLogs.map((log) => (
                <tr key={log.id}> {/* Ensure this key is unique */}
                  <td>{log.workout_name}</td>
                  <td>{log.weight}</td>
                  <td>{log.reps}</td>
                  <td>{log.description}</td>
                  <td>
                    <button onClick={() => handleEdit(log)}>Edit</button>
                    <button onClick={() => handleDelete(log.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tracker;