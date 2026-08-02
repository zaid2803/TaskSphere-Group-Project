import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="logo">TaskSphere</h1>

        <p className="subtitle">
          Welcome back! Sign in to continue.
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <div className="options">

            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>

            <a href="#" className="forgot">
              Forgot Password?
            </a>

          </div>

          <button className="login-btn" type="submit">
            Sign In
          </button>

        </form>

        <div className="divider"></div>

        <p className="register">
          Don't have an account?
          <Link to="/register"> Create Account</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;