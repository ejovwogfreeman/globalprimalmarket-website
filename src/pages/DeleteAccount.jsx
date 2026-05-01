import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";
import { BASE_URL } from "../data";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Enter your password to confirm!");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ sends req.user_id from backend middleware
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete account");
        return;
      }

      toast.success("Account deleted successfully");

      // ✅ Clear auth + redirect
      localStorage.removeItem("token");

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleDelete}>
        <h2>⚠️ Delete Account</h2>

        <p style={{ color: "red", fontSize: "14px" }}>
          This action is permanent. Enter your password to confirm.
        </p>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Deleting..." : "Delete Account"}
        </button>

        <div className="auth-footer">
          <p>
            Changed your mind?{" "}
            <Link to="/profile" className="auth-link">
              Go Back
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccount;
