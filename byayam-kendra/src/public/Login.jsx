import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/ByayamSignup.css";
import VideoPlay from "./Video";

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  
    setIsLoading(true);
  
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
  
        // Set user data including role
        const userData = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role, 
        };
  
        localStorage.setItem("user", JSON.stringify(userData));
  
        //  role and token bata auth state update garne
        setAuth({role: data.user.role });
        setAuthToken(data.token);

  
        console.log("Logged in successfully");
  
        // Redirect based on role
        if (data.user.role === "admin") {
          navigate("/admindash");
        } else {
          navigate("/dashboard");
        }
      } else {
        setErrors({ general: data.error });
      }
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
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
            <label htmlFor="email">E-mail:</label><br />
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error-input" : ""}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
            <br />

            <label htmlFor="password">Password:</label><br />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "error-input" : ""}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <br />
            <i className={`bx ${showPassword ? "bx-show" : "bx-hide"} eye`} onClick={togglePasswordVisibility}></i>

            <button id="LoginButton" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <br />
            {errors.general && <span className="error-message-login">{errors.general}</span>}
            <br />
            <label className="register">New Here? </label>
            <Link to="/signup">Signup</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
