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
    if (isConnected) return;

    if (mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }

    await mongoose.connect(MONGODB_URI, {
        dbName: "devjournal",
    });

    isConnected = true;
};
