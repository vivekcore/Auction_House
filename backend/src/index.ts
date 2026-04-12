import { type Application } from "express";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./db/db.js";
import rootRouter from "./routes/index.js";
import { toNodeHandler } from "better-auth/node";
import { createAuth, getAuth } from "./auth/auth.js";
import { startExpirationJob } from "./utils/expirationScheduler.js";
import { errorHandler } from "./middleware/error.middleware.js";
const app: Application = express();

dotenv.config();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.listen(process.env.PORT, async () => {
  try {
    await ConnectDB();
    createAuth();
    const auth = getAuth();
    app.all("/api/v1/auth/{*path}", toNodeHandler(auth));
    app.use("/api/v1", rootRouter);
    app.use(errorHandler);
    console.log("Connected to DB & listning at port " + process.env.PORT);
    startExpirationJob();
  } catch (error) {
    console.log(error + " Connection failed");
  }
});