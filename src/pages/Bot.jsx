import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { BASE_URL } from "../data";
import { FaRobot } from "react-icons/fa";

const Bot = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- Modal States ----------------
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateData, setUpdateData] = useState({ name: "", description: "" });

  // ---------------- Fetch Bot ----------------
  const fetchBot = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/bot/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch bot");

      const data = await res.json();
      setBot(data.bot);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBot();
  }, [id]);

  const getStatusColor = (status) => {
    if (status === "active") return "rgba(0, 128, 0, 0.3)";
    if (status === "inactive") return "rgba(255, 0, 0, 0.3)";
    return "rgba(128,128,128,0.3)";
  };

  // ---------------- UPDATE STATUS ----------------
  const handleStatusChange = async () => {
    if (!newStatus) return toast.error("Select a status");

    setStatusLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/bot/toggle-status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Bot status updated");
        setShowStatusModal(false);
        fetchBot();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  // ---------------- DELETE BOT ----------------
  const handleDeleteBot = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/bot/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Bot deleted successfully");
        navigate("/bots");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---------------- UPDATE BOT ----------------
  const handleUpdateBot = async () => {
    if (!updateData.name || !updateData.description)
      return toast.error("All fields are required");

    setUpdateLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/bot/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Bot updated successfully");
        setShowUpdateModal(false);
        fetchBot();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p>Loading bot...</p>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="spinner-wrapper">
        <p>Bot not found</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>

        <div className="user-card">
          <div className="bot-icon-container" style={{ height: "200px" }}>
            <FaRobot size={40} className="bot-icon" />
          </div>
          <div className="user-card-header">
            <h2>{bot.name}</h2>
          </div>

          <div className="user-card-body">
            <div className="user-info">
              <span>Description:</span>
              <span>{bot.description}</span>
            </div>

            <div className="user-info">
              <span>Price:</span>
              <span>
                $
                {bot.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="user-info">
              <span>Daily Return:</span>
              <span>{bot.dailyReturnPercent}%</span>
            </div>

            <div className="user-info">
              <span>Duration:</span>
              <span>{bot.durationDays} days</span>
            </div>

            <div className="user-info">
              <span>Max Return:</span>
              <span>{bot.maxReturnPercent}%</span>
            </div>

            <div className="user-info">
              <span>Status:</span>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "10px",
                  color: "white",
                  display: "inline",
                  backgroundColor: getStatusColor(bot.status),
                }}
              >
                {bot.status.toUpperCase()}
              </span>
            </div>

            <div className="user-info">
              <span>Created:</span>
              <span>
                {new Date(bot.createdAt).toLocaleDateString("en-GB", {
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
              style={{ marginRight: "10px" }}
              onClick={() => {
                setUpdateData({ name: bot.name, description: bot.description });
                setShowUpdateModal(true);
              }}
            >
              UPDATE BOT
            </button>

            <button
              className="action-btn update-btn"
              style={{ marginRight: "10px" }}
              onClick={() => {
                setNewStatus(bot.status);
                setShowStatusModal(true);
              }}
            >
              UPDATE STATUS
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

      {/* ---------------- UPDATE BOT MODAL ---------------- */}
      {showUpdateModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Update Bot</h3>

            <input
              type="text"
              name="name"
              placeholder="Bot Name"
              value={updateData.name}
              onChange={handleUpdateChange}
            />

            <textarea
              name="description"
              placeholder="Bot Description"
              value={updateData.description}
              onChange={handleUpdateChange}
            />

            <div className="modal-actions">
              <button onClick={handleUpdateBot} disabled={updateLoading}>
                {updateLoading ? "Updating..." : "Update"}
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

      {/* ---------------- STATUS MODAL ---------------- */}
      {showStatusModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Change Bot Status</h3>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleStatusChange} disabled={statusLoading}>
                {statusLoading ? "Updating..." : "Update"}
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={statusLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- DELETE MODAL ---------------- */}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Are you sure?</h3>
            <p>This action cannot be undone.</p>

            <div className="modal-actions">
              <button onClick={handleDeleteBot} disabled={deleteLoading}>
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

export default Bot;
