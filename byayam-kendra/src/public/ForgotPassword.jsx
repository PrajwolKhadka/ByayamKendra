import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ForgotPassword.css";
import { Link } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successfully! You can now log in.");
        navigate("/login");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container-forgot">
      <Link to='/login' className="Back">⬅️</Link>
      <div className="card-forgot">
        <h2 className="title-forgot">Reset Password</h2>
        <form className="form-forgot" onSubmit={handleSubmit}>
          <input
            className="input-forgot"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container-forgot">
            <input
              className="input-forgot"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-forgot"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🔒" : "🔓"}
            </button>
          </div>
          <button className="button-forgot" type="submit">
            Reset Password
          </button>
        </form>
        {message && <p className="success-message-forgot">{message}</p>}
        {error && <p className="error-message-forgot">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
