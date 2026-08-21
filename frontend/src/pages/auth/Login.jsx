import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/axiosConfig";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await API.post("/auth/login", { username, password });
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);
      localStorage.setItem("firstName", data.firstName);
      localStorage.setItem("lastName", data.lastName);
      localStorage.setItem("role", data.role);

      // Auto-route based on role — no manual selection
      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.log(error);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "55px", marginBottom: "10px" }}>📄</div>
          <h1 style={{ color: "#fff", margin: 0, fontSize: "34px", letterSpacing: "1px" }}>
            DPMS
          </h1>
          <p style={{ color: "#d6d6d6", marginTop: "10px", fontSize: "15px" }}>
            Document Processing Management System
          </p>
        </div>

        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ ...styles.input, marginBottom: "24px" }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", color: "#ddd", marginTop: "25px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#7fd8ff", fontWeight: "bold", textDecoration: "none" }}>
            Register
          </Link>
        </p>
      </div>

      <style>{`input::placeholder { color: #ddd; } @keyframes fadeIn { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ad8458, #3f3c31, #86aebe)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    width: "420px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
    animation: "fadeIn 0.8s ease",
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.25)",
    outline: "none",
    fontSize: "15px",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg,#00c6ff,#0072ff)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,114,255,.4)",
  },
  errorBox: {
    background: "rgba(239,68,68,0.2)",
    border: "1px solid rgba(239,68,68,0.5)",
    color: "#fca5a5",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default Login;