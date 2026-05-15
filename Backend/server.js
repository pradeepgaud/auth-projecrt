// // import express from "express";
// // import cors from "cors";
// // import "dotenv/config";
// // import cookieParser from "cookie-parser";
// // import connectDB from "./Config/Mongodb.js";
// // import authRouter from "./Routes/AuthRoutes.js";
// // import userRouter from "./Routes/UserRoutes.js";

// // const app = express();
// // const port = process.env.PORT || 4000;

// // // ---------------- DB CONNECT ----------------
// // connectDB();

// // // ---------------- MIDDLEWARES ----------------
// // app.use(express.json());
// // app.use(cookieParser());

// // // ------------ ALLOWED FRONTEND ORIGINS ---------
// // const allowedOrigins = [
// //   "http://localhost:5173", // Local frontend
// //   "http://localhost:3000",
// //   "https://*.vercel.app", // Any Vercel domain
// //   "https://*.netlify.app", // Netlify
// //   "https://*.onrender.com", // Render
// // ];

// // // ------------- CORS CONFIG --------------------
// // // app.use(
// // //   cors({
// // //     origin: ["http://localhost:5173", "https://auth-projecrt.vercel.app"],
// // //     credentials: true,
// // //   }),
// // // );

// // app.use(
// //   cors({
// //     origin: [
// //       "http://localhost:5173",
// //       "https://auth-projecrt-git-main-pradeep-gauds-projects.vercel.app",
// //     ],
// //     credentials: true,
// //   }),
// // );

// // // ---------------- ROUTES ----------------
// // app.get("/", (req, res) => {
// //   res.send("Backend Connected Successfully!");
// // });

// // app.use("/api/auth", authRouter);
// // app.use("/api/user", userRouter);

// // // ---------------- START APP ----------------
// // app.listen(port, () => {
// //   console.log(`🚀 Server running on port ${port}`);
// // });

// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import cookieParser from "cookie-parser";

// import connectDB from "./Config/Mongodb.js";
// import authRouter from "./Routes/AuthRoutes.js";
// import userRouter from "./Routes/UserRoutes.js";

// const app = express();

// connectDB();

// app.use(express.json());
// app.use(cookieParser());

// // app.use(
// //   cors({
// //     origin: [
// //       "http://localhost:5173",
// //       "https://auth-projecrt-git-main-pradeep-gauds-projects.vercel.app",
// //     ],
// //     credentials: true,
// //   }),
// // );

// app.use(
//   cors({
//     origin: "https://auth-projecrt.vercel.app",
//     credentials: true,
//   }),
// );

// app.get("/", (req, res) => {
//   res.send("Backend Connected Successfully!");
// });

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);

// const port = process.env.PORT || 4000;

// app.listen(port, () => {
//   console.log(`Server running on ${port}`);
// });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./Config/mongodb.js";
import authRouter from "./Routes/AuthRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

const app = express();

// ── Connect DB ────────────────────────────────────────────────────────────────
connectDB();

// ── CORS — this is the #1 reason userData is null in production ──────────────
// Without credentials: true here, the browser BLOCKS the Set-Cookie header
// even if the frontend sends withCredentials: true
const allowedOrigins = [
  process.env.FRONTEND_URL, // e.g. https://auth-projecrt.vercel.app
  "http://localhost:5173", // local dev
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true, // ✅ REQUIRED — allows cookies to be sent/received cross-origin
  }),
);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("API is running"));

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
