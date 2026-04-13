import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";

// REGISTER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("=== FORGOT PASSWORD TRIGGERED ===");
    console.log("Incoming email:", email);
    console.log("BREVO API KEY EXISTS:", process.env.BREVO_API_KEY ? "YES" : "NO");
    console.log("CLIENT URL:", process.env.CLIENT_URL);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found in DB for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.email);

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

    await user.save();
    console.log("Reset token saved to DB");

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log("Reset URL:", resetUrl);

    // Send email via Brevo using axios
    try {
      const brevoResponse = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            email: "prakharsethi05@gmail.com",
            name: "Password Reset",
          },
          to: [{ email: user.email }],
          subject: "Password Reset Request",
          htmlContent: `
            <h3>Password Reset Request</h3>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link expires in 1 hour.</p>
          `,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
          },
        }
      );

      console.log("BREVO STATUS:", brevoResponse.status);
      console.log("BREVO RESPONSE:", JSON.stringify(brevoResponse.data));

      return res.status(200).json({
        message: "Password reset email sent successfully",
      });

    } catch (brevoError) {
      // Axios throws on non-2xx — this catches it with full detail
      console.error("BREVO AXIOS ERROR:");
      console.error("Status:", brevoError.response?.status);
      console.error("Data:", JSON.stringify(brevoError.response?.data));
      console.error("Message:", brevoError.message);

      return res.status(500).json({
        message: "Email could not be sent",
        error: brevoError.response?.data || brevoError.message,
      });
    }

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};