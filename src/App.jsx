import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import Transaction from "./pages/Transaction";
import Deposits from "./pages/Deposits";
import Investments from "./pages/Investments";
import Withdrawals from "./pages/Withdrawals";
import CheckAuth from "./components/CheckAuth"; // <-- import your auth component
import Bots from "./pages/Bots";
import Bot from "./pages/Bot";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Crypto from "./pages/Crypto";
import CryptoDetail from "./pages/CryptoDetail";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Successful from "./pages/Successful";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import DepositFunds from "./pages/DepositFunds";
import InvestFunds from "./pages/InvestFunds";
import InvestPlans from "./pages/InvestPlans";
import WithdrawFunds from "./pages/WithdrawFunds";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/successful" element={<Successful />} />
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
          path="/profile"
          element={
            <CheckAuth>
              <Profile />
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
        <Route
          path="/deposit-funds"
          element={
            <CheckAuth>
              <DepositFunds />
            </CheckAuth>
          }
        />
        <Route
          path="/investment-plans"
          element={
            <CheckAuth>
              <InvestPlans />
            </CheckAuth>
          }
        />
        <Route
          path="/invest-funds"
          element={
            <CheckAuth>
              <InvestFunds />
            </CheckAuth>
          }
        />
        <Route
          path="/withdraw-funds"
          element={
            <CheckAuth>
              <WithdrawFunds />
            </CheckAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
