import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  const [page, setPage] = useState("register");

  return (
    <div className="container">
      <h2>Password Reset</h2>

      <div className="nav-buttons">
        <button onClick={() => setPage("register")}>Register</button>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("forgot")}>Forgot</button>
        <button onClick={() => setPage("reset")}>Reset</button>
      </div>

      {page === "register" && <Register />}
      {page === "login" && <Login />}
      {page === "forgot" && <ForgotPassword />}
      {page === "reset" && <ResetPassword />}
    </div>
  );
}