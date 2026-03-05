import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaRegCopy } from "react-icons/fa";
import QRCode from "react-qr-code";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BASE_URL } from "../data";
import { toast } from "react-toastify";
import btcimg from "../assets/bitcoin.png";
import ethimg from "../assets/ethereum.png";
import solimg from "../assets/solana.png";
import trximg from "../assets/tron.png";
import bnbimg from "../assets/bnb.png";
import xrpimg from "../assets/xrp.png";

const CRYPTOS = {
  btc: {
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1q6g4uk97f6yu9g0zlawrt9mjwvp0f6rj9ss9g75",
    image: btcimg,
  },
  eth: {
    name: "Ethereum",
    symbol: "ETH",
    address: "0x5875934caC54c7fe01cd5Fc4103736C8179d6D9D",
    image: ethimg,
  },
  sol: {
    name: "Solana",
    symbol: "SOL",
    address: "8iTXF6XXofB8wxzXMRWSsn6MjMRTtQjBsBQG747SD1aD",
    image: solimg,
  },
  trx: {
    name: "TRON",
    symbol: "TRX",
    address: "TMCBnpeFyAJviB25myRJ9zy52AN9s77hwd",
    image: trximg,
  },
  bnb: {
    name: "BNB Smart Chain",
    symbol: "BNB",
    address: "0x5875934caC54c7fe01cd5Fc4103736C8179d6D9D",
    image: bnbimg,
  },
  xrp: {
    name: "Ripple",
    symbol: "XRP",
    address: "rBFaf9z8DapfUbgnaXBAaUnwe5FfH4kUXz",
    image: xrpimg,
  },
};

const DepositFunds = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMethod = searchParams.get("method") || "btc";

  const [method, setMethod] = useState(initialMethod);
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const crypto = CRYPTOS[method];

  /* ---------------- COPY ADDRESS ---------------- */
  const handleCopy = () => {
    navigator.clipboard.writeText(crypto.address);
    toast.success("Address copied to clipboard");
  };

  /* ---------------- HANDLE FILE ---------------- */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG and WEBP files are allowed");
      return;
    }

    setProof(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------------- SUBMIT ---------------- */
  const submitDeposit = async (e) => {
    e.preventDefault();

    if (!amount || !proof) {
      toast.error("Please enter amount and upload proof");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("mode", method);
      formData.append("images", proof);

      const response = await fetch(`${BASE_URL}/transactions/deposit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Deposit failed");
        return;
      }

      toast.success(data.message || "Deposit submitted successfully");

      setAmount("");
      setProof(null);
      setPreview(null);

      navigate("/dashboard");
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        paddingTop: "150px",
      }}
    >
      <Navbar />

      <div
        className="form-container"
        style={{ marginBottom: "70px", height: "auto" }}
      >
        <form onSubmit={submitDeposit}>
          <h2>Deposit {crypto.name}</h2>

          {/* Wallet Card */}
          <div className="wallet-card">
            <img src={crypto.image} alt={crypto.name} width={50} />

            <div className="address-row">
              <p className="wallet-address">{crypto.address}</p>

              <FaRegCopy
                className="copy-icon"
                onClick={handleCopy}
                title="Copy address"
              />
            </div>

            <div className="qr-box">
              <QRCode value={crypto.address} size={150} />
            </div>
          </div>

          <label>Select Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {Object.entries(CRYPTOS).map(([key, c]) => (
              <option key={key} value={key}>
                {c.name} ({c.symbol})
              </option>
            ))}
          </select>

          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>Payment Proof</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          {preview && (
            <img
              src={preview}
              alt="proof"
              style={{
                width: "100%",
                maxHeight: "250px",
                objectFit: "contain",
                background: "#020617",
                marginTop: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            />
          )}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Loading..." : "Submit Deposit"}
          </button>
        </form>
      </div>

      <Footer />

      {/* Internal Styling */}
      <style>{`
        .wallet-card {
          background: #0f172a;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          text-align: center;
        }

        .address-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin: 10px 0 20px 0;
        }

        .wallet-address {
          color: #94a3b8;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .copy-icon {
          color: #38bdf8;
          cursor: pointer;
          font-size: 18px;
          transition: 0.2s;
        }

        .copy-icon:hover {
          color: #0ea5e9;
          transform: scale(1.1);
        }

        .qr-box {
          background: #ffffff;
          padding: 12px;
          border-radius: 12px;
          display: inline-block;
        }

       
      `}</style>
    </div>
  );
};

export default DepositFunds;
