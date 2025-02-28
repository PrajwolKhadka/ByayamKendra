import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/WorkoutView.css";
import axios from "axios";
import DOMPurify from "dompurify";

const Workout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const navigate = useNavigate();

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

  const toggleExpand = (id) => {
    setExpandedWorkouts((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Filter workouts based on search term
  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="workout-container-view">
      <h2>Workouts</h2>

      {/* Search Bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search workouts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredWorkouts.length > 0 ? (
        <ul className="workout-list-view">
          {filteredWorkouts.map((workout) => (
            <li key={workout.id} className="workout-item-view">
              <h3>{workout.name}</h3>
              <img
                src={`http://localhost:3000/${workout.image_url}`}
                alt={workout.name}
              />

              <div
                className={`description-container ${
                  expandedWorkouts[workout.id] ? "expanded" : "blurred"
                }`}
              >
              <div
                className="description-view"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(workout.description) }}
              />
              </div>

              <button
                className="view-more-btn"
                onClick={() => toggleExpand(workout.id)}
              >
                {expandedWorkouts[workout.id] ? "View Less" : "View More"}
              </button>

              <p>Age Range: {workout.min_age} - {workout.max_age}</p>
              <p>Weight Range: {workout.min_weight} - {workout.max_weight}</p>
              <p>Height Range: {workout.min_height} - {workout.max_height}</p>
              <p>Fitness Level: {workout.fitness_level}</p>

              <div className="workout-actions-view">
                <button onClick={() => navigate("/workoutadd", { state: { workout } })}>
                  Edit
                </button>
                <button onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this workout?")) {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.delete(
                        `http://localhost:3000/api/protected/admin/adminworkouts/${workout.id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      setWorkouts(workouts.filter((w) => w.id !== workout.id));
                    } catch (error) {
                      console.error("Error deleting workout:", error);
                    }
                  }
                }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No workouts found</p>
      )}
    </div>
  );
};

export default Workout;
