import React, { useState } from "react";
import "./Login.css";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username] === password) {
      onLoginSuccess();
    } else {
      setError("Invalid username or password ❌");
    }
  };

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
      setError("Username already exists ❗");
    } else {
      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
      setError("✅ Registration successful! Please log in.");
      setIsRegistering(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? "Create an Account" : "Welcome Back!"}</h2>
        <p>
          {isRegistering ? "Register to get started" : "Log in to continue"}
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <button onClick={isRegistering ? handleRegister : handleLogin}>
          {isRegistering ? "Sign Up" : "Log In"}
        </button>

        <p className="toggle-text">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
