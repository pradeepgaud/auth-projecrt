import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./Config/Mongodb.js";
import authRouter from "./Routes/AuthRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// ---------------- DB CONNECT ----------------
connectDB();

// ---------------- MIDDLEWARES ----------------
app.use(express.json());
app.use(cookieParser());

// ------------ ALLOWED FRONTEND ORIGINS ---------
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "http://localhost:3000",
  "https://*.vercel.app", // Any Vercel domain
  "https://*.netlify.app", // Netlify
  "https://*.onrender.com", // Render
];

// ------------- CORS CONFIG --------------------
app.use(
  cors({
    origin: ["http://localhost:5173", "https://auth-projecrt.vercel.app"],
    credentials: true,
  }),
);

// ---------------- ROUTES ----------------
app.get("/", (req, res) => {
  res.send("Backend Connected Successfully!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ---------------- START APP ----------------
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
