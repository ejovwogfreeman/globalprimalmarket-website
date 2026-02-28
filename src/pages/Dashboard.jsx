import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaExchangeAlt,
  FaMoneyBillWave,
  FaWallet,
  FaArrowDown,
  FaRobot,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { BASE_URL } from "../data";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch logged-in user info
        const profileRes = await fetch(`${BASE_URL}/user/me`, { headers });
        const profileData = await profileRes.json();
        console.log(profileData);
        if (profileData.user?.userName) {
          setUserName(profileData.user.userName);
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
    (t) => t.type.toLowerCase() === "deposit",
  );
  const investments = transactions.filter(
    (t) => t.type.toLowerCase() === "investment",
  );
  const withdrawals = transactions.filter(
    (t) => t.type.toLowerCase() === "withdrawal",
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
          <Link to="/create-bot" id="btn" className="btn btn-primary">
            CREATE BOT 🤖
          </Link>
        </div>

        <div style={{ color: "#fff", marginBottom: "30px" }}>
          <p style={{ marginBottom: "5px" }}>
            Welcome back, {userName || "User"} 👋
          </p>
          <p style={{ marginBottom: "5px" }}>
            Current Date & Time: {formattedDateTime}
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Transactions Card */}
          <div className="dashboard-card">
            <FaExchangeAlt className="card-icon" />
            <h3>Transactions</h3>
            <p>Total: {transactions.length}</p>
            <Link className="view-btn" to="/transactions">
              View Transactions
            </Link>
          </div>

          {/* Deposits Card */}
          <div className="dashboard-card">
            <FaMoneyBillWave className="card-icon" />
            <h3>Deposits</h3>
            <p>Total: {deposits.length}</p>
            <Link className="view-btn" to="/deposits">
              View Deposits
            </Link>
          </div>

          {/* Investments Card */}
          <div className="dashboard-card">
            <FaWallet className="card-icon" />
            <h3>Investments</h3>
            <p>Total: {investments.length}</p>
            <Link className="view-btn" to="/investments">
              View Investments
            </Link>
          </div>

          {/* Withdrawals Card */}
          <div className="dashboard-card">
            <FaArrowDown className="card-icon" />
            <h3>Withdrawals</h3>
            <p>Total: {withdrawals.length}</p>
            <Link className="view-btn" to="/withdrawals">
              View Withdrawals
            </Link>
          </div>

          {/* Bots Card */}
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
