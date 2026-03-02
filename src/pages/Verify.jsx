import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";
import { BASE_URL } from "../data";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email"); // email from query

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]); // six digits

  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; // only digits
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    const newCode = [...code];
    for (let i = 0; i < 6; i++) newCode[i] = pasted[i] || "";
    setCode(newCode);
    const lastFilled = pasted.length - 1;
    inputRefs.current[lastFilled]?.focus();
  };

  // Verify OTP
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const otp = code.join("");
  //     if (otp.length < 6) {
  //       toast.error("Enter the 6-digit verification code.");
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       const res = await fetch(`${BASE_URL}/auth/verify`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email, code: otp }),
  //       });
  //       const data = await res.json();
  //       if (!data.success) {
  //         toast.error(data.message || "Verification failed.");
  //         return;
  //       }
  //       toast.success("Verification successful!");
  //       setTimeout(() => {
  //         navigate("/successful", {
  //           state: {
  //             message: "Account verified successfully! You can now log in.",
  //           },
  //         });
  //       }, 1000);
  //     } catch (err) {
  //       toast.error("Something went wrong. Try again.");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = code.join("");
    if (otp.length < 6) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await res.json();

      if (!data.success) {
        // Already verified case
        if (
          data.message &&
          data.message.toLowerCase().includes("already verified")
        ) {
          toast.info("Account already verified. Redirecting to login...");
          setTimeout(() => navigate("/login"), 1000);
          return;
        }

        toast.error(data.message || "Verification failed.");
        return;
      }

      // Success case
      toast.success("Verification successful!");
      setTimeout(() => {
        navigate("/successful", {
          state: {
            message: "Account verified successfully! You can now log in.",
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

  // Resend OTP
  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) {
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
        <h2>✅ Verify Your Email</h2>
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

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
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
