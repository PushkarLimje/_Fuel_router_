import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    // origin: process.env.CORS_ORIGIN,
    origin:"http://localhost:5173" ,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

// app.use("/api/v1/users", userRouter);
app.use("/api/v1/users", userRouter);

app.use((err, req, res, next) => {
  console.error("🔥 Error caught:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

export { app };
