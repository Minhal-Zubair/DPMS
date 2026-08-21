import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/axiosConfig";
function Login() {
  const navigate = useNavigate();

  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Login Data:", {
        username,
        password,
      });

      const response = await API.post("/auth/login", {
        username: username,
        password: password,
      });

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
localStorage.setItem("userId", response.data.userId);
localStorage.setItem("username", response.data.username);
localStorage.setItem("firstName", response.data.firstName);
localStorage.setItem("lastName", response.data.lastName);

console.log("First Name:", localStorage.getItem("firstName"));
console.log("Last Name:", localStorage.getItem("lastName"));

console.log(response.data);
console.log(localStorage.getItem("userId"));

      setShowRoleSelection(true);
    } catch (error) {
      console.log(error);

      alert("Invalid Username or Password");
    }
  };

  const loginAsUser = () => {
    navigate("/user/dashboard");
  };

  const loginAsAdmin = () => {
    navigate("/admin/dashboard");
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ad8458, #3f3c31, #86aebe)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "40px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
          animation: "fadeIn 0.8s ease",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              fontSize: "55px",
              marginBottom: "10px",
            }}
          >
            📄
          </div>

          <h1
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "34px",
              letterSpacing: "1px",
            }}
          >
            DPMS
          </h1>

          <p
            style={{
              color: "#d6d6d6",
              marginTop: "10px",
              fontSize: "15px",
            }}
          >
            Document Processing Management System
          </p>
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
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
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "12px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.25)",
            outline: "none",
            fontSize: "15px",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            boxSizing: "border-box",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
            color: "#fff",
            fontSize: "14px",
          }}
        >
          <label>
            <input type="checkbox" /> Remember Me
          </label>

          <span
            style={{
              cursor: "pointer",
              color: "#7fd8ff",
            }}
          >
            Forgot Password?
          </span>
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(90deg,#00c6ff,#0072ff)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
            boxShadow: "0 8px 20px rgba(0,114,255,.4)",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 25px rgba(0,114,255,.55)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 20px rgba(0,114,255,.4)";
          }}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#ddd",
            marginTop: "25px",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#7fd8ff",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </p>
      </div>

      {showRoleSelection && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "350px",
              background: "#fff",
              borderRadius: "15px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <h2>Select Dashboard</h2>

            <p>
              Login successful.
              <br />
              Continue as:
            </p>

            <button
              onClick={loginAsUser}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "20px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              User Dashboard
            </button>

            <button
              onClick={loginAsAdmin}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "15px",
                background: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Admin Dashboard
            </button>

            <button
              onClick={() => setShowRoleSelection(false)}
              style={{
                marginTop: "20px",
                background: "transparent",
                border: "none",
                color: "red",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        input::placeholder{
            color:#ddd;
        }

        @keyframes fadeIn{
            from{
                opacity:0;
                transform:translateY(30px);
            }
            to{
                opacity:1;
                transform:translateY(0);
            }
        }
      `}</style>

      <style>{`
        input::placeholder{
            color:#ddd;
        }

        @keyframes fadeIn{
            from{
                opacity:0;
                transform:translateY(30px);
            }
            to{
                opacity:1;
                transform:translateY(0);
            }
        }
      `}</style>
    </div>
  );
}

export default Login;
