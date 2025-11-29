import { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";

export default function Register({ activeTab, onTabChange, onRegistered }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });

      setMessage("Registration successful!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (onRegistered) onRegistered();

    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <AuthLayout activeTab={activeTab} onTabChange={onTabChange}>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Re-enter password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.submitBtn}>Register</button>
        <p>{message}</p>
      </form>
    </AuthLayout>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #ccc",
  },
  submitBtn: {
    width: "100%",
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: 6,
  },
};
