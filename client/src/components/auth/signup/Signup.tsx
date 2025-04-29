import React, { useState } from "react";
import axios from "../../../utils/axios";
import { Link, useNavigate } from "@tanstack/react-router";
import styles from "./Signup.module.css";

const Signup: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await axios.post(
                "/auth/signup/",
                { username, email, password, role },
                { withCredentials: true }
            );
            navigate({ to: "/login" });
        } catch {
            setError("Signup failed. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Create an Account</h2>
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
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <select
                            className={styles.select}
                            value={role}
                            onChange={e => setRole(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button className={styles.button} type="submit">Sign Up</button>
                </form>
                <div className={styles.footer}>
                    Already have an account? <Link className={styles.link} to="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
