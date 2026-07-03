import { Router } from "express";
import {
  createEvent,
  getEvents,
  getGAReport,
  getTrafficAnalysis,
  getCustomEvents,
   getEventNames,
} from "../controllers/event.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/",           createEvent);
router.get("/",            protect, getEvents);
router.get("/ga-report",   protect, getGAReport);
router.get("/traffic",     protect, getTrafficAnalysis);
router.get("/custom",      protect, getCustomEvents);
router.get( "/names",protect,getEventNames);

export default router;
