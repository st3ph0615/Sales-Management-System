import { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";

export default function Login({ onLogin, activeTab, onTabChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // 🔥 DEBUG — CHECK WHAT BACKEND IS SENDING
      console.log("LOGIN RESPONSE USER:", user);

      // 🔥 MUST include customer_id, or Buy Now will not work
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (onLogin) onLogin(user);
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <AuthLayout activeTab={activeTab} onTabChange={onTabChange}>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.submitBtn}>
          Login
        </button>
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

     