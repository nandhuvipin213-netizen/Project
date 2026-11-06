import jwt, {} from "jsonwebtoken";
export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Authentication token required",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const secretKey = process.env.JWT_SECRET;
        if (!token || !secretKey) {
            res.status(401).json({
                success: false,
                message: "Authentication credentials required",
            });
            return;
        }
        const decoded = jwt.verify(token, secretKey);
        if (typeof decoded === "string" ||
            typeof decoded.sub !== "string" ||
            !decoded.sub ||
            !["admin", "driver", "customer"].includes(String(decoded.role))) {
            res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
            return;
        }
        const payload = decoded;
        res.locals.authUser = {
            userId: payload.sub,
            role: payload.role,
        };
        console.log("Authenticated user:", res.locals.authUser);
        next();
    }
    catch (error) {
        console.error("JWT verification error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
//# sourceMappingURL=authMiddleware.js.map