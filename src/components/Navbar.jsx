import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTachometerAlt,
  FaExchangeAlt,
  FaRobot,
  FaHome,
  FaInfoCircle,
  FaQuestionCircle,
  FaUserPlus,
  FaSignInAlt,
  FaUser,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { HashLink as Link } from "react-router-hash-link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout Successful!");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Logo" width="150px" />
      </Link>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        {/* Always visible links */}
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <FaHome style={{ marginRight: 5 }} /> Home
        </Link>
        <Link
          to="/#about"
          onClick={() => setMenuOpen(false)}
          smooth
          scroll={(el) =>
            el.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          <FaInfoCircle style={{ marginRight: 5 }} /> About
        </Link>
        <Link
          to="/#faq"
          onClick={() => setMenuOpen(false)}
          smooth
          scroll={(el) =>
            el.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          <FaQuestionCircle style={{ marginRight: 5 }} /> FAQ
        </Link>

        {/* Unauthenticated links */}
        {!isAuthenticated && (
          <>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              <FaUserPlus style={{ marginRight: 5 }} /> Register
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              id="logout-btn"
              style={{ color: "#0F172A" }}
            >
              <FaSignInAlt style={{ marginRight: 5 }} /> Login
            </Link>
          </>
        )}

        {/* Authenticated links */}
        {isAuthenticated && (
          <>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
              <FaTachometerAlt style={{ marginRight: 5 }} /> Dashboard
            </Link>
            <Link to="/transactions" onClick={() => setMenuOpen(false)}>
              <FaExchangeAlt style={{ marginRight: 5 }} /> Transactions
            </Link>
            <Link to="/bots" onClick={() => setMenuOpen(false)}>
              <FaRobot style={{ marginRight: 5 }} /> Bots
            </Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              <FaUser style={{ marginRight: 5 }} /> Profile
            </Link>

            <button
              onClick={handleLogout}
              className="logout-btn"
              style={{ color: "#0F172A" }}
            >
              <FaSignOutAlt style={{ marginRight: 5 }} /> Logout
            </button>
          </>
        )}
      </div>

      <div className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
