
import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.get(
  "/stats",
  authenticateToken,
  authorizeRoles("admin"),
  getDashboardStats
);

export default router;
