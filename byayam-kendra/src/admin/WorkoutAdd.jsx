import React, { useState } from 'react';
import '../css/WorkoutForm.css';

const WorkoutForm = () => {
  const [workout, setWorkout] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setWorkout(prevState => ({
      ...prevState,
      imageFile: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Workout to be submitted:', workout);
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
  };

  return (
    <div className="workout-form-container">
      <h2>Add New Workout</h2>
      <form onSubmit={handleSubmit} className="workout-form">
        <div className="form-group-workout">
          <label htmlFor="name">Workout Name:</label>
          <input type="text" id="name" name="name" value={workout.name} onChange={handleChange} required />
        </div>

        <div className="form-group-workout">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={workout.description} onChange={handleChange} required />
        </div>

        <div className="form-row-workout">
          <div className="form-group-workout">
            <label htmlFor="minAge">Min Age:</label>
            <input type="number" id="minAge" name="minAge" value={workout.minAge} onChange={handleChange} required />
          </div>
          <div className="form-group-workout">
            <label htmlFor="maxAge">Max Age:</label>
            <input type="number" id="maxAge" name="maxAge" value={workout.maxAge} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row-workout">
          <div className="form-group-workout">
            <label htmlFor="minWeight">Min Weight (lbs):</label>
            <input type="number" id="minWeight" name="minWeight" value={workout.minWeight} onChange={handleChange} required />
          </div>
          <div className="form-group-workout">
            <label htmlFor="maxWeight">Max Weight (lbs):</label>
            <input type="number" id="maxWeight" name="maxWeight" value={workout.maxWeight} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row-workout">
          <div className="form-group-workout">
            <label htmlFor="minHeight">Min Height (cm):</label>
            <input type="number" id="minHeight" name="minHeight" value={workout.minHeight} onChange={handleChange} required />
          </div>
          <div className="form-group-workout">
            <label htmlFor="maxHeight">Max Height (cm):</label>
            <input type="number" id="maxHeight" name="maxHeight" value={workout.maxHeight} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group-workout">
          <label htmlFor="fitnessLevel">Fitness Level:</label>
          <select id="fitnessLevel" name="fitnessLevel" value={workout.fitnessLevel} onChange={handleChange} required>
            <option value="">Select Fitness Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group-workout">
          <label htmlFor="imageFile">Upload Image:</label>
          <input type="file" id="imageFile" name="imageFile" onChange={handleFileChange} required />
        </div>

        <button type="submit" className="submit-btn">Add Workout</button>
      </form>
    </div>
  );
};

export default WorkoutForm;
