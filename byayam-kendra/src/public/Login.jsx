import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/ByayamSignup.css';
import VideoPlay from './Video';

const Login = () => {
    // const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // const email = e.target["E-mail"].value;
        // const password = e.target["Password"].value;
        // console.log("Email:", email, "Password:", password);
        // Add logic for authentication (e.g., API call)
        // navigate("/dashboard"); // Redirect on success
    };

    const togglePasswordVisibility = () => {
        const passwordInput = document.getElementById("Password");
        const toggleIcon = document.getElementById("togglePassword");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.classList.replace('bx-hide', 'bx-show');
        } else {
            passwordInput.type = "password";
            toggleIcon.classList.replace('bx-show', 'bx-hide');
        }
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
                        <label htmlFor="E-mail">E-mail:</label><br />
                        <input
                            type="text"
                            id="E-mail"
                            name="E-mail"
                            placeholder="Email"
                            required
                        /><br />
                        <label htmlFor="Password">Password:</label><br />
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            placeholder="Password"
                            required
                        /><br />
                        <i
                            className="bx bx-hide eye"
                            id="togglePassword"
                            onClick={togglePasswordVisibility}
                        ></i>
                        <button id="LoginButton" type="submit">Login</button><br />
                        <label className="register">New Here? </label>
                        <Link to="/signup">Signup</Link>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
