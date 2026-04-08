import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.DB_URL as string;
if (!uri) {
  throw new Error("DB_URL is not defined in .env");
}

const options = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
};

export async function ConnectDB() {
  try {
    await mongoose.connect(uri, options);
    console.log("MongoDB connected successfully to database:",mongoose.connection.db?.databaseName,
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

export default mongoose;
export { mongoose };
