import React, { useState } from "react";
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from "../../../context/AuthContext";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate({ to: "/" });
    } catch {
      setError("Login failed. Please try again.")
    }
  };

  return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Log in to Your Account</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                className={styles.input}
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                className={styles.input}
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.showPassword}
                onClick={() => setShowPwd(s => !s)}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            <button type="submit" className={styles.button}>Log In</button>
          </form>
          <div className={styles.footer}>
            Don't have an account? <Link className={styles.link} to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
  );
};

export default Login;
