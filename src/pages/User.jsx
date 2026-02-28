import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { BASE_URL } from "../data";

const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Loading states for modals
  const [updateLoading, setUpdateLoading] = useState(false);
  const [fundLoading, setFundLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [updateData, setUpdateData] = useState({
    fullName: "",
    role: "",
    phoneNumber: "",
  });

  const [fundData, setFundData] = useState({
    fundAmount: "",
    fundMode: "btc", // default value
  });

  // Fetch user
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p>Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="spinner-wrapper">
        <p>User not found</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // ---------------- Handlers ----------------
  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  // ---------------- Handlers ----------------
  const handleUpdateSubmit = async () => {
    if (!updateData.fullName || !updateData.phoneNumber || !updateData.status)
      return toast.error("Please fill all fields");
    setUpdateLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/user/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("User updated successfully");
        await fetchUser(); // Re-fetch user first
        setShowUpdateModal(false); // Then close modal
        // Reset updateData
        setUpdateData({
          fullName: "",
          role: "",
          phoneNumber: "",
        });
      } else {
        console.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleFundChange = (e) => {
    const { name, value } = e.target;
    setFundData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleFundSubmit = async () => {
  //   if (!fundAmount || Number(fundAmount) <= 0)
  //     return toast.error("Please enter an amount");
  //   setFundLoading(true);
  //   try {
  //     const res = await fetch(`${BASE_URL}/admin/user/fund/${id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       body: JSON.stringify({ amount: Number(fundAmount) }),
  //     });

  //     const data = await res.json();
  //     if (data.success) {
  //       toast.success("User funded successfully");
  //       await fetchUser(); // Re-fetch user first
  //       setShowFundModal(false); // Then close modal
  //       setFundAmount(""); // Reset fund input
  //     } else {
  //       console.error(data.message || "Funding failed");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setFundLoading(false);
  //   }
  // };

  const handleFundSubmit = async () => {
    const { fundAmount, fundMode } = fundData;

    // Validation
    if (!fundAmount || Number(fundAmount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    if (!fundMode) {
      return toast.error("Please select a currency mode");
    }

    setFundLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/admin/user/fund/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: Number(fundAmount),
          mode: fundMode, // send the selected currency
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("User funded successfully");
        await fetchUser(); // Re-fetch user first
        setShowFundModal(false); // Then close modal
        setFundData({ fundAmount: "", fundMode: "" }); // Reset both fields
      } else {
        toast.error(data.message || "Funding failed");
        console.error(data.message || "Funding failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while funding");
    } finally {
      setFundLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/user/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("User deleted successfully");
        setShowDeleteModal(false);
        navigate("/users");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ------------------ Helpers ------------------
  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
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
    <>
      <Navbar />
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>

        <div className="user-card">
          <div className="user-card-header">
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
            <div className="user-info">
              <span style={{ fontWeight: 600 }}>Balances:</span>

              <div className="balance-grid">
                {user?.balance &&
                  Object.entries(user.balance).map(([symbol, amount]) => (
                    <div key={symbol} className="balance-item">
                      <strong>
                        {Number(amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                      <span className="balance-mode">
                        {symbol.toUpperCase()}
                      </span>
                    </div>
                  ))}
              </div>
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
              onClick={() => {
                setUpdateData({
                  fullName: user.fullName,
                  role: user.role,
                  phoneNumber: user.phoneNumber,
                });
                setShowUpdateModal(true);
              }}
            >
              UPDATE
            </button>
            <button
              className="action-btn fund-btn"
              onClick={() => setShowFundModal(true)}
            >
              FUND
            </button>
            <button
              className="action-btn delete-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              DELETE
            </button>
          </div>
        </div>
      </div>

      {/* ------------------ UPDATE MODAL ------------------ */}
      {showUpdateModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Update User</h3>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={updateData.fullName}
              onChange={handleUpdateChange}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={updateData.phoneNumber}
              onChange={handleUpdateChange}
            />
            <select
              name="role"
              value={updateData.role}
              onChange={handleUpdateChange}
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="modal-actions">
              <button onClick={handleUpdateSubmit} disabled={updateLoading}>
                {updateLoading ? "Updating..." : "Save"}
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

      {/* ------------------ FUND MODAL ------------------ */}
      {showFundModal && (
        // <div className="modal-backdrop">
        //   <div className="modal">
        //     <h3>Fund User</h3>
        //     <input
        //       type="number"
        //       placeholder="Amount"
        //       value={fundAmount}
        //       onChange={(e) => setFundAmount(e.target.value)}
        //     />
        //     <div className="modal-actions">
        //       <button onClick={handleFundSubmit} disabled={fundLoading}>
        //         {fundLoading ? "Funding..." : "Fund"}
        //       </button>
        //       <button
        //         onClick={() => setShowFundModal(false)}
        //         disabled={fundLoading}
        //       >
        //         Cancel
        //       </button>
        //     </div>
        //   </div>
        // </div>
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Fund User</h3>

            {/* Amount Input */}
            <input
              type="number"
              name="fundAmount"
              placeholder="Amount"
              value={fundData.fundAmount}
              onChange={handleFundChange}
            />

            {/* Mode Dropdown */}
            <select
              name="fundMode"
              value={fundData.fundMode}
              onChange={handleFundChange}
            >
              <option value="" disabled>
                Select Currency
              </option>
              <option value="btc">BTC</option>
              <option value="eth">ETH</option>
              <option value="sol">SOL</option>
              <option value="trx">TRX</option>
              <option value="bnb">BNB</option>
              <option value="xrp">XRP</option>
            </select>

            {/* Actions */}
            <div className="modal-actions">
              <button onClick={handleFundSubmit} disabled={fundLoading}>
                {fundLoading ? "Funding..." : "Fund"}
              </button>
              <button
                onClick={() => setShowFundModal(false)}
                disabled={fundLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ DELETE MODAL ------------------ */}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Are you sure?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={handleDeleteUser} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default User;
