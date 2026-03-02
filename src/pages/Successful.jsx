import { useNavigate, useLocation, Link } from "react-router-dom";
import "../App.css";
import successgif from "../assets/succesful.gif";

export default function Successful() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get dynamic message from state
  const message =
    location.state?.message || "Your account has been verified successfully!";

  return (
    <div className="form-container">
      <form action="" style={{ paddingBottom: "30px" }}>
        <img
          src={successgif}
          alt=""
          style={{ mixBlendMode: "multiply", marginBottom: "-30px" }}
        />
        <h2>🎉 Success!</h2>
        <p>{message}</p> <br />
        <Link className="btn" to="/login" style={{ textDecoration: "none" }}>
          Go to Login
        </Link>
      </form>
    </div>
  );
}
