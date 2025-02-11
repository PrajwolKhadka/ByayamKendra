import React, { useState, useRef, useEffect, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import "../css/WorkoutForm.css";

const ReactQuill = React.lazy(() => import("react-quill"));

const WorkoutForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Prefill if editing
  const [workout, setWorkout] = useState(
    location.state?.workout || {
      name: "",
      description: "",
      minAge: "",
      maxAge: "",
      minWeight: "",
      maxWeight: "",
      minHeight: "",
      maxHeight: "",
      fitnessLevel: "",
      imageFile: null,
      imagePreview: "",
    }
  );

  useEffect(() => {
    if (location.state?.workout?.image_url) {
      setWorkout((prev) => ({
        ...prev,
        imagePreview: `http://localhost:3000/${location.state.workout.image_url}`,
      }));
    }
  }, [location.state]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle Rich Text Editor Change
  const handleQuillChange = (value) => {
    setWorkout((prevState) => ({
      ...prevState,
      description: value,
    }));
  };

  // Handle Image Change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setWorkout((prevState) => ({
        ...prevState,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Handle Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", workout.name);
    formData.append("description", workout.description);
    formData.append("minAge", workout.minAge);
    formData.append("maxAge", workout.maxAge);
    formData.append("minWeight", workout.minWeight);
    formData.append("maxWeight", workout.maxWeight);
    formData.append("minHeight", workout.minHeight);
    formData.append("maxHeight", workout.maxHeight);
    formData.append("fitnessLevel", workout.fitnessLevel);

    if (workout.imageFile) {
      formData.append("imageFile", workout.imageFile);
    }

    try {
      const token = localStorage.getItem("token");
      let response;

      if (location.state?.workout) {
        // Update Workout
        response = await fetch(
          `http://localhost:3000/api/protected/admin/adminworkouts/${location.state.workout.id}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      } else {
        // Add New Workout
        response = await fetch(
          "http://localhost:3000/api/protected/admin/adminworkouts",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      }

      if (!response.ok) throw new Error("Failed to save workout");
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  return (
    <div className="card-workoutadmin">
      <div className="card-header-workoutadmin">
        <h2 className="card-title-workoutadmin">
          {location.state?.workout ? "Edit Workout" : "Add New Workout"}
        </h2>
      </div>
      <div className="card-content-workoutadmin">
      <form onSubmit={handleSubmit} className="workout-form-workoutadmin">
  {/* Name and Description Fields */}
  <div className="form-group-workoutadmin">
    <label htmlFor="name">Workout Name</label>
    <input
      type="text"
      id="name"
      name="name"
      value={workout.name}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-group-workoutadmin">
    <label htmlFor="description">Description</label>
    <Suspense fallback={<div>Loading editor...</div>}>
      <ReactQuill theme="snow" value={workout.description} onChange={handleQuillChange} />
    </Suspense>
  </div>

  <div className="form-group-workoutadmin">
  <label htmlFor="minAge">Min Age</label>
  <input
    type="number"
    id="minAge"
    name="minAge"
    value={workout.minAge}
    onChange={handleChange}
    required
  />
</div>

<div className="form-group-workoutadmin">
  <label htmlFor="maxAge">Max Age</label>
  <input
    type="number"
    id="maxAge"
    name="maxAge"
    value={workout.maxAge}
    onChange={handleChange}
    required
  />
</div>

<div className="form-group-workoutadmin">
  <label htmlFor="minWeight">Min Weight</label>
  <input
    type="number"
    id="minWeight"
    name="minWeight"
    value={workout.minWeight}
    onChange={handleChange}
    required
  />
</div>

<div className="form-group-workoutadmin">
  <label htmlFor="maxWeight">Max Weight</label>
  <input
    type="number"
    id="maxWeight"
    name="maxWeight"
    value={workout.maxWeight}
    onChange={handleChange}
    required
  />
</div>

<div className="form-group-workoutadmin">
  <label htmlFor="minHeight">Min Height</label>
  <input
    type="number"
    id="minHeight"
    name="minHeight"
    value={workout.minHeight}
    onChange={handleChange}
    required
  />
</div>

<div className="form-group-workoutadmin">
  <label htmlFor="maxHeight">Max Height</label>
  <input
    type="number"
    id="maxHeight"
    name="maxHeight"
    value={workout.maxHeight}
    onChange={handleChange}
    required
  />
</div>

<div className="form-group-workoutadmin">
  <label htmlFor="fitnessLevel">Fitness Level</label>
  <select
    id="fitnessLevel"
    name="fitnessLevel"
    value={workout.fitnessLevel}
    onChange={handleChange}
    required
  >
    <option value="">Select Fitness Level</option>
    <option value="Beginner">Beginner</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Advanced">Advanced</option>
  </select>
</div>

  <div className="form-group-workoutadmin">
    <label htmlFor="imageFile">Upload Image</label>
    <input type="file" id="imageFile" onChange={handleFileChange} />
    {workout.imagePreview && <img src={workout.imagePreview} alt="Preview" width="100" />}
  </div>

  <button type="submit" className="submit-button-workoutadmin">
    {location.state?.workout ? "Update Workout" : "Add Workout"}
  </button>
</form>

      </div>
    </div>
  );
};

export default WorkoutForm;
