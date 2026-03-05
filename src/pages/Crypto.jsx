import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Home.css";
import { Link } from "react-router-dom";

export default function Crypto() {
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
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
        );
        const data = await res.json();
        console.log(data);
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

  return (
    <div className="crypto-container" style={{ marginTop: "30px" }}>
      <Navbar />

      {/* ================= LIVE MARKET ================= */}
      <section className="marketSection" style={{ paddingBottom: "50px" }}>
        {/* Back Button */}
        <Link className="back-btn" to="/" style={{ marginBottom: "20px" }}>
          &larr; Back to Home
        </Link>
        <div className="live-market-crypto">
          <h2>Live Market Prices</h2>
        </div>
        {loading ? (
          <p className="loading">Loading market data...</p>
        ) : (
          <div className="marketList">
            {market.map((coin) => (
              <Link
                to={`/crypto/${coin.id}`}
                key={coin.id}
                className="marketRow"
              >
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
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
