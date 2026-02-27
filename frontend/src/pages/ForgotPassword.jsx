import { useState } from "react";
import API from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      await API.post("/forgot-password", { email });
alert("Password reset link has been sent to your email!");
} catch (err) {
  alert(err.response?.data?.message || "Error");
}
    }
  };

  return (
    <form onSubmit={handleForgot}>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button type="submit">Generate Reset Token</button>
    </form>
  );
}