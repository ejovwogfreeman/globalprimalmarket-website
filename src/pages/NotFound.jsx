import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link
          to="/"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#30AAEF",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Go to Home
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
