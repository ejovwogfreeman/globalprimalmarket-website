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

  const [countdown, setCountdown] = useState("Pending");

  const fetchTransaction = async () => {
    try {
      const res = await fetch(`${BASE_URL}/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setTransaction(data.transaction); // <-- fix here
    } catch (error) {
      console.error("Error fetching transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  // ------------------ Countdown logic ------------------
  useEffect(() => {
    if (transaction?.maturityDate) {
      const interval = setInterval(() => {
        const now = new Date();
        const maturity = new Date(transaction.maturityDate);
        const diff = maturity - now;

        if (diff <= 0) {
          setCountdown("Matured");
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          setCountdown(`${days}d ${hours}h ${minutes}m`);
        }
      }, 60000); // update every minute

      return () => clearInterval(interval);
    }
  }, [transaction]);

  const handleClaimBonus = async (transactionId) => {
    try {
      // Show a loading toast while processing
      const loadingToast = toast.info("Claiming bonus...", {
        autoClose: false,
      });

      const res = await fetch(
        `${BASE_URL}/transactions/${transactionId}/claim-bonus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();
      toast.dismiss(loadingToast); // remove loading toast

      if (res.ok && data.success) {
        toast.success(`Bonus claimed! Amount: ${data.bonus}`);
        // Optionally refresh user data here
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Failed to claim bonus");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while claiming bonus");
    }
  };

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

  const isInvestment =
    transaction?.type === "investment" || transaction?.type === "bot purchase";

  const durationDays = transaction?.durationDays ?? 60;

  const dailyReturnPercent =
    transaction?.dailyReturnPercent ?? Number((100 / durationDays).toFixed(3));

  const maxReturnPercent = transaction?.maxReturnPercent ?? 100;

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
            {transaction.proof?.[0] && (
              <div className="user-info">
                <span>Proof:</span>
                <a href={transaction.proof[0]} target="_blank" rel="noreferrer">
                  <img
                    src={transaction.proof[0]}
                    alt={transaction._id}
                    className="proof-image"
                  />
                </a>
              </div>
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
                <span>
                  {Number(transaction.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 5,
                    maximumFractionDigits: 5,
                  })}
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

          {/* ------------------ INVESTMENT DETAILS ------------------ */}
          {isInvestment && (
            <div style={{ textAlign: "left" }}>
              <div className="user-info">
                <span>
                  {transaction.type === "bot purchase" ? "Bot Name" : "Plan"}:
                </span>
                <span>{transaction.plan ?? "N/A"}</span>
              </div>

              <div className="user-info">
                <span>Daily Return (%):</span>
                <span>{dailyReturnPercent}%</span>
              </div>

              <div className="user-info">
                <span>Duration (Days):</span> <span>{durationDays} Days</span>
              </div>

              <div className="user-info">
                <span>Max Return (%):</span> <span>{maxReturnPercent}%</span>
              </div>

              <div className="user-info">
                <span>Countdown:</span> <span>{countdown}</span>
              </div>

              {countdown === "Matured" && (
                <button
                  style={{
                    padding: "12px 20px",
                    borderRadius: "10px",
                    backgroundColor: "#38bdf8",
                    color: "#020617",
                    fontWeight: "700",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={() => handleClaimBonus(transaction._id)}
                >
                  Claim Bonus
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Transaction;
