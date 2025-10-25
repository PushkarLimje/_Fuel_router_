import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import routeRouter from "./routes/route.routes.js";
import reportRouter from "./routes/report.routes.js";

const app = express();

app.use(
  cors({
    // origin: process.env.CORS_ORIGIN,
    origin:"http://localhost:5173" ,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(express.static("public"));

app.use(cookieParser());

// app.use("/api/v1/users", userRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/routes", routeRouter);
app.use("/api/v1/reports", reportRouter);

app.use((err, req, res, next) => {
  console.error("🔥 Error caught:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

export { app };
