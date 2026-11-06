import { Router } from "express";
import {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deactivateDriver,
  activateDriver,
  getDriverDashboard,
  getMyShipments,
} from "../controllers/driverController.js";
import { resetDriverPassword } from "../controllers/authcontroller.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// Admin routes
router.post("/", authenticateToken, authorizeRoles("admin"), createDriver);

router.get("/", authenticateToken, authorizeRoles("admin"), getAllDrivers);

// Driver dashboard
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles("driver"),
  getDriverDashboard
);

// Driver's assigned shipments
router.get(
  "/my-shipments",
  authenticateToken,
  authorizeRoles("driver"),
  getMyShipments
);

// Dynamic admin routes MUST come afterwards
router.get("/:id", authenticateToken, authorizeRoles("admin"), getDriverById);

router.put("/:id", authenticateToken, authorizeRoles("admin"), updateDriver);

router.patch(
  "/:id/deactivate",
  authenticateToken,
  authorizeRoles("admin"),
  deactivateDriver
);

router.patch(
  "/:id/activate",
  authenticateToken,
  authorizeRoles("admin"),
  activateDriver
);
router.put(
  "/reset-driver-password/:driverId",
  authenticateToken,
  authorizeRoles("admin"),
  resetDriverPassword
);
export default router;