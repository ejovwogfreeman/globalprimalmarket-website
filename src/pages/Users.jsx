import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BASE_URL } from "../data";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/all-users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value),
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // reset to first page
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Pagination functions
  const goToPage = (page) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>All Users</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email..."
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

        {/* Count Display */}
        <p style={{ marginBottom: "10px" }}>
          Showing {filteredUsers.length === 0 ? 0 : indexOfFirstUser + 1}-
          {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
        </p>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Date Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td data-label="S/N">{indexOfFirstUser + index + 1}</td>
                    <td data-label="Full Name">{user.fullName}</td>
                    <td data-label="Username">{user.userName}</td>
                    <td data-label="Email">{user.email}</td>

                    {/* Role Badge */}
                    <td data-label="Role">
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "20px",
                          color: "white",
                          backgroundColor:
                            user.role === "admin"
                              ? "rgba(0, 128, 0, 0.3)"
                              : "rgba(0, 123, 255, 0.3)",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Verified Badge */}
                    <td data-label="Verified">
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "20px",
                          color: "white",
                          backgroundColor: user.isVerified
                            ? "rgba(0, 128, 0, 0.3)"
                            : "rgba(255, 0, 0, 0.3)",
                        }}
                      >
                        {user.isVerified ? "Yes" : "No"}
                      </span>
                    </td>

                    <td data-label="Date Joined">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td data-label="Action">
                      <Link className="view-btn" to={`/user/${user._id}`}>
                        View User
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {filteredUsers.length > usersPerPage && (
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

export default Users;
