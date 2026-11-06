import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
const router = Router();
router.get("/admin", authenticateToken, authorizeRoles("admin"), (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin route accessed successfully",
    });
});
router.get("/driver", authenticateToken, authorizeRoles("driver"), (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Driver route accessed successfully",
    });
});
router.get("/customer", authenticateToken, authorizeRoles("customer"), (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Customer route accessed successfully",
    });
});
export default router;
//# sourceMappingURL=testRoutes.js.map