import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/stats", protect, getDashboardStats);
export default router;
