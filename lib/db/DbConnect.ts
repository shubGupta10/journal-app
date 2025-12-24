import mongoose from "mongoose";

const MONGODB_URI =
    process.env.NODE_ENV === "production"
        ? process.env.DB_PROD_URL!
        : process.env.DB_LOCAL_URL!;

if (!MONGODB_URI) {
    throw new Error("Missing MongoDB connection string");
}

let isConnected = false;

export const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) return;

    if (mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "journal-app",
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            family: 4,
        });

        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        isConnected = false;
        throw error;
    }
};
