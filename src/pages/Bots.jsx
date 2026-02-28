import { useState, useEffect } from "react";
import { FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BASE_URL } from "../data";
import "../App.css";

const Bots = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Fetch all bots
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/admin/all-bots`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setBots(data.bots || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBots();
  }, []);

  // Filter bots based on search
  const filteredBots = bots.filter((bot) =>
    [
      bot.name || "",
      bot.status || "",
      bot.price !== undefined ? bot.price.toString() : "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredBots.length / transactionsPerPage);
  const indexOfLastBot = currentPage * transactionsPerPage;
  const indexOfFirstBot = indexOfLastBot - transactionsPerPage;
  const currentBots = filteredBots.slice(indexOfFirstBot, indexOfLastBot);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // reset to first page on search
  };

  const goToPage = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    else if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status) => {
    if (status === "active") return "rgba(0, 128, 0, 0.3)";
    if (status === "inactive") return "rgba(255, 0, 0, 0.3)";
    return "rgba(128, 128, 128, 0.3)";
  };

  if (loading)
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p>Loading bots...</p>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="admin-bot" style={{ marginBottom: "20px" }}>
          <h2>Available Bots</h2>
          <Link to="/create-bot" id="btn" className="btn btn-primary">
            CREATE BOT 🤖
          </Link>
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search by name, price or status..."
          value={search}
          onChange={handleSearch}
          style={{
            marginBottom: "15px",
            padding: "8px",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid rgba(255,255,255,0.3)",
            backgroundColor: "transparent",
            color: "white",
          }}
        />

        {/* Count display */}
        <p style={{ marginBottom: "10px" }}>
          Showing {filteredBots.length === 0 ? 0 : indexOfFirstBot + 1}-
          {Math.min(indexOfLastBot, filteredBots.length)} of{" "}
          {filteredBots.length} bots
        </p>

        {/* Bots Grid */}
        {currentBots.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              padding: "20px",
            }}
          >
            No bots found
          </p>
        ) : (
          <div className="bot-grid">
            {currentBots.map((bot) => (
              <div
                key={bot._id}
                className="bot-card"
                style={{ position: "relative" }}
              >
                {/* Status badge */}
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    padding: "4px 10px",
                    borderRadius: "10px",
                    backgroundColor: getStatusColor(bot.status),
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                  }}
                >
                  {bot.status.toUpperCase()}
                </span>

                <div className="bot-icon-container">
                  <FaRobot size={40} className="bot-icon" />
                </div>

                <div className="bot-info">
                  <h3>{bot.name}</h3>
                  <p>
                    {bot.description.length > 25
                      ? bot.description.substring(0, 25) + "..."
                      : bot.description}
                  </p>
                  <p>
                    <strong>Price:</strong> ${bot.price}
                  </p>

                  <Link
                    to={`/bot/${bot._id}`}
                    className="btn btn-primary"
                    id="bot-btn"
                  >
                    VIEW BOT
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              style={{
                padding: "10px",
                borderRadius: "5px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              First
            </button>

            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "10px",
                borderRadius: "5px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "10px",
                borderRadius: "5px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>

            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                padding: "10px",
                borderRadius: "5px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Last
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Bots;
