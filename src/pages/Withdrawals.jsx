import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { BASE_URL } from "../data";

const Withdrawals = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Fetch transactions
  // After fetching transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/admin/all-transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const data = await res.json();

        // Only deposits
        const deposits = data.transactions.filter(
          (tx) => tx.type.toLowerCase() === "withdrawal",
        );

        setTransactions(deposits);
        setFilteredTransactions(deposits);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Handle search (email, type, status)
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = transactions.filter(
      (tx) =>
        tx.user.email.toLowerCase().includes(value) ||
        tx.type.toLowerCase().includes(value) ||
        tx.status.toLowerCase().includes(value),
    );

    setFilteredTransactions(filtered);
    setCurrentPage(1); // reset page
  };

  // Pagination
  const indexOfLastTx = currentPage * transactionsPerPage;
  const indexOfFirstTx = indexOfLastTx - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTx,
    indexOfLastTx,
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage,
  );

  const goToPage = (page) => setCurrentPage(page);

  // Badge colors
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "rgba(255, 193, 7, 0.3)";
      case "approved":
        return "rgba(0, 128, 0, 0.3)";
      case "declined":
        return "rgba(255, 0, 0, 0.3)";
      default:
        return "rgba(0, 123, 255, 0.3)";
    }
  };

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

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p>Loading withdrawals...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>All Withdrawals</h2>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search by email, type, or status..."
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
          Showing {filteredTransactions.length === 0 ? 0 : indexOfFirstTx + 1}-
          {Math.min(indexOfLastTx, filteredTransactions.length)} of{" "}
          {filteredTransactions.length} withdrawals
        </p>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>User Email</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                currentTransactions.map((tx, index) => (
                  <tr key={tx._id}>
                    <td data-label="S/N">{indexOfFirstTx + index + 1}</td>
                    <td data-label="User Email">{tx.user.email}</td>
                    <td data-label="Amount">
                      {Number(tx.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: "0.75em",
                          opacity: 0.7,
                          fontWeight: 500,
                        }}
                      >
                        {tx.mode?.toUpperCase()}
                      </span>
                    </td>
                    <td data-label="Type">
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "10px",
                          color: "white",
                          backgroundColor: getTypeColor(tx.type),
                        }}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "10px",
                          color: "white",
                          backgroundColor: getStatusColor(tx.status),
                        }}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td data-label="Date">
                      {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td data-label="Action">
                      <Link className="view-btn" to={`/transaction/${tx._id}`}>
                        View Transaction
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination - First/Prev/Next/Last */}
        {filteredTransactions.length > transactionsPerPage && (
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

export default Withdrawals;
