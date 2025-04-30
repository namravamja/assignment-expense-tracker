import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MongoDB URI is missing!");
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};
