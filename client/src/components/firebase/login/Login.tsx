import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext"; //  path

const Login = () => {
  const [username, setUsername] = useState(""); // Django uses username by default
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // only grab login from context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password); // this calls your context login
      console.log("Logged in successfully");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
