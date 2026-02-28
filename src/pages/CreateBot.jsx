import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";
import { BASE_URL } from "../data";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CreateBot = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [dailyReturnPercent, setDailyReturnPercent] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [maxReturnPercent, setMaxReturnPercent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePriceChange = (value) => {
    setPrice(value);

    if (value === "50") {
      setDailyReturnPercent(1);
      setDurationDays(30);
      setMaxReturnPercent(130);
    }
    if (value === "100") {
      setDailyReturnPercent(1.25);
      setDurationDays(30);
      setMaxReturnPercent(135);
    }
    if (value === "200") {
      setDailyReturnPercent(1.5);
      setDurationDays(30);
      setMaxReturnPercent(145);
    }
    if (value === "500") {
      setDailyReturnPercent(2);
      setDurationDays(30);
      setMaxReturnPercent(160);
    }
    if (value === "1000") {
      setDailyReturnPercent(3);
      setDurationDays(30);
      setMaxReturnPercent(190);
    }
  };

  const handleCreateBot = async (e) => {
    e.preventDefault();

    if (!name || !price) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/admin/bot/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          dailyReturnPercent: Number(dailyReturnPercent),
          durationDays: Number(durationDays),
          maxReturnPercent: Number(maxReturnPercent),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create bot");
        return;
      }

      toast.success("Bot created successfully!");
      navigate("/bots");
    } catch (error) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="form-container bot-form">
        <form onSubmit={handleCreateBot}>
          <h2>Create Bot 🤖</h2>

          <label>Bot Name</label>
          <input
            type="text"
            placeholder="Enter bot name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="Enter bot description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Bot Price</label>
          <select
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
          >
            <option value="">Select Bot Price</option>
            <option value="50">$50</option>
            <option value="100">$100</option>
            <option value="200">$200</option>
            <option value="500">$500</option>
            <option value="1000">$1000</option>
          </select>

          <label>Daily Return (%)</label>
          <input type="number" readOnly value={dailyReturnPercent} />

          <label>Duration (Days)</label>
          <input type="number" readOnly value={durationDays} />

          <label>Max Return (%)</label>
          <input type="number" readOnly value={maxReturnPercent} />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "CREATING..." : "CREATE BOT"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateBot;
