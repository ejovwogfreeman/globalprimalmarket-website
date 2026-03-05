import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BASE_URL } from "../data";

const CRYPTOS = {
  btc: { name: "Bitcoin", symbol: "BTC" },
  eth: { name: "Ethereum", symbol: "ETH" },
  sol: { name: "Solana", symbol: "SOL" },
  trx: { name: "TRON", symbol: "TRX" },
  bnb: { name: "BNB Smart Chain", symbol: "BNB" },
  xrp: { name: "Ripple", symbol: "XRP" },
};

export default function Withdraw() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const initialMethod = state.method || "btc";

  const [method, setMethod] = useState(initialMethod);
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);

  const crypto = CRYPTOS[method];

  const submitWithdraw = async (e) => {
    e.preventDefault();

    if (!amount || !wallet) {
      toast.error("Please enter amount and wallet address");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        amount: Number(amount),
        mode: method,
        wallet,
      };

      const response = await fetch(`${BASE_URL}/transactions/withdrawal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Withdrawal failed");
        return;
      }

      toast.success(
        data.message || "Withdrawal request submitted successfully",
      );

      setAmount("");
      setWallet("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Withdrawal error:", err);
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

      <form onSubmit={submitWithdraw}>
        <h2 style={{ color: "#f8fafc", marginBottom: "20px" }}>
          Withdraw {crypto.name}
        </h2>
        {/* Method */}
        <label
          style={{ color: "#94a3b8", marginBottom: "6px", display: "block" }}
        >
          Select Method
        </label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            marginBottom: "12px",
          }}
        >
          {Object.entries(CRYPTOS).map(([key, c]) => (
            <option key={key} value={key}>
              {c.name} ({c.symbol})
            </option>
          ))}
        </select>
        {/* Amount */}
        <label
          style={{ color: "#94a3b8", marginBottom: "6px", display: "block" }}
        >
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            marginBottom: "12px",
          }}
        />
        {/* Wallet Address */}
        <label
          style={{ color: "#94a3b8", marginBottom: "6px", display: "block" }}
        >
          Wallet Address
        </label>
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder={`Enter ${crypto.symbol} wallet address`}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            marginBottom: "12px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#38bdf8",
            color: "#020617",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit Withdrawal"}
        </button>
      </form>

      <Footer />
    </div>
  );
}
