import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Home.css"; // New CSS file
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export default function CryptoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setLoading(true);

        const coinRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}`,
        );
        const coinData = await coinRes.json();
        setCoin(coinData);

        const chartRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`,
        );
        const chart = await chartRes.json();

        const labels = chart.prices.map((p) =>
          new Date(p[0]).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        );
        const data = chart.prices.map((p) => p[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: `${coinData.name} Price (USD)`,
              data,
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56, 189, 248, 0.2)",
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching coin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  if (loading)
    return (
      <div className="crypto-container centered">
        <p className="loading">Loading coin data...</p>
      </div>
    );

  if (!coin)
    return (
      <div className="crypto-container centered">
        <p>Coin not found!</p>
      </div>
    );

  return (
    <div className="crypto-container">
      <Navbar />
      <div className="crypto-content container">
        {/* Back Button */}
        <Link className="back-btn" to="/crypto">
          &larr; Back to Crypto
        </Link>

        {/* Coin Info */}
        <div className="coin-header">
          <img src={coin.image.small} alt={coin.name} />
          <h1>
            {coin.name} ({coin.symbol.toUpperCase()})
          </h1>
        </div>

        {/* Coin Description */}
        <p
          className="coin-description"
          dangerouslySetInnerHTML={{
            __html: coin.description.en.split(". ")[0] + ".",
          }}
        ></p>

        {/* Stats */}
        <div className="coin-stats">
          <p>
            <strong>Current Price:</strong> $
            {coin.market_data.current_price.usd}
          </p>
          <p>
            <strong>Market Cap:</strong> $
            {coin.market_data.market_cap.usd.toLocaleString()}
          </p>
          <p>
            <strong>24h Change:</strong>{" "}
            <span
              className={
                coin.market_data.price_change_percentage_24h < 0
                  ? "negative"
                  : "positive"
              }
            >
              {coin.market_data.price_change_percentage_24h.toFixed(2)}%
            </span>
          </p>
        </div>

        {/* Chart */}
        {chartData && (
          <div className="chart-container">
            <h2>{coin.name} Price Chart (7 Days)</h2>
            <Line
              data={chartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        )}
        <div style={{ marginTop: "100px" }}>
          <Link className="back-btn" to="/investment-plans">
            Invest Now
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
