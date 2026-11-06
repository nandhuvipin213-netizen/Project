import {authenticateToken} from "../middleware/authMiddleware.js";
import {authorizeRoles} from "../middleware/roleMiddleware.js";
import { Router } from "express";
import { updateVehicleLocation } from "../controllers/vehicleLocationController.js";


const router = Router();

router.post("/", authenticateToken,authorizeRoles("driver"),updateVehicleLocation);

export default router;