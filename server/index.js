import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import postRoutes from "./routes/post.js";
import userRoutes from "./routes/user.js";

const app = express();

dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 5000;

connectDB();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello to Vacation Experience API");
});

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
