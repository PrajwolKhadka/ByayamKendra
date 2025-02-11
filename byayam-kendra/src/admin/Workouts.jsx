import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/WorkoutView.css';
import axios from "axios";

const Workout = () => {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  // Fetch all workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/protected/admin/adminworkouts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, []);

  // Handle Edit: Redirect to WorkoutForm with existing data
  const handleEdit = (workout) => {
    navigate("/workoutadd", { state: { workout } });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:3000/api/protected/admin/adminworkouts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWorkouts(workouts.filter((workout) => workout.id !== id));
      } catch (error) {
        console.error("Error deleting workout:", error);
      }
    }
  };

  return (
    <div className="workout-container-view">
      <h2>Workouts</h2>
      {workouts.length > 0 ? (
        <ul className="workout-list-view">
          {workouts.map((workout) => (
            <li key={workout.id} className="workout-item-view">
              <h3>{workout.name}</h3>
              <div
                className="description-view"
                dangerouslySetInnerHTML={{ __html: workout.description }}
              />
              {workout.image_url && (
                <img
                  src={`http://localhost:3000/${workout.image_url}`}
                  alt={workout.name}
                />
              )}
              <p>Age Range: {workout.min_age} - {workout.max_age}</p>
              <p>Weight Range: {workout.min_weight} - {workout.max_weight}</p>
              <p>Height Range: {workout.min_height} - {workout.max_height}</p>
              <p>Fitness Level: {workout.fitness_level}</p>

              <div className="workout-actions-view">
                <button onClick={() => handleEdit(workout)}>Edit</button>
                <button onClick={() => handleDelete(workout.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No workouts available</p>
      )}
    </div>
  );
};

export default Workout;
