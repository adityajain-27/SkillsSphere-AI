import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { updateProfile, deleteProfile } from "./controller.js";

const router = express.Router();

// All user routes require authentication
router.use(protect);

// 👤 Update Current User Profile
router.put("/me", updateProfile);

// 🗑️ Delete Current User Account
router.delete("/me", deleteProfile);

export default router;
