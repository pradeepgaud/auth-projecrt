// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import cookieParser from "cookie-parser";
// import connectDB from "./Config/Mongodb.js";
// import authRouter from "./Routes/AuthRoutes.js";
// import userRouter from "./Routes/UserRoutes.js";

// const app = express();
// const port = process.env.PORT || 4000;

// // Connect DB
// connectDB();

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());

// // ✅ CORS CONFIG (SINGLE & CORRECT)
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (Postman, mobile apps, server-to-server)
//       if (!origin) return callback(null, true);

//       // Allow localhost
//       if (origin === "http://localhost:5173") {
//         return callback(null, true);
//       }

//       // Allow ALL Vercel domains
//       if (origin.endsWith(".vercel.app")) {
//         return callback(null, true);
//       }

//       // Block others
//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true, // Cookies allow karne ke liye
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Routes
// app.get("/", (req, res) => {
//   res.send("Backend Connected Successfully!");
// });

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

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
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile app, server)
      if (!origin) return callback(null, true);

      // Allow localhost directly
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // Allow wildcard domains (Vercel / Render / Netlify)
      if (
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app") ||
        origin.endsWith(".onrender.com")
      ) {
        return callback(null, true);
      }

      // Otherwise block
      return callback(new Error("❌ Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
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
