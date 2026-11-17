import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import shipmentModel from "../models/shipment.js";
import { randomBytes } from "node:crypto";
import { sendDriverCredentialsEmail } from "../config/email.js";
import { OAuth2Client } from "google-auth-library";
import { randomInt, createHash, timingSafeEqual } from "node:crypto";
import { sendPasswordResetOTPEmail } from "../config/email.js";

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
            role: user.role,
            mustChangePassword: user.mustChangePassword
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
      const user = await UserModel.findOne({
         email: email.trim().toLowerCase()
      }).select("+passwordHash")
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

      // Google-only accounts have no password
      if (!user.passwordHash) {
         res.status(401).json({
            success: false,
            message: "This account uses Google sign-in. Please continue with Google."
         })
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
            role: user.role,
            mustChangePassword: user.mustChangePassword
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
      const { name, email, phone } = req.body;

      if (
         typeof name !== "string" ||
         typeof email !== "string" ||
         typeof phone !== "string" ||
         !name.trim() ||
         !email.trim() ||
         !phone.trim()
      ) {
         res.status(400).json({
            success: false,
            message: "Name, email and phone are required",
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

      // Generate a secure temporary password
      const temporaryPassword = randomBytes(18).toString("base64url");

      // Hash the temporary password
      const passwordHash = await bcrypt.hash(temporaryPassword, 12);

      // Create driver account
      const driver = await UserModel.create({
         name: name.trim(),
         email: normalizedEmail,
         phone: phone.trim(),
         passwordHash,
         role: "driver",
         mustChangePassword: true,
      });

      // Send login credentials to driver's email
      try {
         await sendDriverCredentialsEmail(
            driver.name,
            driver.email,
            temporaryPassword
         );
      } catch (emailError) {
         console.error("Driver email delivery failed:", emailError);

         // Remove account if email delivery fails
         await UserModel.deleteOne({ _id: driver._id });

         res.status(502).json({
            success: false,
            message: "Driver account was not created because the email could not be sent. Please try again.",
         });
         return;
      }

      res.status(201).json({
         success: true,
         message: "Driver account created and login credentials sent successfully",
         user: {
            id: driver._id,
            name: driver.name,
            email: driver.email,
            phone: driver.phone,
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
export const changePassword: RequestHandler = async (req, res) => {
   try {
      const userId = res.locals.authUser?.userId;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
         res.status(401).json({
            success: false,
            message: "Authentication required",
         });
         return;
      }

      if (!currentPassword || !newPassword) {
         res.status(400).json({
            success: false,
            message: "Both passwords are required",
         });
         return;
      }

      if (newPassword.length < 12) {
         res.status(400).json({
            success: false,
            message: "New password must be at least 12 characters long",
         });
         return;
      }

      const user = await UserModel.findById(userId).select("+passwordHash");

      if (!user) {
         res.status(404).json({
            success: false,
            message: "User not found",
         });
         return;
      }

      // Google-only accounts have no password to change
      if (!user.passwordHash) {
         res.status(400).json({
            success: false,
            message: "This account uses Google sign-in and has no password",
         });
         return;
      }

      const isPasswordValid = await bcrypt.compare(
         currentPassword,
         user.passwordHash
      );

      if (!isPasswordValid) {
         res.status(400).json({
            success: false,
            message: "Current password is incorrect",
         });
         return;
      }

      user.passwordHash = await bcrypt.hash(newPassword, 12);
      if (user.role === "driver") {
         user.mustChangePassword = false;
      }
      await user.save();

      res.status(200).json({
         success: true,
         message: "Password updated successfully",
      });
   } catch (error) {
      console.error("Change password error:", error);

      res.status(500).json({
         success: false,
         message: "Failed to update password",
      });
   }
};

export const getProfile: RequestHandler = async (req, res) => {
   try {
      const userId = res.locals.authUser?.userId;

      const user = await UserModel.findById(userId).select(
         "name email phone role"
      );

      if (!user) {
         res.status(404).json({
            success: false,
            message: "User not found",
         });
         return;
      }

      res.status(200).json({
         success: true,
         user,
      });
   } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
         success: false,
         message: "Failed to retrieve profile",
      });
   }
};


export const updateProfile: RequestHandler = async (req, res) => {
   try {
      const userId = res.locals.authUser?.userId;
      const { name, email, phone } = req.body;

      if (!name || !email || !phone) {
         res.status(400).json({
            success: false,
            message: "All fields are required",
         });
         return;
      }

      const existingUser = await UserModel.findOne({
         email: email.toLowerCase().trim(),
         _id: { $ne: userId },
      });

      if (existingUser) {
         res.status(409).json({
            success: false,
            message: "Email is already registered",
         });
         return;
      }

      const user = await UserModel.findByIdAndUpdate(
         userId,
         {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
         },
         { new: true, runValidators: true }
      ).select("name email phone role");

      if (!user) {
         res.status(404).json({
            success: false,
            message: "User not found",
         });
         return;
      }

      res.status(200).json({
         success: true,
         message: "Profile updated successfully",
         user,
      });
   } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
         success: false,
         message: "Failed to update profile",
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


export const googleLogin = async (req: Request, res: Response) => {
   try {
      const { credential } = req.body;
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const secret = process.env.JWT_SECRET;


      if (!clientId || !secret) {
         res.status(500).json({ success: false, message: "Authentication configuration error" });
         return;
      }
      if (typeof credential !== "string" || !credential) {
         res.status(400).json({ success: false, message: "Google credential is required" });
         return;
      }

      const googleClient = new OAuth2Client(clientId);
      const ticket = await googleClient.verifyIdToken({
         idToken: credential,
         audience: clientId,
      });
      const payload = ticket.getPayload();

      if (!payload) {
         res.status(401).json({ success: false, message: "Invalid Google token" });
         return;
      }

      const { email: googleEmail, sub, name, email_verified } = payload;

      if (!googleEmail || !sub || !email_verified) {
         res.status(401).json({ success: false, message: "Google account email is not verified" });
         return;
      }

      const email = googleEmail.trim().toLowerCase();
      let user = await UserModel.findOne({ email });

      if (user) {
         // Google sign-in is for customers only
         if (user.role !== "customer") {
            res.status(403).json({
               success: false,
               message: "Please sign in with your email and password",
            });
            return;
         }
         if (!user.isActive) {
            res.status(403).json({
               success: false,
               message: "Your account has been deactivated. Please contact the administrator.",
            });
            return;
         }
         if (!user.googleId) {
            user.googleId = sub;
            await user.save();
         } else if (user.googleId !== sub) {
            res.status(401).json({ success: false, message: "Google account mismatch" });
            return;
         }
      } else {
         user = await UserModel.create({
            name: (name || email.split("@")[0] || "Customer").slice(0, 80),
            email,
            googleId: sub,
            role: "customer",
         });
      }

      const token = jwt.sign({ role: user.role }, secret, {
         subject: user._id.toString(),
         expiresIn: "1d",
      });

      res.status(200).json({
         success: true,
         message: "Login successful",
         token,
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
         },
      });
   } catch (error) {
      console.error("Google login error:", error);
      res.status(401).json({ success: false, message: "Google sign-in failed" });
   }
};

const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

const getOTPHash = (otp: string, secret: string) =>
    createHash("sha256").update(`${otp}:${secret}`).digest("hex");

const clearResetOTP = (user: any) => {
    user.resetOtpHash = undefined;
    user.resetOtpExpiresAt = undefined;
    user.resetOtpAttempts = 0;
    user.resetOtpLastSentAt = undefined;
};

// STEP 1: Send OTP to registered email
export const forgotPassword: RequestHandler = async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const secret = process.env.JWT_SECRET;

        if (!email) {
            res.status(400).json({ message: "Email is required." });
            return;
        }

        if (!secret) {
            res.status(500).json({ message: "Server configuration error." });
            return;
        }

        const genericMessage =
            "If an active account exists with this email, an OTP will be sent.";

        const user = await UserModel.findOne({ email }).select("+resetOtpHash");

        // Same response for unknown and inactive accounts.
        if (!user || !user.isActive) {
            res.status(200).json({ message: genericMessage });
            return;
        }

        // Prevent repeated OTP requests.
        if (
            user.resetOtpLastSentAt &&
            Date.now() - new Date(user.resetOtpLastSentAt).getTime() <
                OTP_RESEND_COOLDOWN_MS
        ) {
            res.status(200).json({ message: genericMessage });
            return;
        }

        const otp = randomInt(100000, 1000000).toString();

        user.resetOtpHash = getOTPHash(otp, secret);
        user.resetOtpExpiresAt = new Date(
            Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
        );
        user.resetOtpAttempts = 0;
        user.resetOtpLastSentAt = new Date();

        await user.save();

        try {
            await sendPasswordResetOTPEmail(user.name, user.email, otp);
        } catch (emailError) {
            clearResetOTP(user);
            await user.save();

            console.error("Password reset email error:", emailError);
            res.status(500).json({
                message: "Unable to send OTP. Please try again later.",
            });
            return;
        }

        res.status(200).json({ message: genericMessage });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Something went wrong." });
    }
};


// STEP 2: Verify OTP
export const verifyResetOTP: RequestHandler = async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const otp = String(req.body.otp || "").trim();
        const secret = process.env.JWT_SECRET;

        if (!email || !/^\d{6}$/.test(otp)) {
            res.status(400).json({ message: "Enter a valid six-digit OTP." });
            return;
        }

        if (!secret) {
            res.status(500).json({ message: "Server configuration error." });
            return;
        }

        const user = await UserModel.findOne({ email }).select("+resetOtpHash");

        if (!user || !user.isActive || !user.resetOtpHash) {
            res.status(400).json({ message: "Invalid or expired OTP." });
            return;
        }

        if (
            !user.resetOtpExpiresAt ||
            user.resetOtpExpiresAt.getTime() <= Date.now()
        ) {
            clearResetOTP(user);
            await user.save();

            res.status(400).json({ message: "OTP has expired. Request a new one." });
            return;
        }

        if ((user.resetOtpAttempts || 0) >= MAX_OTP_ATTEMPTS) {
            clearResetOTP(user);
            await user.save();

            res.status(400).json({
                message: "Too many incorrect attempts. Request a new OTP.",
            });
            return;
        }

        const submittedHash = Buffer.from(getOTPHash(otp, secret), "hex");
        const storedHash = Buffer.from(user.resetOtpHash, "hex");

        const isValid =
            submittedHash.length === storedHash.length &&
            timingSafeEqual(submittedHash, storedHash);

        if (!isValid) {
            user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;

            if (user.resetOtpAttempts >= MAX_OTP_ATTEMPTS) {
                clearResetOTP(user);
            }

            await user.save();

            res.status(400).json({ message: "Incorrect OTP." });
            return;
        }

        // OTP can only be used once.
        clearResetOTP(user);
        await user.save();

        // A separate, short-lived token is required to reset the password.
        const resetToken = jwt.sign(
            { purpose: "password-reset" },
            secret,
            {
                subject: user._id.toString(),
                expiresIn: "10m",
            }
        );

        res.status(200).json({
            message: "OTP verified successfully.",
            resetToken,
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Something went wrong." });
    }
};


// STEP 3: Reset password
export const resetPassword: RequestHandler = async (req, res) => {
    try {
        const { resetToken, password } = req.body;
        const secret = process.env.JWT_SECRET;

        if (!resetToken || !password) {
            res.status(400).json({
                message: "Reset token and new password are required.",
            });
            return;
        }

        if (typeof password !== "string" || password.length < 8) {
            res.status(400).json({
                message: "Password must be at least 8 characters long.",
            });
            return;
        }

        if (!secret) {
            res.status(500).json({ message: "Server configuration error." });
            return;
        }

        const decoded = jwt.verify(resetToken, secret);

        if (
            typeof decoded === "string" ||
            decoded.purpose !== "password-reset" ||
            !decoded.sub
        ) {
            res.status(401).json({ message: "Invalid or expired reset session." });
            return;
        }

        const user = await UserModel.findById(decoded.sub);

        if (!user || !user.isActive) {
            res.status(400).json({ message: "Unable to reset password." });
            return;
        }

        user.passwordHash = await bcrypt.hash(password, 12);
        user.mustChangePassword = false;

        clearResetOTP(user);
        await user.save();

        res.status(200).json({
            message: "Password reset successfully. You can now log in.",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(401).json({
            message: "Invalid or expired reset session. Please verify your OTP again.",
        });
    }
};