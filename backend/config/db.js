import mongoose from "mongoose";
const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        throw new Error("MONGODB_URI is missing from .env");
    }
    await mongoose.connect(mongoURI);
    console.log("mongoDB connected successfully");
};
export default connectDB;
//# sourceMappingURL=db.js.map