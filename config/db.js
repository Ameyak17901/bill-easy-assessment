import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";
import { configDotenv } from "dotenv";

configDotenv()

export async function connectDB() {
  try {
    if(!ENV_VARS.MONGODB_URI){
        throw new Error("URI not found");
    }
    const conn = await mongoose.connect(ENV_VARS.MONGODB_URI);
    console.log(`Connected to database: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
