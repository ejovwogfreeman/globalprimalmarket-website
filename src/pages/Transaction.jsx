import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { BASE_URL } from "../data";

const Transaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------ Modal states ------------------
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTransaction = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/transaction/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setTransaction(data.transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p>Loading transaction...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="spinner-wrapper">
        <p>Transaction not found</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // ------------------ Helpers ------------------
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "deposit":
        return "rgba(0, 128, 0, 0.3)";
      case "investment":
        return "rgba(0, 123, 255, 0.3)";
      case "withdrawal":
        return "rgba(255, 0, 0, 0.3)";
      default:
        return "rgba(128,128,128,0.3)";
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "rgba(255, 193, 7, 0.3)";
      case "in progress":
        return "rgba(0, 123, 255, 0.3)";
      case "approved":
        return "rgba(0, 128, 0, 0.3)";
      case "declined":
      case "rejected":
        return "rgba(255, 0, 0, 0.3)";
      default:
        return "rgba(128,128,128,0.3)";
    }
  };

  // ------------------ Handlers ------------------
  const handleStatusChange = async () => {
    if (!newStatus) return toast.error("Please select a status");
    setStatusLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/transaction/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Status changed successfully");
        setShowStatusModal(false); // close modal
        setNewStatus(""); // reset selection
        await fetchTransaction();
      } else {
        console.error(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeleteTransaction = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/transaction/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Transaction deleted successfully");
        setShowDeleteModal(false);
        navigate("/transactions");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
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
            <h2>Transaction Detail</h2>
          </div>

          <div className="user-card-body">
            {transaction.proof?.[0] ? (
              <div className="user-info">
                <span>Proof:</span>
                <a href={transaction.proof[0]} target="_blank">
                  <img
                    src={transaction.proof[0]}
                    alt={transaction._id}
                    className="proof-image"
                  />
                </a>
              </div>
            ) : (
              ""
            )}

            <div className="user-info">
              <span>Transaction ID:</span> <span>{transaction._id}</span>
            </div>
            <div className="user-info">
              <span>User Email:</span> <span>{transaction.user.email}</span>
            </div>
            <div className="user-info">
              <span>Amount:</span>{" "}
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <span style={{ margin: "0px" }}>
                  {Number(transaction.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                </span>
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: "0.75em",
                    opacity: 0.7,
                    fontWeight: 500,
                  }}
                >
                  {transaction.mode?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="user-info">
              <span>Mode:</span>{" "}
              <span>{transaction.mode?.toUpperCase() || "N/A"}</span>
            </div>
            <div className="user-info">
              <span>Type:</span>{" "}
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "10px",
                  color: "white",
                  display: "inline",
                  backgroundColor: getTypeColor(transaction.type),
                }}
              >
                {transaction.type}
              </span>
            </div>
            <div className="user-info">
              <span>Status:</span>{" "}
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "10px",
                  color: "white",
                  display: "inline",
                  backgroundColor: getStatusColor(transaction.status),
                }}
              >
                {transaction.status}
              </span>
            </div>

            <div className="user-info">
              <span>Transaction Date:</span>{" "}
              <span>
                {new Date(transaction.createdAt).toLocaleDateString("en-GB", {
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
                setNewStatus(transaction.status); // ✅ set current transaction status as default
                setShowStatusModal(true); // open modal
              }}
            >
              UPDATE
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

      {/* ------------------ STATUS MODAL ------------------ */}
      {showStatusModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Change Transaction Status</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
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

      {/* ------------------ DELETE MODAL ------------------ */}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Are you sure?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={handleDeleteTransaction}
                disabled={deleteLoading}
              >
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

export default Transaction;
