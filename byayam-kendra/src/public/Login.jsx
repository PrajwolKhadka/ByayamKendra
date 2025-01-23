import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/ByayamSignup.css';
import VideoPlay from './Video';

const Login = ({setToken}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // To handle loading state
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Email
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
    }

    // Validate Password
    if (!password) {
      newErrors.password = "Password is required.";
    }

    // If there are any errors, update the error state and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true); // Show loading spinner

    // If no errors, proceed with the login (this can be an API call)
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        console.log("Logging in");
        // Redirect user to protected page
        navigate('/dashboard');
      } else {
        console.error('Login failed:', data.error);
        setErrors({ general: data.error });
      }
    } catch (err) {
      console.error('Error:', err);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false); // Hide loading spinner after request
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="video-background">
        <VideoPlay />
      </div>
      <div className="content">
        <h1>ByayamKendra.com</h1>
        <p>Kids Cry. You Sweat.</p>
      </div>
      <div className="formlogin">
        <div id="formdiv-login">
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <label htmlFor="E-mail">E-mail:</label><br />
            <input
              type="text"
              id="E-mail"
              name="E-mail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error-input" : ""}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
            <br />

            {/* Password Field */}
            <label htmlFor="Password">Password:</label><br />
            <input
              type={showPassword ? "text" : "password"}
              id="Password"
              name="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "error-input" : ""}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <br />
            <i
              className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} eye`}
              id="togglePassword"
              onClick={togglePasswordVisibility}
            ></i>
            <button id="LoginButton" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button><br />
            {errors.general && <span className="error-message-login">{errors.general}</span>}<br></br>
            <label className="register">New Here? </label>
            <Link to="/signup">Signup</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
