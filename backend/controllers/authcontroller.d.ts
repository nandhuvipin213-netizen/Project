import type { Request, Response } from "express";
import type { RequestHandler } from "express";
export declare const registerUser: (req: Request, res: Response) => Promise<void>;
export declare const loginUser: (req: Request, res: Response) => Promise<void>;
export declare const createAdminUser: (req: Request, res: Response) => Promise<void>;
export declare const createDriver: (req: Request, res: Response) => Promise<void>;
export declare const resetDriverPassword: RequestHandler;
export declare const updateDriverShipmentStatus: RequestHandler;
//# sourceMappingURL=authcontroller.d.ts.map