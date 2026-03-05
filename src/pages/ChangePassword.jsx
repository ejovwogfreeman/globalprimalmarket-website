import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";
import { BASE_URL } from "../data";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false); // ✅ FIXED
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");

  const inputRefs = useRef([]);

  // Focus first input
  useEffect(() => {
    if (!email) {
      toast.error("Email not found.");
      navigate("/login");
    }
    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);

    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newCode = pasted.split("");
    while (newCode.length < 6) newCode.push("");
    setCode(newCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing.");
      return;
    }

    const otp = code.join("");

    if (otp.length !== 6) {
      toast.error("Enter the complete 6-digit code.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Password change failed.");
        return;
      }

      toast.success("Password changed successfully!");
      setTimeout(() => {
        navigate("/successful", {
          state: {
            message: "Password changed successfully! You can now log in.",
          },
        });
      }, 1000);
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    try {
      setResending(true);

      const res = await fetch(`${BASE_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to resend code.");
        return;
      }

      toast.success("Verification code resent successfully!");
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>🔐 Reset Password</h2>
        <p>Enter the 6-digit code sent to {email}</p>

        <div className="otp-container">
          {code.map((c, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={c}
              ref={(el) => (inputRefs.current[idx] = el)}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              className="otp-input"
            />
          ))}
        </div>

        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>

        <div className="auth-footer">
          <p>
            Didn't receive a code? <br />
            <button
              type="button"
              className="auth-link"
              onClick={handleResend}
              disabled={resending}
              style={{
                margin: "0px",
                border: "none",
                background: "transparent",
                cursor: resending ? "not-allowed" : "pointer",
                width: "auto",
              }}
            >
              {resending ? "Resending..." : "Resend Code"}
            </button>
          </p>
        </div>
      </form>

      <style>{`
        .otp-container {
          display: flex;
          justify-content: space-between;
          margin: 20px 0px 10px;
          max-width: 350px;
        }
        .otp-input {
          width: 45px;
          height: 50px;
          font-size: 24px;
          text-align: center;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        .otp-input:focus {
          border-color: #0ea5e9;
          outline: none;
          box-shadow: 0 0 0 2px rgba(14,165,233,0.3);
        }
      `}</style>
    </div>
  );
}
