import Router from "express";
import { createVehicle, getVehicles, updatevehicle, deleteVehicle } from "../controllers/vehicleController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
const router = Router();
router.use(authenticateToken, authorizeRoles("admin"));
router.post("/", createVehicle);
router.get("/", getVehicles);
router.put("/:id", updatevehicle);
router.delete("/:id", deleteVehicle);
export default router;
//# sourceMappingURL=vehicleRouter.js.map