import {authenticateToken} from "../middleware/authMiddleware.js";
import {authorizeRoles} from "../middleware/roleMiddleware.js";
import { Router } from "express";
import {updateVehicleLocation,getLatestVehicleLocations,} from "../controllers/vehicleLocationController.js";


const router = Router();

// Get latest vehicle locations (Admin)
router.get("/",authenticateToken,authorizeRoles("admin"),getLatestVehicleLocations);

export default router;