import { useState } from "react";
import API from "../api";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/reset-password", {
        token,
        newPassword
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={handleReset}>
      <input
        type="text"
        placeholder="Reset Token"
        onChange={(e) => setToken(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />

      <button type="submit">Reset Password</button>
    </form>
  );
}