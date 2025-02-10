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
            <label htmlFor="minWeight">Min Weight (kg):</label>
            <input type="number" id="minWeight" name="minWeight" value={workout.minWeight} onChange={handleChange} required />
          </div>
          <div className="form-group-workout">
            <label htmlFor="maxWeight">Max Weight (kg):</label>
            <input type="number" id="maxWeight" name="maxWeight" value={workout.maxWeight} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row-workout">
          <div className="form-group-workout">
            <label htmlFor="minHeight">Min Height (foot):</label>
            <input type="number" id="minHeight" name="minHeight" value={workout.minHeight} onChange={handleChange} required />
          </div>
          <div className="form-group-workout">
            <label htmlFor="maxHeight">Max Height (foot):</label>
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
