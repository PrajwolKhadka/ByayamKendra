import React, { useState, useRef, Suspense } from "react";
import "react-quill/dist/quill.snow.css";
import "../css/WorkoutForm.css";

const ReactQuill = React.lazy(() => import("react-quill"));

const WorkoutForm=()=> {
  const [workout, setWorkout] = useState({
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

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuillChange = (value) => {
    setWorkout((prevState) => ({
      ...prevState,
      description: value,
    }));
  };

  const handleSelectChange = (e) => {
    setWorkout((prevState) => ({
      ...prevState,
      fitnessLevel: e.target.value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', workout.name);
    formData.append('description', workout.description);
    formData.append('minAge', workout.minAge);
    formData.append('maxAge', workout.maxAge);
    formData.append('minWeight', workout.minWeight);
    formData.append('maxWeight', workout.maxWeight);
    formData.append('minHeight', workout.minHeight);
    formData.append('maxHeight', workout.maxHeight);
    formData.append('fitnessLevel', workout.fitnessLevel);
    formData.append('imageFile', workout.imageFile); // Append the image file
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/protected/admin/adminworkouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to add workout');
      }
  
      const data = await response.json();
      console.log('Workout added:', data);
      // Reset form state
      setWorkout({
        name: '',
        description: '',
        minAge: '',
        maxAge: '',
        minWeight: '',
        maxWeight: '',
        minHeight: '',
        maxHeight: '',
        fitnessLevel: '',
        imageFile: null
      });
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <div className="card-workoutadmin">
      <div className="card-header-workoutadmin">
        <h2 className="card-title-workoutadmin">Add New Workout</h2>
      </div>
      <div className="card-content-workoutadmin">
        <form onSubmit={handleSubmit} className="workout-form-workoutadmin">
          <div className="form-group-workoutadmin">
            <label htmlFor="name">Workout Name</label>
            <input type="text" id="name" name="name" value={workout.name} onChange={handleChange} required />
          </div>

          <div className="form-group-workoutadmin">
            <label htmlFor="description">Description</label>
            <Suspense fallback={<div>Loading editor...</div>}>
              <ReactQuill theme="snow" value={workout.description} onChange={handleQuillChange} />
            </Suspense>
          </div>

          <div className="form-row-workoutadmin">
            <div className="form-group-workoutadmin">
              <label htmlFor="minAge">Min Age</label>
              <input type="number" id="minAge" name="minAge" value={workout.minAge} onChange={handleChange} required />
            </div>
            <div className="form-group-workoutadmin">
              <label htmlFor="maxAge">Max Age</label>
              <input type="number" id="maxAge" name="maxAge" value={workout.maxAge} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row-workoutadmin">
            <div className="form-group-workoutadmin">
              <label htmlFor="minWeight">Min Weight (kg)</label>
              <input type="number" id="minWeight" name="minWeight" value={workout.minWeight} onChange={handleChange} required />
            </div>
            <div className="form-group-workoutadmin">
              <label htmlFor="maxWeight">Max Weight (kg)</label>
              <input type="number" id="maxWeight" name="maxWeight" value={workout.maxWeight} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row-workoutadmin">
            <div className="form-group-workoutadmin">
              <label htmlFor="minHeight">Min Height (foot)</label>
              <input type="number" id="minHeight" name="minHeight" value={workout.minHeight} onChange={handleChange} required />
            </div>
            <div className="form-group-workoutadmin">
              <label htmlFor="maxHeight">Max Height (foot)</label>
              <input type="number" id="maxHeight" name="maxHeight" value={workout.maxHeight} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group-workoutadmin">
            <label htmlFor="fitnessLevel">Fitness Level</label>
            <select
              id="fitnessLevel"
              name="fitnessLevel"
              value={workout.fitnessLevel}
              onChange={handleSelectChange}
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
            <div className="file-input-wrapper-workoutadmin">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="file-input-button-workoutadmin"
              >
                Choose File
              </button>
              <span className="file-name-workoutadmin">
                {workout.imageFile ? workout.imageFile.name : "No file chosen"}
              </span>
            </div>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              onChange={handleFileChange}
              required
              className="hidden-file-input-workoutadmin"
              ref={fileInputRef}
              accept="image/*"
            />
            {workout.imagePreview && (
              <div className="image-preview-workoutadmin">
                <img src={workout.imagePreview || "/placeholder.svg"} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="submit-button-workoutadmin">
            Add Workout
          </button>
        </form>
      </div>
    </div>
  );
}
export default WorkoutForm;