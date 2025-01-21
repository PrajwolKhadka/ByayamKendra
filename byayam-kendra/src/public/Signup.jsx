import React, { useState } from 'react';
import '../css/ByayamSignup.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import VideoPlay from './Video';

const Signup = () => {
  // State for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    // Validate Passwords
    if (!password) {
      newErrors.password = "Password is required.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
  
    // Validate other fields
    if (!username) {
      newErrors.username = "Username is required.";
    }
    if (!email) {
      newErrors.email = "Email is required.";
    }
    if (!gender) {
      newErrors.gender = "Gender is required.";
    }
  
    // If there are errors, set them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    // If no errors, proceed with form submission
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          gender,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Signup successful:', data);
        navigate('/login'); // Redirect to login page
      } else {
        console.error('Signup failed:', data.error);
        setErrors({ general: data.error });  // Show a general error message to users
      }
    } catch (err) {
      console.error('Error:', err);
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="video-background">
      <VideoPlay />

      <div className="content">
        <h1>ByayamKendra.com</h1>
        <p>Kids Cry . You Sweat</p>
      </div>

      <div className="form">
        <div id="formdiv">
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <label htmlFor="Username">Username:</label>
            <br />
            <input
              type="text"
              id="Username"
              name="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errors.username ? "error-input" : ""}
              required
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
            <br />

            {/* Email */}
            <label htmlFor="E-mail">E-mail:</label>
            <br />
            <input
              type="email"
              id="E-mail"
              name="E-mail"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error-input" : ""}
              required
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
            <br />

            {/* Password */}
            <label htmlFor="Password">Password:</label>
            <br />
            <input
              type={showPassword ? 'text' : 'password'}
              id="Password"
              name="Password"
              minLength="8"
              maxLength="16"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "error-input" : ""}
            />
            <i
              className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} eye-iconMain`}
              onClick={togglePasswordVisibility}
            ></i>
            {errors.password && (
              <span className="error-message1">{errors.password}</span>
            )}
            <br />

            {/* Confirm Password */}
            <label htmlFor="ConfirmPassword">Confirm Password:</label>
            <br />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="ConfirmPassword"
              name="ConfirmPassword"
              minLength="8"
              maxLength="16"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={errors.confirmPassword ? "error-input" : ""}
            />
            <i
              className={`bx ${showConfirmPassword ? 'bx-show' : 'bx-hide'} eye-icon`}
              onClick={toggleConfirmPasswordVisibility}
            ></i>
            {errors.confirmPassword && (
              <span className="error-message2">{errors.confirmPassword}</span>
            )}
            <br />

            {/* Gender */}
            <label htmlFor="Gender">Gender:</label>
            <select
              id="Gender"
              name="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className={errors.gender ? "error-input" : ""}
            >
              <option value="" disabled>Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <span className="error-message">{errors.gender}</span>
            )}

            {/* Sign Up Button */}
            <button id="RegisterButton" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'SignUp'}
            </button><br/>
            {/* Login Link */}
            <label className="login">Already have an account? </label>
            <Link to="/login">Login</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
