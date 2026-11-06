export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const authUser = res.locals.authUser;
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
};
//# sourceMappingURL=roleMiddleware.js.map