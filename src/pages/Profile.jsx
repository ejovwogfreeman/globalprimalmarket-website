import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FaPenAlt } from "react-icons/fa"; // Pencil icon
import { COUNTRIES, BASE_URL, CRYPTO_MODES } from "../data";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);

  // Loading states
  const [updateLoading, setUpdateLoading] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("Select country");
  const [profilePicture, setProfilePicture] = useState(null);

  // ---------------- Fetch current logged-in user ----------------
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setUser(data.user);

      // Pre-fill form fields
      setFullName(data.user.fullName || "");
      setUserName(data.user.userName || "");
      setPhoneNumber(data.user.phoneNumber || "");
      setCountry(data.user.country || "Select country");
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdateSubmit = async () => {
    if (!fullName || !phoneNumber || !userName || country === "Select country")
      return toast.error("Please fill all fields");

    // Find the selected country's flag
    const selectedCountry = COUNTRIES.find((c) => c.name === country);
    const countryFlag = selectedCountry ? selectedCountry.flag : "";

    setUpdateLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          fullName,
          userName,
          phoneNumber,
          country,
          countryFlag, // add flag to the request
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully");
        await fetchUser();
        setShowUpdateModal(false);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setUpdateLoading(false);
    }
  };

  // ---------------- Update Profile Picture Modal ----------------
  const handlePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handlePictureSubmit = async () => {
    if (!profilePicture) return toast.error("Please select an image");

    setPictureLoading(true);
    try {
      const formData = new FormData();
      formData.append("images", profilePicture);

      const res = await fetch(`${BASE_URL}/user/change-profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile picture updated!");
        await fetchUser();
        setShowPictureModal(false);
        setProfilePicture(null);
      } else {
        toast.error(data.message || "Failed to update picture");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setPictureLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="spinner-wrapper">
        <p>User not found</p>
      </div>
    );
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "rgba(0, 128, 0, 0.3)";
      case "user":
        return "rgba(0, 123, 255, 0.3)";
      default:
        return "rgba(128,128,128,0.3)";
    }
  };

  const getVerifiedColor = (isVerified) => {
    switch (isVerified) {
      case true:
        return "rgba(0, 123, 255, 0.3)";
      case false:
        return "rgba(255, 0, 0, 0.3)";
      default:
        return "rgba(128,128,128,0.3)";
    }
  };

  return (
    <div style={{ marginTop: "70px" }}>
      <Navbar />
      <div className="container">
        <div className="user-card">
          <div className="user-card-header" style={{ position: "relative" }}>
            {user.profilePicture?.[0] ? (
              <img
                src={user.profilePicture[0]}
                alt={user.fullName}
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar-initials">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}

            {/* Pencil Icon to change profile picture */}
            <FaPenAlt
              className="pencil-icon"
              onClick={() => setShowPictureModal(true)}
            />

            <h2>{user.fullName}</h2>
            <p className="username">@{user.userName}</p>
          </div>

          <div className="user-card-body">
            <div className="user-info">
              <span>Email:</span> <span>{user.email}</span>
            </div>
            <div className="user-info">
              <span>Phone:</span> <span>{user.phoneNumber || "N/A"}</span>
            </div>
            <div className="user-info">
              <span>Country:</span>{" "}
              <span>
                {user.countryFlag || "N/A"} {user.country || "N/A"}
              </span>
            </div>
            <div className="user-info">
              <span>Role:</span>{" "}
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "10px",
                  color: "white",
                  display: "inline",
                  backgroundColor: getRoleColor(user.role),
                }}
              >
                {user.role}
              </span>
            </div>
            <div className="user-info">
              <span>Verified:</span>{" "}
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "10px",
                  color: "white",
                  display: "inline",
                  backgroundColor: getVerifiedColor(user.isVerified),
                }}
              >
                {user.isVerified ? "Yes" : "No"}
              </span>
            </div>

            {/* <div className="user-info">
              <span style={{ fontWeight: 600 }}>Balances:</span>
              <div className="balance-grid">
                {user?.balance &&
                  Object.entries(user.balance).map(([symbol, amount]) => (
                    <div key={symbol} className="balance-item">
                      <strong>
                        {Number(amount).toLocaleString("en-US", {
                          minimumFractionDigits: 5,
                          maximumFractionDigits: 5,
                        })}
                      </strong>
                      <span className="balance-mode">
                        {symbol.toUpperCase()}
                      </span>
                    </div>
                  ))}
              </div>
            </div> */}

            <div className="user-info">
              <span style={{ fontWeight: 600 }}>Balances:</span>

              {user?.balance &&
                (() => {
                  const balances = user.balance;

                  // ✅ Total USDT calculation
                  const totalUSDT = Object.entries(balances).reduce(
                    (sum, [symbol, amount]) => {
                      const crypto = CRYPTO_MODES.find(
                        (c) => c.symbol === symbol,
                      );

                      const value = Number(amount) || 0;

                      if (symbol === "usdt") return sum + value;
                      if (!crypto) return sum;

                      return sum + value * crypto.rate;
                    },
                    0,
                  );

                  return (
                    <>
                      {/* ✅ TOTAL (ABOVE GRID) */}
                      <div className="total">
                        <span className="balance-mode">TOTAL BALANCE</span>
                        <div className="balance-item">
                          <strong>
                            {totalUSDT.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </strong>
                          <span className="balance-mode">USDT</span>
                        </div>
                      </div>

                      {/* ✅ GRID (ONLY COINS) */}
                      <div className="balance-grid">
                        {Object.entries(balances).map(([symbol, amount]) => {
                          const crypto = CRYPTO_MODES.find(
                            (c) => c.symbol === symbol,
                          );

                          const value = Number(amount) || 0;

                          const usdtValue =
                            symbol === "usdt"
                              ? value
                              : crypto
                                ? value * crypto.rate
                                : 0;

                          return (
                            <div key={symbol}>
                              <div className="balance-item">
                                <strong>
                                  {value.toLocaleString("en-US", {
                                    minimumFractionDigits: 5,
                                    maximumFractionDigits: 5,
                                  })}
                                </strong>
                                <span className="balance-mode">
                                  {symbol.toUpperCase()}{" "}
                                </span>
                              </div>
                              <small style={{ color: "#757C86" }}>
                                (
                                {usdtValue.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                USDT)
                              </small>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
            </div>

            <div className="user-info">
              <span>Date Joined:</span>{" "}
              <span>
                {new Date(user.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="user-card-actions">
            <button
              className="action-btn update-btn"
              onClick={() => setShowUpdateModal(true)}
            >
              UPDATE PROFILE
            </button>
          </div>
        </div>
      </div>

      {/* ------------------ Edit Profile Modal ------------------ */}
      {showUpdateModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit Profile</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="Select country" disabled>
                Select country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={handleUpdateSubmit} disabled={updateLoading}>
                {updateLoading ? "Updating..." : "Save Changes"}
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
                disabled={updateLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ Update Picture Modal ------------------ */}
      {showPictureModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Update Profile Picture</h3>
            {profilePicture && (
              <div style={{ marginBottom: "10px", textAlign: "center" }}>
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ccc",
                  }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
            />
            <div className="modal-actions">
              <button onClick={handlePictureSubmit} disabled={pictureLoading}>
                {pictureLoading ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={() => {
                  setShowPictureModal(false);
                  setProfilePicture(null);
                }}
                disabled={pictureLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
