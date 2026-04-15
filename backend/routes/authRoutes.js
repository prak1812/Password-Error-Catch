import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);


router.get("/verify-token/:token", verifyToken);
router.post("/reset-password/:token", resetPassword);

export default router;