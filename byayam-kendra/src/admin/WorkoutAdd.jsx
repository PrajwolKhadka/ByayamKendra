import React, { useState, useRef, useEffect, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import "../css/WorkoutForm.css";

const ReactQuill = React.lazy(() => import("react-quill"));

const WorkoutForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Initial workout state
  const initialWorkoutState = {
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
    // imagePreview: "",
  };

  const [workout, setWorkout] = useState(initialWorkoutState);

  useEffect(() => {
    if (location.state?.workout) {
      const existingWorkout = location.state.workout;
      setWorkout((prev) => ({
        ...prev,
        name: existingWorkout.name,
        description: existingWorkout.description,
        minAge: existingWorkout.min_age,
        maxAge: existingWorkout.max_age,
        minWeight: existingWorkout.min_weight,
        maxWeight: existingWorkout.max_weight,
        minHeight: existingWorkout.min_height,
        maxHeight: existingWorkout.max_height,
        fitnessLevel: existingWorkout.fitness_level,
        // imagePreview: existingWorkout.image_url ? `http://localhost:3000/${existingWorkout.image_url}` : "",
        imageFile: null,
      }));
    }
  }, [location.state]);

  // Handle input changes
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setWorkout((prevState) => ({
        ...prevState,
        imageFile: file,
        imagePreview: URL.createObjectURL(file), // Show preview for new image
      }));
    }
  };
  

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
  
    // If a new image is uploaded, append it; otherwise, retain the existing one
    if (workout.imageFile) {
      formData.append("imageFile", workout.imageFile);
    } 
    try {
      const token = localStorage.getItem("token");
      let response;
  
      if (location.state?.workout) {
        response = await fetch(
          `http://localhost:3000/api/protected/admin/adminworkouts/${location.state.workout.id}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      } else {
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
  
      // Reset form on success
      setWorkout({
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
      });
  
      navigate("/workoutview");
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };
  const view=()=>{
    navigate("/workoutview");
  }
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div className="container-workout-admin">
    <div className="card-workoutadmin">
      <div className="card-header-workoutadmin">
        <h2 className="card-title-workoutadmin">
          {location.state?.workout ? "Edit Workout" : "Add New Workout"}
        </h2>
      </div>
      <div className="card-content-workoutadmin">
        <form onSubmit={handleSubmit} className="workout-form-workoutadmin">
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
            <label htmlFor="imageFile">Upload Image</label>
            <button type="button" onClick={handleUploadClick} className="upload-button-admin">Upload Image</button>
              <input type="file" id="imageFile" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              {workout.imagePreview && <img src={workout.imagePreview} alt="Preview"  className="pre-admin"/>}
            </div>
          <div className="form-group-workoutadmin">
            <label htmlFor="description">Description</label>
            <Suspense fallback={<div>Loading editor...</div>}>
              <ReactQuill className='quill' theme="snow" value={workout.description} onChange={handleQuillChange} />
            </Suspense>
          </div>

          {["minAge", "maxAge", "minWeight", "maxWeight", "minHeight", "maxHeight"].map((field) => (
            <div className="form-group-workoutadmin" key={field}>
              <label htmlFor={field}>{field.replace(/([A-Z])/g, " $1")}</label>
              <input
                type="number"
                id={field}
                name={field}
                value={workout[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

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
          <button type="submit" className="submit-button-workoutadmin">
            {location.state?.workout ? "Update Workout" : "Add Workout"}
          </button><br/><br/>
          <button onClick={view} className="submit-button-workoutadmin">
            View Workout
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default WorkoutForm;
