import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { BASE_URL } from "../data";
import { FaRobot } from "react-icons/fa";
import { CRYPTO_MODES } from "../data";

const Bot = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState("");
  const [proofs, setProofs] = useState([]);
  const [proofPreviews, setProofPreviews] = useState([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

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
      toast.error("Failed to load bot");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBot();
  }, [id]);

  // ---------------- Conversion ----------------
  const selectedCrypto = CRYPTO_MODES.find((m) => m.symbol === selectedMode);

  const selectedConversion =
    selectedCrypto && bot ? (bot.price / selectedCrypto.rate).toFixed(6) : 0;

  // ---------------- Handle File Upload ----------------
  const handleSelectProofs = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setProofs(files);
    setProofPreviews(previewUrls);
  };

  // ---------------- Purchase Bot ----------------
  const handlePurchase = async () => {
    if (!selectedMode) return toast.error("Select payment mode");
    if (proofs.length === 0) return toast.error("Upload payment proof");

    const formData = new FormData();
    formData.append("amount", selectedConversion.toString());
    formData.append("mode", selectedMode);
    formData.append("botName", bot.name);
    formData.append("dailyReturnPercent", bot.dailyReturnPercent);
    formData.append("durationDays", bot.durationDays);
    formData.append("maxReturnPercent", bot.maxReturnPercent);

    proofs.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setPurchaseLoading(true);

      const res = await fetch(`${BASE_URL}/bots/purchase`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Purchase successful!");
        setShowPurchaseModal(false);
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Purchase failed");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setPurchaseLoading(false);
    }
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
              <span>${bot.price}</span>
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
          </div>

          <div className="user-card-actions">
            <button
              className="action-btn update-btn"
              onClick={() => setShowPurchaseModal(true)}
            >
              PURCHASE BOT 🤖
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- PURCHASE MODAL ---------------- */}
      {showPurchaseModal && (
        <div className="modal-backdrop">
          <div className="modal" id="purchase-modal">
            <h3>Purchase {bot.name}</h3>

            <label>Bot Price</label>
            <input
              type="text"
              value={`$${bot.price}`}
              disabled
              style={{ marginBottom: "15px" }}
            />

            <label>Select Payment Mode</label>

            <div
              style={{
                display: "flex",
                overflowX: "auto",
                marginBottom: "15px",
              }}
            >
              {CRYPTO_MODES.map((mode) => (
                <button
                  key={mode.symbol}
                  type="button"
                  onClick={() => setSelectedMode(mode.symbol)}
                  style={{
                    padding: "8px 12px",
                    marginRight: "8px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor:
                      selectedMode === mode.symbol ? "#38bdf8" : "#1f2937",
                    color: selectedMode === mode.symbol ? "#020617" : "#f8fafc",
                    fontWeight: "700",
                  }}
                >
                  {mode.symbol.toUpperCase()}
                </button>
              ))}
            </div>

            {selectedMode && (
              <p
                style={{
                  color: "#38bdf8",
                  fontWeight: "600",
                }}
              >
                ≈ {selectedConversion} {selectedMode.toUpperCase()}
              </p>
            )}

            <label>Upload Proof</label>
            <input
              type="file"
              multiple
              onChange={handleSelectProofs}
              style={{ marginBottom: "15px" }}
            />

            {proofPreviews.map((uri, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                <img
                  src={uri}
                  alt="proof"
                  style={{
                    width: "100%",
                    height: "150px",
                    borderRadius: "12px",
                    border: "1px solid #38bdf8",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={handlePurchase}
                disabled={purchaseLoading}
                className="btn update-btn"
              >
                {purchaseLoading ? "Processing..." : "Confirm"}
              </button>

              <button
                onClick={() => setShowPurchaseModal(false)}
                className="btn delete-btn"
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
