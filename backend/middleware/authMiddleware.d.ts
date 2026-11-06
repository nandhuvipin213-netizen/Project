import type { RequestHandler } from "express";
type UserRole = "admin" | "driver" | "customer";
type AuthLocals = {
    authUser: {
        userId: string;
        role: UserRole;
    };
};
export declare const authenticateToken: RequestHandler<Record<string, string>, unknown, unknown, Record<string, string>, AuthLocals>;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map