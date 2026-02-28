import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import User from "./pages/User";
import Transactions from "./pages/Transactions";
import Transaction from "./pages/Transaction";
import Deposits from "./pages/Deposits";
import Investments from "./pages/Investments";
import Withdrawals from "./pages/Withdrawals";
import CheckAuth from "./components/CheckAuth"; // <-- import your auth component
import CreateBot from "./pages/CreateBot";
import Bots from "./pages/Bots";
import Bot from "./pages/Bot";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Crypto from "./pages/Crypto";
import CryptoDetail from "./pages/CryptoDetail";

function App() {
  return (
    <Router>
      {/* Global Toast Container */}
      <ScrollToTop />
      <ToastContainer />

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/crypto/:id" element={<CryptoDetail />} />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <CheckAuth>
              <Dashboard />
            </CheckAuth>
          }
        />
        <Route
          path="/users"
          element={
            <CheckAuth>
              <Users />
            </CheckAuth>
          }
        />
        <Route
          path="/user/:id"
          element={
            <CheckAuth>
              <User />
            </CheckAuth>
          }
        />
        <Route
          path="/transactions"
          element={
            <CheckAuth>
              <Transactions />
            </CheckAuth>
          }
        />
        <Route
          path="/transaction/:id"
          element={
            <CheckAuth>
              <Transaction />
            </CheckAuth>
          }
        />
        <Route
          path="/deposits"
          element={
            <CheckAuth>
              <Deposits />
            </CheckAuth>
          }
        />
        <Route
          path="/investments"
          element={
            <CheckAuth>
              <Investments />
            </CheckAuth>
          }
        />
        <Route
          path="/withdrawals"
          element={
            <CheckAuth>
              <Withdrawals />
            </CheckAuth>
          }
        />
        <Route
          path="/create-bot"
          element={
            <CheckAuth>
              <CreateBot />
            </CheckAuth>
          }
        />
        <Route
          path="/bots"
          element={
            <CheckAuth>
              <Bots />
            </CheckAuth>
          }
        />
        <Route
          path="/bot/:id"
          element={
            <CheckAuth>
              <Bot />
            </CheckAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
