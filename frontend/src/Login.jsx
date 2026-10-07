import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      onLogin(data.user);
    } catch (error) {
      console.error("Login Error:", error);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.logo}>🛒</div>

        <h1 style={styles.title}>Kirana Store</h1>

        <p style={styles.subtitle}>
          Management System
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.loginTitle}>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Local Grocery Store Management System
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    padding: "30px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },

  loginBox: {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "#ffffff",
    padding: "45px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    boxSizing: "border-box",
  },

  logo: {
    textAlign: "center",
    fontSize: "58px",
    marginBottom: "10px",
  },

  title: {
    textAlign: "center",
    margin: "0",
    fontSize: "34px",
    color: "#222",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: "17px",
    marginTop: "8px",
    marginBottom: "25px",
  },

  divider: {
    height: "1px",
    backgroundColor: "#e0e0e0",
    marginBottom: "25px",
  },

  loginTitle: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "22px",
    color: "#333",
  },

  formGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#333",
  },

  input: {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  error: {
    backgroundColor: "#ffe5e5",
    color: "#c00000",
    padding: "11px",
    borderRadius: "7px",
    marginBottom: "15px",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#222",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  footer: {
    textAlign: "center",
    color: "#888",
    fontSize: "12px",
    marginTop: "25px",
  },
};

export default Login;