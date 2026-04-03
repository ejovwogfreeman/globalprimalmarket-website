// import { FaTwitter, FaLinkedin, FaTelegramPlane } from "react-icons/fa";
import "../css/Footer.css";
import { HashLink as Link } from "react-router-hash-link";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRobot,
} from "react-icons/fa";

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
          <a
            href="https://app.globatrixprime/download/globatrixprime.apk" // replace with your real APK link
            download
            className="btn"
            style={{
              display: "inline-block",
              textDecoration: "none",
              marginTop: "20px",
            }}
          >
            <FaRobot style={{ marginRight: "10px", marginBottom: "-3px" }} />
            Download Mobile App (APK)
          </a>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link
                to="/#about"
                smooth
                scroll={(el) =>
                  // Wait a tick to ensure element exists
                  setTimeout(
                    () =>
                      el.scrollIntoView({ behavior: "smooth", block: "start" }),
                    50,
                  )
                }
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/#services"
                smooth
                scroll={(el) =>
                  // Wait a tick to ensure element exists
                  setTimeout(
                    () =>
                      el.scrollIntoView({ behavior: "smooth", block: "start" }),
                    50,
                  )
                }
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/#market"
                smooth
                scroll={(el) =>
                  // Wait a tick to ensure element exists
                  setTimeout(
                    () =>
                      el.scrollIntoView({ behavior: "smooth", block: "start" }),
                    50,
                  )
                }
              >
                Market
              </Link>
            </li>
            <li>
              <Link
                to="/#contact"
                smooth
                scroll={(el) =>
                  // Wait a tick to ensure element exists
                  setTimeout(
                    () =>
                      el.scrollIntoView({ behavior: "smooth", block: "start" }),
                    50,
                  )
                }
              >
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        {/* <div className="footer-section">
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
        </div> */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <div className="contactContainer">
            {/* Contact Info */}
            <div className="contactInfo">
              <p>
                <FaEnvelope className="icon" /> <strong>Email:</strong>
                &nbsp;support@globatrixprime.com
              </p>
              <p>
                <FaPhoneAlt className="icon" /> <strong>Phone:</strong>&nbsp;+1
                904 310 2851
              </p>
              <p>
                <FaMapMarkerAlt className="icon" /> <strong>Address:</strong>
                &nbsp;2441 Old Cypress Creek Rd
              </p>
            </div>
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
