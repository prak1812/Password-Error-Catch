import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
console.log("BREVO KEY:", process.env.BREVO_API_KEY);
console.log("CLIENT URL:", process.env.CLIENT_URL);
console.log("MONGO URI:", process.env.MONGO_URI);
console.log("JWT SECRET:", process.env.JWT_SECRET);
connectDB();

const app = express();

app.use(cors({
  origin: "https://password-error-catch-1.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});