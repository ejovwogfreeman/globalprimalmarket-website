import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaExchangeAlt,
  FaMoneyBillWave,
  FaWallet,
  FaArrowDown,
  FaRobot,
  FaChevronDown,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { BASE_URL } from "../data";
import { CRYPTO_MODES } from "../data";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCoin, setSelectedCoin] = useState("usdt");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch logged-in user info
        const profileRes = await fetch(`${BASE_URL}/user/me`, { headers });
        const profileData = await profileRes.json();

        if (profileData.user) {
          setUser(profileData.user);
          setUserName(profileData.user.userName || "");

          // Automatically select first available coin
          if (profileData.user.balance) {
            const coins = Object.keys(profileData.user.balance);
            if (coins.length > 0) {
              setSelectedCoin(coins[0]);
            }
          }
        }

        // Fetch transactions
        const transactionsRes = await fetch(
          `${BASE_URL}/admin/all-transactions`,
          { headers },
        );
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.transactions || []);

        // Fetch bots
        const botsRes = await fetch(`${BASE_URL}/admin/all-bots`, { headers });
        const botsData = await botsRes.json();
        setBots(botsData.bots || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Filter transactions by type
  const deposits = transactions.filter(
    (t) => t.type?.toLowerCase() === "deposit",
  );
  const investments = transactions.filter(
    (t) => t.type?.toLowerCase() === "investment",
  );
  const withdrawals = transactions.filter(
    (t) => t.type?.toLowerCase() === "withdrawal",
  );

  const currentTime = new Date();
  const formattedDateTime = currentTime.toLocaleString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div style={{ backgroundColor: "#1e293b", minHeight: "100vh" }}>
      <Navbar />

      <div className="container">
        <div className="admin-bot">
          <h2>Your Dashboard</h2>
          <Link to="/bots" id="btn" className="btn btn-primary">
            PURCHASE BOT 🤖
          </Link>
        </div>

        <div style={{ color: "#fff", marginBottom: "30px" }}>
          <p>Welcome back, {userName || "User"} 👋</p>
          <p>Current Date & Time: {formattedDateTime}</p>
        </div>

        {/* ✅ Balance Card */}
        {user?.balance && (
          <div className="balance-card">
            {/* HEADER */}
            <div
              className="balance-header"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <h3
                style={{
                  textTransform: "uppercase",
                  margin: 0,
                  color: "#38BDF8",
                }}
              >
                {selectedCoin === "usdt"
                  ? "Total Balance"
                  : `${selectedCoin} Balance`}
              </h3>

              <FaChevronDown
                style={{
                  transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.3s",
                }}
              />
            </div>

            {/* CALCULATIONS */}
            {(() => {
              const balances = user.balance || {};

              // Convert all to USDT
              const totalUSDT = Object.keys(balances).reduce((sum, coin) => {
                const crypto = CRYPTO_MODES.find((c) => c.symbol === coin);
                const amount = Number(balances[coin]) || 0;

                if (coin === "usdt") return sum + amount;
                if (!crypto) return sum;

                return sum + amount * crypto.rate;
              }, 0);

              // Selected coin value
              let displayAmount = 0;

              if (selectedCoin === "usdt") {
                displayAmount = totalUSDT;
              } else {
                displayAmount = Number(balances[selectedCoin]) || 0;
              }

              return (
                <>
                  {/* MAIN BALANCE */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h1 className="balance-amount">
                      {displayAmount.toLocaleString()}
                    </h1>
                    <h3
                      style={{
                        textTransform: "uppercase",
                        marginLeft: "5px",
                        color: "#757C86",
                      }}
                    >
                      {selectedCoin.toUpperCase()}
                    </h3>
                  </div>

                  {/* ALWAYS SHOW TOTAL USDT */}
                  <p
                    style={{
                      color: "#757C86",
                      margin: 0,
                      fontSize: "14px",
                    }}
                  >
                    ≈ {totalUSDT.toLocaleString()} USDT
                  </p>

                  {/* FOOTER */}
                  <p
                    style={{
                      textTransform: "uppercase",
                      color: "#757C86",
                      margin: "0px",
                      fontSize: "12px",
                    }}
                  >
                    Global Primal Wallet
                  </p>

                  {/* DROPDOWN */}
                  {showDropdown && (
                    <div className="balance-dropdown">
                      {/* ✅ USDT FIRST */}
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedCoin("usdt");
                          setShowDropdown(false);
                        }}
                      >
                        USDT (Total) — {totalUSDT.toLocaleString()} USDT
                      </div>

                      {/* OTHER COINS */}
                      {Object.keys(balances).map((coin) => {
                        const crypto = CRYPTO_MODES.find(
                          (c) => c.symbol === coin,
                        );

                        const amount = Number(balances[coin]) || 0;

                        const usdtValue =
                          coin === "usdt"
                            ? amount
                            : crypto
                              ? amount * crypto.rate
                              : 0;

                        return (
                          <div
                            key={coin}
                            className="dropdown-item"
                            onClick={() => {
                              setSelectedCoin(coin);
                              setShowDropdown(false);
                            }}
                          >
                            {coin.toUpperCase()} — {amount.toLocaleString()}{" "}
                            {coin.toUpperCase()}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <FaExchangeAlt className="card-icon" />
            <h3>Transactions</h3>
            <p>Total: {transactions.length}</p>
            <Link className="view-btn" to="/transactions">
              View Transactions
            </Link>
          </div>

          <div className="dashboard-card">
            <FaMoneyBillWave className="card-icon" />
            <h3>Deposits</h3>
            <p>Total: {deposits.length}</p>
            <Link className="view-btn" to="/deposits">
              View Deposits
            </Link>
          </div>

          <div className="dashboard-card">
            <FaWallet className="card-icon" />
            <h3>Investments</h3>
            <p>Total: {investments.length}</p>
            <Link className="view-btn" to="/investments">
              View Investments
            </Link>
          </div>

          <div className="dashboard-card">
            <FaArrowDown className="card-icon" />
            <h3>Withdrawals</h3>
            <p>Total: {withdrawals.length}</p>
            <Link className="view-btn" to="/withdrawals">
              View Withdrawals
            </Link>
          </div>

          <div className="dashboard-card">
            <FaRobot className="card-icon" />
            <h3>Bots</h3>
            <p>Total: {bots.length}</p>
            <Link className="view-btn" to="/bots">
              View Bots
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
