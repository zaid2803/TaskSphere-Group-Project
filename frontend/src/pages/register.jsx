import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

setError("");

    alert("Registration Successful!");
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="logo">TaskSphere</h1>

        <p className="subtitle">
          Create your account to get started.
        </p>

        <form onSubmit={handleRegister}>

          <div className="form-group">
           <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
           <label htmlFor="register-email">Email Address</label>

<input
  id="register-email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
            <label htmlFor="register-password">Password</label>

            <div className="password-wrapper">

              <input
              id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>

            <div className="password-wrapper">

              <input
               id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>
{error && (
  <p className="error-message">
    {error}
  </p>
)}
          <button className="login-btn" type="submit">
            Create Account
          </button>

        </form>

        <div className="divider"></div>

        <p className="register">
          Already have an account?
          <Link to="/"> Sign In</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;