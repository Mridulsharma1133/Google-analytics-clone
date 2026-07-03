import { Router } from "express";
import {
  getKPIs,
  createKPI,
  getAllKPIConfigs,
  deleteKPI,
} from "../controllers/kpi.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { toggleKPIVisibility } from "../controllers/visibilityKPI.controller.js";
const router = Router();
router.get("/", protect, getKPIs);

router.post("/config", protect, createKPI);

router.get("/config", protect, getAllKPIConfigs);

router.delete("/config/:id", protect, deleteKPI);
router.patch("/config/:id/toggle", protect, toggleKPIVisibility);

export default router;
