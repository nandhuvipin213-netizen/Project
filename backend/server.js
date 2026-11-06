import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authroutes.js";
import testRoutes from "./routes/testRoutes.js";
import vehicleRoutes from "./routes/vehicleRouter.js";
import shipmentRouter from "./routes/shipmentroutes.js";
import vehicleLocationRoutes from "./routes/vehicleLocationRoutes.js";
dotenv.config();
const app = express();
app.use((req, res, next) => {
    console.log("Request URL:", req.originalUrl);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request Body:", req.body);
    next();
});
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/shipments", shipmentRouter);
app.use("/api/vehicle-locations", vehicleLocationRoutes);
app.get("/", (req, res) => {
    res.status(202).json({
        success: true,
        message: "Smart-logistics api running"
    });
});
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map