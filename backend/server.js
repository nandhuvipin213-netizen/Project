
import express from "express";
import "dotenv/config";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authroutes.js";
import testRoutes from "./routes/testRoutes.js";
import vehicleRoutes from "./routes/vehicleRouter.js";
import shipmentRouter from "./routes/shipmentroutes.js";
import vehicleLocationRoutes from "./routes/vehicleLocationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(cors());

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = Buffer.from(buf);
    },
  })
);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/shipments", shipmentRouter);
app.use("/api/vehicle-locations", vehicleLocationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Logistics API running",
  });
});

const PORT = Number(process.env.PORT) || 5000;

if (!process.env.VERCEL) {
  const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  };

  startServer().catch((error) => {
    console.error("Server startup failed:", error);
    process.exit(1);
  });
}

export default app;
