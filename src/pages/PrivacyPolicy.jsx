import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <section className="privacy">
        <div className="container">
          {/* Back Link */}
          <Link
            to="/"
            className="btn"
            style={{
              marginTop: "50px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            ← Back to Home
          </Link>

          <h1 style={{ color: "#38bdf8" }}>Privacy Policy</h1>
          <p className="lastUpdated">Last Updated: April 2026</p>

          <p>
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, and protect your information when you use our
            platform.
          </p>

          <h2 style={{ color: "#38bdf8" }}>1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>Personal details (name, email address, phone number)</li>
            <li>Account credentials</li>
            <li>Transaction and investment data</li>
            <li>Device and browser information</li>
          </ul>

          <h2 style={{ color: "#38bdf8" }}>2. How We Use Your Information</h2>
          <p>Your information is used to:</p>
          <ul>
            <li>Create and manage your account</li>
            <li>Process transactions securely</li>
            <li>Provide customer support</li>
            <li>Improve our platform and services</li>
            <li>Send important updates and notifications</li>
          </ul>

          <h2 style={{ color: "#38bdf8" }}>3. Data Protection</h2>
          <p>
            We implement industry-standard security measures, including
            encryption and secure servers, to protect your personal data from
            unauthorized access, loss, or misuse.
          </p>

          <h2 style={{ color: "#38bdf8" }}>4. Sharing of Information</h2>
          <p>
            We do not sell or rent your personal information. We may share data
            with trusted partners only when necessary to:
          </p>
          <ul>
            <li>Provide our services</li>
            <li>Comply with legal obligations</li>
            <li>Prevent fraud and security threats</li>
          </ul>

          <h2 style={{ color: "#38bdf8" }}>5. Cookies</h2>
          <p>
            Our platform uses cookies to enhance user experience, analyze
            traffic, and improve functionality. You can disable cookies in your
            browser settings.
          </p>

          <h2 style={{ color: "#38bdf8" }}>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction or deletion</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2 style={{ color: "#38bdf8" }}>7. Third-Party Services</h2>
          <p>
            We may use third-party services (such as payment processors and
            analytics tools) that have their own privacy policies.
          </p>

          <h2 style={{ color: "#38bdf8" }}>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated date.
          </p>

          <h2 style={{ color: "#38bdf8" }}>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
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
      </section>

      <Footer />
    </>
  );
}
