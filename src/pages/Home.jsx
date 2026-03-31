import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  IoTrendingUpOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoWalletOutline,
  IoBarChartOutline,
} from "react-icons/io5";
import "../css/Home.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Trade Crypto Like a Pro",
      text: "Secure. Fast. Reliable.",
      image: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg", // reliable
    },
    {
      title: "Grow Your Digital Assets",
      text: "Smart investment strategies that work.",
      image:
        "https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg", // reliable
    },
    {
      title: "Real-Time Market Data",
      text: "Track the top cryptocurrencies instantly.",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600", // reliable
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false",
        );
        const data = await res.json();
        setMarket(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, []);

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    }).format(num);

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <>
      <Navbar />

      {/* ================= HERO CAROUSEL ================= */}
      <section className="hero">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`heroSlide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="overlay">
              <h1>{slide.title}</h1>
              <p>{slide.text}</p>
              <Link
                to="/login"
                className="btn"
                style={{ textDecoration: "none" }}
              >
                Get Started
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ================= ABOUT ================= */}
      <section className="about" id="about">
        <h2>About Us</h2>
        <p>
          We provide a secure and intelligent crypto investment platform built
          for both beginners and professionals. Real-time data, automated
          trading tools, and advanced portfolio management in one place.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features" id="services">
        <div className="feature">
          <IoTrendingUpOutline size={40} />
          <h3>High Performance</h3>
          <p>Advanced trading infrastructure for maximum efficiency.</p>
        </div>
        <div className="feature">
          <IoShieldCheckmarkOutline size={40} />
          <h3>Secure Assets</h3>
          <p>Multi-layer encryption & cold storage protection.</p>
        </div>
        <div className="feature">
          <IoFlashOutline size={40} />
          <h3>Instant Execution</h3>
          <p>Fast deposits and withdrawals anytime.</p>
        </div>
        <div className="feature">
          <IoWalletOutline size={40} />
          <h3>Smart Wallet</h3>
          <p>Manage multiple coins in one secure wallet.</p>
        </div>
        <div className="feature">
          <IoBarChartOutline size={40} />
          <h3>Analytics</h3>
          <p>Track performance and market trends with ease.</p>
        </div>
      </section>

      {/* ================= LIVE MARKET ================= */}
      <section className="marketSection" id="market">
        <div className="live-market-crypto">
          <h2>Live Market Prices</h2>
          <Link to="/crypto">View All Crypto</Link>
        </div>
        {loading ? (
          <p className="loading">Loading market data...</p>
        ) : (
          <div className="marketList">
            {market.map((coin) => (
              <div key={coin.id} className="marketRow">
                <div className="left">
                  <img src={coin.image} alt={coin.name} />
                  <div>
                    <strong>{coin.name}</strong>
                    <span>{coin.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <div className="right">
                  <strong>${formatCurrency(coin.current_price)}</strong>
                  <span
                    className={
                      coin.price_change_percentage_24h < 0 ? "red" : "green"
                    }
                  >
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="howItWorks">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Create Account</h3>
            <p>Sign up and verify your identity quickly.</p>
          </div>
          <div className="step">
            <h3>2. Deposit Funds</h3>
            <p>Add funds to your account securely.</p>
          </div>
          <div className="step">
            <h3>3. Trade & Invest</h3>
            <p>Buy, sell, and grow your portfolio in real-time.</p>
          </div>
          <div className="step">
            <h3>4. Withdraw Anytime</h3>
            <p>Fast withdrawals to your bank or crypto wallet.</p>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="testimonials">
        <h2>Trusted by Investors Worldwide</h2>
        <div className="testimonialGrid">
          <div className="testimonialCard">
            <p>"This platform completely transformed my crypto portfolio."</p>
            <strong>- Daniel K.</strong>
          </div>
          <div className="testimonialCard">
            <p>"Professional interface and reliable profits."</p>
            <strong>- Sarah M.</strong>
          </div>
          <div className="testimonialCard">
            <p>"Best investment decision I’ve made."</p>
            <strong>- James T.</strong>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta">
        <h2>Start Investing Today</h2>
        <p>Join thousands of traders growing their wealth daily.</p>
        <button onClick={handleClick}>
          {isAuthenticated ? "Visit Dashboard" : "Create Free Account"}
        </button>
      </section>

      {/* ================= FAQ ================= */}
      <section className="faq" id="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faqItem">
          <h4>Is my money safe?</h4>
          <p>
            Yes. We use industry-standard security protocols including cold
            storage.
          </p>
        </div>
        <div className="faqItem">
          <h4>Can beginners trade?</h4>
          <p>
            Absolutely. Our platform is built for both beginners and experts.
          </p>
        </div>
        <div className="faqItem">
          <h4>How fast are withdrawals?</h4>
          <p>
            Most withdrawals are processed instantly or within a few minutes.
          </p>
        </div>
      </section>

      {/* ================= CONTACT ================= */}

      <section className="contact" id="contact">
        <h2>Contact Us</h2>

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

          {/* Contact Image */}
          <div className="contactImage">
            <img
              src="https://images.pexels.com/photos/7709257/pexels-photo-7709257.jpeg"
              alt="Customer Support Team"
            />
          </div>
        </div>

        {/* Embedded Map */}
        <div className="contactMap">
          <iframe
            title="company-location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086367258791!2d-122.4194150846814!3d37.7749292797591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c7b78e21b%3A0x1c0c47f5e4e4b4a8!2s123%20Blockchain%20Ave%2C%20San%20Francisco%2C%20CA%2094103!5e0!3m2!1sen!2sus!4v1679500000000!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <Footer />
    </>
  );
}
