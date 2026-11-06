import type { RequestHandler } from "express";
type Role = "admin" | "driver" | "customer";
export declare const authorizeRoles: (...allowedRoles: Role[]) => RequestHandler;
export {};
//# sourceMappingURL=roleMiddleware.d.ts.map