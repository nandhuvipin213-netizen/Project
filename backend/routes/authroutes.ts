import type { Router } from "express"
import express from "express"
import {authenticateToken} from "../middleware/authMiddleware.js"
import {authorizeRoles} from "../middleware/roleMiddleware.js"
import { registerUser,  loginUser, createAdminUser,createDriver,resetDriverPassword, changePassword, getProfile } from "../controllers/authcontroller.js"
import { updateProfile } from "../controllers/authcontroller.js"

const router=express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.put(
  "/change-password",
  authenticateToken,
  authorizeRoles("driver","customer"),
  changePassword
);
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.post("/setup-admin",createAdminUser)
router.post("/create-driver",authenticateToken,authorizeRoles("admin"),createDriver)
router.put("/reset-driver-password/:driverId",authenticateToken, authorizeRoles("admin"),resetDriverPassword);
export default router