import Router from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createShipment, getsShipment, updateShipmentStatus, assignShipment } from "../controllers/shipmentController.js";
import { getDriverShipments, updateDriverShipmentStatus, getShipmentTracking } from "../controllers/shipmentController.js";
const router = Router();
router.post("/", authenticateToken, authorizeRoles("customer"), createShipment);
router.get("/", authenticateToken, authorizeRoles("customer", "admin"), getsShipment);
router.put("/:id/status", authenticateToken, authorizeRoles("admin"), updateShipmentStatus);
router.put("/:id/assign", authenticateToken, authorizeRoles("admin"), assignShipment);
router.get("/driver/my-shipments", authenticateToken, authorizeRoles("driver"), getDriverShipments);
router.put("/driver/:id/status", authenticateToken, authorizeRoles("driver"), updateDriverShipmentStatus);
router.get("/:id/tracking", authenticateToken, authorizeRoles("customer"), getShipmentTracking);
export default router;
//# sourceMappingURL=shipmentroutes.js.map