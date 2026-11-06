import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import { json } from "node:stream/consumers";
import type { RequestHandler } from "express";
import shipmentModel from "../models/shipment.js";


export const registerUser = async (req: Request, res: Response) => {
   try {
      const { name, email, phone, password } = req.body

      if (!name || !email || !phone || !password) {
         res.status(400).json({
            success: false,
            message: "All field required"
         })
         return;
      }
      if (typeof password !== "string" || password.length < 8) {
         res.status(400).json({
            success: false,
            message: "Password must be contain letters 8"
         })
         return;
      }
      const normalizedEmail = String(email).trim().toLowerCase();

      const existinguser = await UserModel.findOne({
         email: normalizedEmail
      })
      if (existinguser) {
         res.status(409).json({
            success: false,
            message: "email is already registered"
         })
         return;
      }
      const passwordHashs = await bcrypt.hash(password, 12)

      const user = await UserModel.create({
         name,
         email: normalizedEmail,
         phone,
         passwordHash: passwordHashs,
         role: "customer"

      })
      res.status(201).json({
         success: true,
         message: "Customer registered successfully",
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
         }
      })
   }
   catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({
         success: false,
         message: "Unable to register user"
      })
   }
}

export const loginUser = async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body
      if (typeof email !== "string" || typeof password !== "string") {
         res.status(400).json({
            success: false,
            message: "Invalid email or password"
         })
         return;
      }
      const user = await UserModel.findOne({ email: email }).select("+passwordHash")
      if (!user) {
         res.status(401).json({
            success: false,
            message: "Invalid email or password"
         })
         return;
      }
      // Check whether the account is active
      if (!user.isActive) {
         res.status(403).json({
            success: false,
            message: "Your account has been deactivated. Please contact the administrator."
         });
         return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
      if (!isPasswordValid) {
         res.status(401).json({
            success: false,
            message: "Invalid email or password"
         })
         return;
      }

      const secret = process.env.JWT_SECRET
      if (!secret) {
         res.status(500).json({
            success: false,
            message: "Authentication configuration error"
         })
         return;
      }

      const token = jwt.sign({ role: user.role }, secret, {
         subject: user._id.toString(),
         expiresIn: "1d"
      })
      res.status(200).json({
         success: true,
         message: "Login successful",
         token,
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
         }
      })
   }
   catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({
         success: false,
         message: "Unable to login user"
      })
   }
}

export const createAdminUser = async (req: Request, res: Response) => {
   try {
      const setupkey = req.headers["x-admin-setup-key"]
      const configuredkey = process.env.ADMIN_SETUP_KEY

      if (typeof setupkey !== "string" || !configuredkey || setupkey !== configuredkey) {
         res.status(403).json({
            success: false,
            message: "Invalid admin key"
         })
         return;
      }

      const { name, email, password } = req.body
      if (typeof name !== "string" ||
         typeof email !== "string" ||
         typeof password !== "string" ||
         !name.trim() ||
         !email.trim() ||
         password.length < 12
      ) {
         res.status(400).json({
            success: false,
            message: "Provide name,email and password atleast 12 characters"
         })
         return;
      }
      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await UserModel.findOne({
         email: normalizedEmail
      })
      if (existingUser) {
         res.status(409).json({
            success: false,
            message: "email is already registered"
         })
         return;
      }

      const passwordHash = await bcrypt.hash(password, 12)

      const admin = await UserModel.create({
         name: name.trim(),
         email: normalizedEmail,
         passwordHash,
         role: "admin",
      })

      res.status(201).json({
         success: true,
         message: "Initial admin created successfully",
         user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
         },
      });
   } catch (error) {
      console.error("Initial admin setup failed:", error);

      res.status(500).json({
         success: false,
         message: "Unable to create initial admin",
      });
   }
}


export const createDriver = async (
   req: Request,
   res: Response
) => {
   try {
      const { name, email, password } = req.body;

      if (
         typeof name !== "string" ||
         typeof email !== "string" ||
         typeof password !== "string" ||
         !name.trim() ||
         !email.trim() ||
         password.length < 12
      ) {
         res.status(400).json({
            success: false,
            message:
               "Provide a name, email, and password of at least 12 characters",
         });
         return;
      }

      const normalizedEmail = email.trim().toLowerCase();


      const existingUser = await UserModel.findOne({
         email: normalizedEmail,
      });

      if (existingUser) {
         res.status(409).json({
            success: false,
            message: "Email is already registered",
         });
         return;
      }


      const passwordHash = await bcrypt.hash(password, 12);


      const driver = await UserModel.create({
         name: name.trim(),
         email: normalizedEmail,
         passwordHash,
         role: "driver",
      });

      res.status(201).json({
         success: true,
         message: "Driver account created successfully",
         user: {
            id: driver._id,
            name: driver.name,
            email: driver.email,
            role: driver.role,
         },
      });
   } catch (error) {
      console.error("Driver creation failed:", error);

      res.status(500).json({
         success: false,
         message: "Unable to create driver account",
      });
   }
};

export const resetDriverPassword: RequestHandler = async (req, res) => {
   try {
      const { driverId } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 12) {
         res.status(400).json({
            success: false,
            message: "Password must be at least 12 characters long",
         });
         return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      const driver = await UserModel.findOneAndUpdate(
         { _id: driverId, role: "driver" },
         { passwordHash: hashedPassword },
         { returnDocument: "after" }
      );

      if (!driver) {
         res.status(404).json({
            success: false,
            message: "Driver not found",
         });
         return;
      }

      res.status(200).json({
         success: true,
         message: "Driver password reset successfully",
      });
   } catch (error) {
      console.error("Reset driver password error:", error);

      res.status(500).json({
         success: false,
         message: "Failed to reset driver password",
      });
   }
};

export const updateDriverShipmentStatus: RequestHandler = async (req, res) => {
   try {
      const { id } = req.params
      const { status } = req.body

      const driverId = res.locals.authUser.userId;

      const allowedStatuses = ["picked-up", "in-transit", "delivered"];

      if (!allowedStatuses.includes(status)) {
         res.status(400).json({
            success: false,
            message: "Invalid delivery status",
         });
         return;
      }
      const shipment = await shipmentModel.findOne({
         _id: id,
         assignedDriver: driverId,
      });

      if (!shipment) {
         res.status(404).json({
            success: false,
            message: "Shipment not found or not assigned to you",
         });
         return;
      }

      shipment.status = status;
      await shipment.save();

      res.status(200).json({
         success: true,
         message: "Delivery status updated successfully",
         shipment,
      });

   } catch (error) {
      console.error("Driver status update error:", error);

      res.status(500).json({
         success: false,
         message: "Failed to update delivery status",
      });
   }
};
