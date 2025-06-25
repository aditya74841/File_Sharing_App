import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes/routes.js";
import cors from "cors";
import DBConnection from "./database/db.js";
import { errorMiddleware } from "./middleware/error.js";

const app = express();
app.use(cors());
app.use(express.json()); // optional, but recommended

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await DBConnection(); // wait for DB connection before moving forward
    console.log("✅ Database connected");

    app.use("/", router); // register routes AFTER DB is connected
    app.use(errorMiddleware); // register error handler

    app.listen(PORT, () => {
      console.log(`🚀 Server listening at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1); // optional: exit app if DB fails
  }
};
app.get("/", (req, res) => {
  res.send("<h1>Server is running perfectly</h1>");
});
startServer();
