import { type Application } from "express";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import rootRouter from "./routes/index.js";
const app: Application = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(process.env.PORT, async () => {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    console.log("Connected to DB & listning at port " + process.env.PORT);
  } catch (error) {
    console.log(error + " Connection failed");
  }
});
