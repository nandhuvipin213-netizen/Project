import type { RequestHandler } from "express";
type Role = "admin" | "driver" | "customer";

export const authorizeRoles = (
    ...allowedRoles: Role[]
): RequestHandler => {
    return (req, res, next) => {

        const authUser = res.locals.authUser as
            | { userId: string; role: Role }
            | undefined;
            console.log("Role authorization check:", authUser);


        if (!authUser) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }
        if (!allowedRoles.includes(authUser.role)) {
            res.status(403).json({
                success: false,
                message: "Access denied: insufficient permissions"
            });
            return;
        }
        next();
    };
}