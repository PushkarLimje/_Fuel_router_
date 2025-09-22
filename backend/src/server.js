import express from "express";
import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("ERROR", (error) => {
      // for error not connecting
      console.error("ERROR:", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`**       Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });

// app.get('/', (req, res) => {
//     res.send('server is ready ');
// })
// const port = process.env.PORT || 8000 ;

// app.listen(port, ()=> {
//     console.log(`serve at http://localhost:${port}`)
// })
