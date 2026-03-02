import { useState } from "react";
import { COUNTRIES, BASE_URL } from "../data";
import { toast } from "react-toastify";
import { IoCloseCircle } from "react-icons/io5";

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    country: "",
    countryFlag: "",
    password: "",
    confirm: "",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const handleCountrySelect = (country) => {
    setForm({ ...form, country: country.name, countryFlag: country.flag });
    setShowModal(false);
    setCountrySearch("");
  };

  const handleNextStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.userName || !form.fullName || !form.email || !form.phoneNumber) {
      toast.error("Please fill all fields.");
      return;
    }
    if (!emailRegex.test(form.email)) {
      toast.error("Enter a valid email.");
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!form.country) {
      toast.error("Please select a country.");
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: form.userName,
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          country: form.country,
          countryFlag: form.countryFlag,
          password: form.password,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!data.success) {
        // If user exists but is unverified
        if (
          data.message &&
          data.message.toLowerCase().includes("not verified")
        ) {
          toast.info(
            "User exists but unverified. Redirecting to verification...",
          );
          //   window.location.href = `/verify?email=${form.email}`;
          setTimeout(() => {
            window.location.href = `/verify?email=${form.email}`;
          }, 5000); // wait 1.5 seconds
        } else {
          toast.error(data.message || "Registration failed.");
        }
      } else {
        toast.success("Registration Successful!");
        // window.location.href = `/verify?email=${form.email}`;
        setTimeout(() => {
          window.location.href = `/verify?email=${form.email}`;
        }, 5000); // wait 1.5 seconds
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h3>{step}/3</h3>
        <h2>🔐 Create Account</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="form-group">
              <label htmlFor="userName">Trading Username</label>
              <input
                id="userName"
                type="text"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="text"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
            </div>

            <button type="button" className="btn" onClick={handleNextStep1}>
              Continue
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                placeholder="Click to select a country"
                value={form.country}
                readOnly
                onClick={() => setShowModal(true)}
              />
            </div>

            <button type="button" className="btn" onClick={handleNextStep2}>
              Continue
            </button>

            <div
              className="auth-footer"
              style={{ textAlign: "left", marginTop: 0 }}
            >
              <a
                href="#"
                className="auth-link"
                onClick={(e) => {
                  e.preventDefault(); // prevents page reload
                  setStep(1);
                }}
              >
                Go Back
              </a>
            </div>

            {/* COUNTRY MODAL */}
            {showModal && (
              <div className="modal-backdrop">
                <div className="modal">
                  <div className="modal-header">
                    <input
                      type="text"
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                    />
                    {countrySearch && (
                      <IoCloseCircle
                        size={24}
                        onClick={() => setCountrySearch("")}
                        className="clear-icon"
                      />
                    )}
                  </div>
                  <ul className="modal-list">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((c) => (
                        <li key={c.name} onClick={() => handleCountrySelect(c)}>
                          {c.flag} {c.name}
                        </li>
                      ))
                    ) : (
                      <li
                        style={{
                          padding: "8px",
                          color: "#ccc",
                          cursor: "default",
                          textAlign: "center",
                        }}
                      >
                        Country not found
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
            </div>

            <div>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>

            <div
              className="auth-footer"
              style={{ textAlign: "left", marginTop: 0 }}
            >
              <a
                href="#"
                className="auth-link"
                onClick={(e) => {
                  e.preventDefault(); // prevents page reload
                  setStep(2);
                }}
              >
                Go Back
              </a>
            </div>
          </>
        )}

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <a href="/login" className="auth-link">
              Login
            </a>
          </p>
        </div>
      </form>

      {/* MODAL CSS */}
      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }
        .modal {
          background: #0f172a;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
          max-height: 700px;
          display: flex;
          flex-direction: column;
        }
        .modal-header {
          position: relative;
        }
        .modal-header input {
          width: 100%;
          padding: 8px 30px 8px 8px;
        }
        .clear-icon {
          position: absolute;
          right: 5px;
          top: 35%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #0ea5e9;
        }
        .modal-list {
          margin: 10px 0;
          padding: 0;
          list-style: none;
          overflow-y: auto;
          flex: 1;
          text-align: left;
        }
        .modal-list li {
          padding: 8px;
          cursor: pointer;
        }
        .modal-list li:hover {
          background: #141f39;
        }
        .modal-close {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
