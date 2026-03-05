import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$50",
    roi: "10% ROI",
    duration: "7 Days",
    dailyReturnPercent: Number((10 / 7).toFixed(3)),
    durationDays: 7,
    maxReturnPercent: 10,
  },
  {
    id: "silver",
    name: "Silver",
    price: "$200",
    roi: "20% ROI",
    duration: "14 Days",
    dailyReturnPercent: Number((20 / 14).toFixed(3)),
    durationDays: 14,
    maxReturnPercent: 20,
  },
  {
    id: "gold",
    name: "Gold",
    price: "$500",
    roi: "35% ROI",
    duration: "21 Days",
    dailyReturnPercent: Number((35 / 21).toFixed(3)),
    durationDays: 21,
    maxReturnPercent: 35,
  },
  {
    id: "diamond",
    name: "Diamond",
    price: "$1,000",
    roi: "50% ROI",
    duration: "30 Days",
    dailyReturnPercent: Number((50 / 30).toFixed(3)),
    durationDays: 30,
    maxReturnPercent: 50,
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "$3,000",
    roi: "75% ROI",
    duration: "45 Days",
    dailyReturnPercent: Number((75 / 45).toFixed(3)),
    durationDays: 45,
    maxReturnPercent: 75,
  },
  {
    id: "elite",
    name: "Elite",
    price: "$5,000",
    roi: "100% ROI",
    duration: "60 Days",
    dailyReturnPercent: Number((100 / 60).toFixed(3)),
    durationDays: 60,
    maxReturnPercent: 100,
  },
];

const InvestPlans = () => {
  const navigate = useNavigate();

  const goToInvest = (plan) => {
    navigate("/invest-funds", {
      state: {
        plan: plan.id,
        dailyReturnPercent: plan.dailyReturnPercent,
        durationDays: plan.durationDays,
        maxReturnPercent: plan.maxReturnPercent,
        mode: plan.mode,
      },
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#020617",
        minHeight: "100vh",
        paddingTop: "150px",
      }}
    >
      <Navbar />

      <div className="plans-container">
        <h2 className="title">Investment Plans</h2>
        <p className="subtitle">
          Choose a plan that fits your financial goals and investment capacity.
        </p>

        <div className="plans-grid">
          {PLANS.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3>{plan.name}</h3>

              <div className="plan-row">
                <span>Minimum</span>
                <span>{plan.price}</span>
              </div>

              <div className="plan-row">
                <span>Return</span>
                <span>{plan.roi}</span>
              </div>

              <div className="plan-row">
                <span>Duration</span>
                <span>{plan.duration}</span>
              </div>

              <button className="btn" onClick={() => goToInvest(plan)}>
                Invest Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      <style>{`
      
      .plans-container{
        max-width:1100px;
        margin:auto;
        margin-bottom: 80px;
        padding:0 15px;
      }

      .title{
        color:#f8fafc;
        margin-bottom:6px;
      }

      .subtitle{
        color:#94a3b8;
        margin-bottom:25px;
      }

      .plans-grid{
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:20px;
      }

      .plan-card{
        background:#0f172a;
        padding:20px;
        border-radius:16px;
      }

      .plan-card h3{
        color:#38bdf8;
        margin-bottom:12px;
      }

      .plan-row{
        display:flex;
        justify-content:space-between;
        margin-bottom:6px;
        color:#94a3b8;
      }

      .plan-row span:last-child{
        color:#f8fafc;
        font-weight:600;
      }

      .btn{
        width:100%;
        margin-top:14px;
      }

      /* Tablet */
      @media (max-width: 900px){
        .plans-grid{
          grid-template-columns:repeat(2,1fr);
        }
      }

      /* Mobile */
      @media (max-width: 500px){
        .plans-grid{
          grid-template-columns:1fr;
        }
      }

      `}</style>
    </div>
  );
};

export default InvestPlans;
