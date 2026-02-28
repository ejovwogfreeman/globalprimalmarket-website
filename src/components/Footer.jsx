import { FaTwitter, FaLinkedin, FaTelegramPlane } from "react-icons/fa";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* About / Info */}
        <div className="footer-section">
          <h3>Global Primal Market</h3>
          <p>
            Secure crypto trading platform. Grow your digital assets with smart
            investment tools and real-time market insights.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a href="http://localhost:5173/#about">About</a>
            </li>
            <li>
              <a href="http://localhost:5173/#services">Services</a>
            </li>
            <li>
              <a href="http://localhost:5173/#market">Market</a>
            </li>
            <li>
              <a href="http://localhost:5173/#contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="footer-social">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer">
              <FaTelegramPlane />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom / Copyright */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Global Primal Market. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
