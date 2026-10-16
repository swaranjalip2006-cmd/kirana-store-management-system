import { useState } from "react";

function Login({ onLogin, onBackHome }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      const endpoint = isRegister
        ? "http://localhost:5000/auth/register"
        : "http://localhost:5000/auth/login";

      const body = isRegister
        ? {
            name: name.trim(),
            email: email.trim(),
            password,
            role: "Customer",
          }
        : {
            email: email.trim(),
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            (isRegister
              ? "Account creation failed."
              : "Invalid email or password.")
        );
        return;
      }

      if (isRegister) {
        setSuccess(
          "Account created successfully! Please login with your account."
        );
        setIsRegister(false);
        setPassword("");
        setConfirmPassword("");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError("Login response did not contain user details.");
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <button
          type="button"
          onClick={onBackHome}
          style={styles.backButton}
        >
          ← Back to Home
        </button>

        <div style={styles.logo}>🛒</div>

        <h1 style={styles.title}>Kirana Store</h1>

        <p style={styles.subtitle}>Management System</p>

        <div style={styles.divider}></div>

        <h2 style={styles.loginTitle}>
          {isRegister ? "Create Account" : "Admin Login"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              autoComplete="email"
              required
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
              autoComplete={
                isRegister ? "new-password" : "current-password"
              }
              required
            />
          </div>

          {isRegister && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                autoComplete="new-password"
                required
              />
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}

          {success && (
            <div style={styles.success}>{success}</div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Login"}
          </button>
        </form>

        <p style={styles.switchText}>
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            style={styles.linkButton}
            disabled={loading}
          >
            {isRegister ? "Login" : "Create Account"}
          </button>
        </p>

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
    padding: "30px 16px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },

  loginBox: {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "#ffffff",
    padding: "35px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    boxSizing: "border-box",
  },

  backButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    padding: "0",
    marginBottom: "20px",
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
    marginBottom: "18px",
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

  success: {
    backgroundColor: "#e5f8e9",
    color: "#176b2c",
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

  switchText: {
    textAlign: "center",
    color: "#555",
    fontSize: "14px",
    marginTop: "22px",
  },

  linkButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#2563eb",
    fontSize: "14px",
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
