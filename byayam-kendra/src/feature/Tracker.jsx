import React, { useState } from "react";
import "../css/Tracker.css";

const Tracker = () => {
  const [workoutName, setWorkoutName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [description, setDescription] = useState("");
  const [workoutLogs, setWorkoutLogs] = useState([]);

  // Handle workout name input
  const handleWorkoutNameChange = (e) => {
    setWorkoutName(e.target.value);
  };

  // Handle weight dropdown selection
  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  // Handle reps dropdown selection
  const handleRepsChange = (e) => {
    setReps(e.target.value);
  };

  // Handle description input
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Add the workout log entry
  const handleSave = () => {
    if (workoutName && weight && reps) {
      const newLog = {
        workoutName,
        weight,
        reps,
        description,
      };
      setWorkoutLogs([...workoutLogs, newLog]);
      setWorkoutName("");
      setWeight("");
      setReps("");
      setDescription("");
    } else {
      alert("Please fill in all fields!");
    }
  };

  // Clear the tracker fields
  const handleClear = () => {
    setWorkoutName("");
    setWeight("");
    setReps("");
    setDescription("");
  };

  return (
    <div className="tracker-container">
      <h1>Workout Log</h1>

      {/* Workout Name */}
      <input
        type="text"
        value={workoutName}
        onChange={handleWorkoutNameChange}
        placeholder="Enter workout name"
        className="text-area"
      />

      {/* Weight dropdown */}
      <select
        value={weight}
        onChange={handleWeightChange}
        className="dropdown"
      >
        <option value="">Select weight</option>
        <option value="10kg">10kg</option>
        <option value="20kg">20kg</option>
        <option value="30kg">30kg</option>
        <option value="40kg">40kg</option>
        <option value="50kg">50kg</option>
      </select>

      {/* Reps dropdown */}
      <select
        value={reps}
        onChange={handleRepsChange}
        className="dropdown"
      >
        <option value="">Select reps</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>

      {/* Description input */}
      <textarea
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Add a description..."
        className="text-area"
      />

      {/* Actions */}
      <div className="button-group-track">
        <button onClick={handleSave} className="button-track">Save Progress</button>
        <button onClick={handleClear} className="button-track">Clear</button>
      </div>

      {/* Display saved workout logs in table format */}
      <div className="log-display">
        <h3>Saved Workouts</h3>
        {workoutLogs.length === 0 ? (
          <p>No logs yet.</p>
        ) : (
          <table className="workout-table">
            <thead>
              <tr>
                <th>Workout Name</th>
                <th>Weight</th>
                <th>Reps</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {workoutLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.workoutName}</td>
                  <td>{log.weight}</td>
                  <td>{log.reps}</td>
                  <td>{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Tracker;
