import mongoose from "mongoose";
import { env } from "./env";

export async function connectToDatabase(): Promise<void> {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB");
}


