import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";
import { BASE_URL } from "../data";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Enter email and password!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      // ✅ Check if admin

      toast.success("Login Successful!");

      // Optional: store token
      localStorage.setItem("token", data.token);

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin}>
        <h2>🔒 Login To Continue</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>

        {/* LOGIN LINK */}
        <div className="auth-footer">
          <p>
            New Here?{" "}
            <a href="/register" className="auth-link">
              Register
            </a>
          </p>
          <a>
            {" "}
            <a href="/" className="auth-link">
              Home
            </a>
            <a href="/forgot-password" className="auth-link">
              Forgot Password
            </a>
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
