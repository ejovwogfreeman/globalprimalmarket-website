// import { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { BASE_URL } from "../data";
// import { toast } from "react-toastify";

// const PLANS = [
//   { id: "starter", name: "Starter", min: 50 },
//   { id: "silver", name: "Silver", min: 200 },
//   { id: "gold", name: "Gold", min: 500 },
//   { id: "diamond", name: "Diamond", min: 1000 },
//   { id: "platinum", name: "Platinum", min: 3000 },
//   { id: "elite", name: "Elite", min: 5000 },
// ];

// const CRYPTO_MODES = [
//   { symbol: "btc", rate: 40000 },
//   { symbol: "eth", rate: 2500 },
//   { symbol: "sol", rate: 120 },
//   { symbol: "trx", rate: 0.07 },
//   { symbol: "bnb", rate: 350 },
//   { symbol: "xrp", rate: 0.5 },
// ];

// const InvestFunds = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const initialPlan = searchParams.get("plan") || "starter";
//   const dailyReturnPercent = searchParams.get("dailyReturnPercent") || "";
//   const durationDays = searchParams.get("durationDays") || "";
//   const maxReturnPercent = searchParams.get("maxReturnPercent") || "";

//   const [plan, setPlan] = useState(initialPlan);
//   const [mode, setMode] = useState(CRYPTO_MODES[0].symbol);
//   const [amountUSD, setAmountUSD] = useState("");
//   const [loading, setLoading] = useState(false);

//   const selectedPlan = PLANS.find((p) => p.id === plan);
//   const selectedMode = CRYPTO_MODES.find((c) => c.symbol === mode);

//   const amountInCrypto =
//     amountUSD && selectedMode ? Number(amountUSD) / selectedMode.rate : 0;

//   const submitInvestment = async (e) => {
//     e.preventDefault();

//     if (!amountUSD) {
//       toast.error("Please enter an investment amount in USD");
//       return;
//     }

//     if (Number(amountUSD) < selectedPlan.min) {
//       toast.error(
//         `Minimum for ${selectedPlan.name} plan is $${selectedPlan.min}`,
//       );
//       return;
//     }

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       const payload = {
//         plan,
//         mode,
//         amount: amountInCrypto,
//         dailyReturnPercent,
//         durationDays,
//         maxReturnPercent,
//       };

//       const response = await fetch(`${BASE_URL}/transactions/invest`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         toast.error(data.message || "Investment failed");
//         return;
//       }

//       toast.success(
//         data.message ||
//           `You invested $${amountUSD} (~${amountInCrypto.toFixed(6)} ${mode.toUpperCase()}) successfully`,
//       );

//       setAmountUSD("");
//       navigate("/dashboard");
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#1e293b",
//         minHeight: "100vh",
//         paddingTop: "150px",
//       }}
//     >
//       <Navbar />

//       <div className="form-container" style={{ marginBottom: "80px" }}>
//         <form onSubmit={submitInvestment}>
//           <h2>Invest Funds</h2>

//           <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
//             Select an investment plan, choose a mode, and enter amount in USD.
//           </p>

//           {/* PLAN */}
//           <label>Select Plan</label>
//           <select value={plan} onChange={(e) => setPlan(e.target.value)}>
//             {PLANS.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.name} (Min ${p.min})
//               </option>
//             ))}
//           </select>

//           {/* MODE */}
//           <label>Select Mode</label>
//           <select value={mode} onChange={(e) => setMode(e.target.value)}>
//             {CRYPTO_MODES.map((c) => (
//               <option key={c.symbol} value={c.symbol}>
//                 {c.symbol.toUpperCase()} (~${c.rate})
//               </option>
//             ))}
//           </select>

//           {/* AMOUNT */}
//           <label>Amount (USD)</label>
//           <input
//             type="number"
//             placeholder={`Minimum $${selectedPlan.min}`}
//             value={amountUSD}
//             onChange={(e) => setAmountUSD(e.target.value)}
//           />

//           {/* CRYPTO CONVERSION */}
//           {amountUSD && (
//             <p
//               style={{
//                 color: "#38bdf8",
//                 fontWeight: "600",
//                 marginTop: "8px",
//               }}
//             >
//               ≈ {amountInCrypto.toFixed(6)} {mode.toUpperCase()}
//             </p>
//           )}

//           <button type="submit" className="btn" disabled={loading}>
//             {loading ? "LOADING..." : "Submit Investment"}
//           </button>
//         </form>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default InvestFunds;

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BASE_URL } from "../data";
import { toast } from "react-toastify";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    min: 50,
    dailyReturnPercent: 1.429,
    durationDays: 7,
    maxReturnPercent: 10,
  },
  {
    id: "silver",
    name: "Silver",
    min: 200,
    dailyReturnPercent: 1.429,
    durationDays: 14,
    maxReturnPercent: 20,
  },
  {
    id: "gold",
    name: "Gold",
    min: 500,
    dailyReturnPercent: 1.667,
    durationDays: 21,
    maxReturnPercent: 35,
  },
  {
    id: "diamond",
    name: "Diamond",
    min: 1000,
    dailyReturnPercent: 1.667,
    durationDays: 30,
    maxReturnPercent: 50,
  },
  {
    id: "platinum",
    name: "Platinum",
    min: 3000,
    dailyReturnPercent: 1.667,
    durationDays: 45,
    maxReturnPercent: 75,
  },
  {
    id: "elite",
    name: "Elite",
    min: 5000,
    dailyReturnPercent: 1.667,
    durationDays: 60,
    maxReturnPercent: 100,
  },
];

const CRYPTO_MODES = [
  { symbol: "btc", rate: 40000 },
  { symbol: "eth", rate: 2500 },
  { symbol: "sol", rate: 120 },
  { symbol: "trx", rate: 0.07 },
  { symbol: "bnb", rate: 350 },
  { symbol: "xrp", rate: 0.5 },
];

const InvestFunds = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read initial values from navigation state
  const state = location.state || {};
  const initialPlan = state.plan || "starter";
  const initialMode = state.mode || CRYPTO_MODES[0].symbol;

  const [plan, setPlan] = useState(initialPlan);
  const [dailyReturnPercent, setDailyReturnPercent] = useState(
    state.dailyReturnPercent || "",
  );
  const [durationDays, setDurationDays] = useState(state.durationDays || "");
  const [maxReturnPercent, setMaxReturnPercent] = useState(
    state.maxReturnPercent || "",
  );
  const [mode, setMode] = useState(initialMode);
  const [amountUSD, setAmountUSD] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === plan);
  const selectedMode = CRYPTO_MODES.find((c) => c.symbol === mode);

  // Update route state whenever plan or mode changes
  useEffect(() => {
    const updatedPlan = PLANS.find((p) => p.id === plan);
    setDailyReturnPercent(updatedPlan.dailyReturnPercent);
    setDurationDays(updatedPlan.durationDays);
    setMaxReturnPercent(updatedPlan.maxReturnPercent);
  }, [plan]);

  const amountInCrypto =
    amountUSD && selectedMode ? Number(amountUSD) / selectedMode.rate : 0;

  const submitInvestment = async (e) => {
    e.preventDefault();

    if (!amountUSD) {
      toast.error("Please enter an investment amount in USD");
      return;
    }

    if (Number(amountUSD) < selectedPlan.min) {
      toast.error(
        `Minimum for ${selectedPlan.name} plan is $${selectedPlan.min}`,
      );
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        plan,
        mode,
        amount: amountInCrypto,
        dailyReturnPercent,
        durationDays,
        maxReturnPercent,
      };

      const response = await fetch(`${BASE_URL}/transactions/investment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Investment failed");
        return;
      }

      toast.success(
        data.message ||
          `You invested $${amountUSD} (~${amountInCrypto.toFixed(6)} ${mode.toUpperCase()}) successfully`,
      );

      setAmountUSD("");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        minHeight: "100vh",
        paddingTop: "150px",
      }}
    >
      <Navbar />

      <div className="form-container" style={{ marginBottom: "80px" }}>
        <form onSubmit={submitInvestment}>
          <h2>Invest Funds</h2>

          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
            Select an investment plan, choose a mode, and enter amount in USD.
          </p>

          {/* PLAN */}
          <label>Select Plan</label>
          <select value={plan} onChange={(e) => setPlan(e.target.value)}>
            {PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Min ${p.min})
              </option>
            ))}
          </select>

          {/* MODE */}
          <label>Select Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            {CRYPTO_MODES.map((c) => (
              <option key={c.symbol} value={c.symbol}>
                {c.symbol.toUpperCase()} (~${c.rate})
              </option>
            ))}
          </select>

          {/* AMOUNT */}
          <label>Amount (USD)</label>
          <input
            type="number"
            placeholder={`Minimum $${selectedPlan.min}`}
            value={amountUSD}
            onChange={(e) => setAmountUSD(e.target.value)}
          />

          {/* CRYPTO CONVERSION */}
          {amountUSD && (
            <p
              style={{ color: "#38bdf8", fontWeight: "600", marginTop: "8px" }}
            >
              ≈ {amountInCrypto.toFixed(6)} {mode.toUpperCase()}
            </p>
          )}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Loading..." : "Submit Investment"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default InvestFunds;
