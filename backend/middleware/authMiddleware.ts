
import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user.js";

type UserRole = "admin" | "driver" | "customer";

type AuthLocals = {
  authUser: {
    userId: string;
    role: UserRole;
  };
};

export const authenticateToken: RequestHandler<
  Record<string, string>,
  unknown,
  unknown,
  Record<string, string>,
  AuthLocals
> = async (req, res, next) => {
  try {
    // 1. Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
      return;
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET;

    if (!token || !secretKey) {
      res.status(401).json({
        success: false,
        message: "Authentication credentials required",
      });
      return;
    }

    // 3. Verify JWT token
    const decoded = jwt.verify(token, secretKey);

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      !decoded.sub ||
      !["admin", "driver", "customer"].includes(
        String(decoded.role)
      )
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
      return;
    }

    const payload = decoded as JwtPayload & {
      role: UserRole;
    };

    // 4. Find user in database
    const user = await UserModel.findById(payload.sub);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User account not found",
      });
      return;
    }

    // 5. Check account activation
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact the administrator.",
      });
      return;
    }

    // 6. Verify current role
    if (user.role !== payload.role) {
      res.status(401).json({
        success: false,
        message: "Invalid token role",
      });
      return;
    }

    // 7. Store authenticated user
    res.locals.authUser = {
      userId: user._id.toString(),
      role: user.role,
    };

    console.log("Authenticated user:", res.locals.authUser);

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
