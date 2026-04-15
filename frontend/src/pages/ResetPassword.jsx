import { useState,useEffect } from "react";
import API from "../api";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [validToken,setValidToken] = useState(null);


  useEffect(() => {
    const verifyToken = async () => {
      try {
        await API.get(`/api/auth/verify-token/${token}`);
        setValidToken(true);
      } catch (err) {
        setValidToken(false);
        setError("This reset link is invalid or has expired.");
      }
    };
    if (token) verifyToken();
  }, [token]);

  const handleReset = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post(`/api/auth/reset-password/${token}`, {
      newPassword,
    });

    setMessage(res.data.message);
    setError("");
  } catch (err) {
    setError(err.response?.data?.message || "Error resetting password");
    setMessage("");
  }
};
   if (validToken === null) {
    return <p>Verifying link...</p>;
  }

  if (validToken === false) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <form onSubmit={handleReset}>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
