import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getMyNotifications } from "../controllers/notificationController.js";
import { markNotificationAsRead } from "../controllers/notificationController.js";

const router = Router();

router.get(
  "/my-notifications",
  authenticateToken,
  authorizeRoles("driver"),
  getMyNotifications
);

router.put(
  "/:id/read",
  authenticateToken,
  authorizeRoles("driver"),
  markNotificationAsRead
);

export default router;