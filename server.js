import express from "express";
import { configDotenv } from "dotenv";
import authRoutes from "./routes/auth.route.js";
import bookRoutes from "./routes/book.route.js";
import searchRoutes from "./routes/search.route.js";
import { protectedRoute } from "./middleware/protectedRoute.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

configDotenv();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/book", protectedRoute, bookRoutes);
app.use("/api/search", protectedRoute, searchRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Bookstore!");
});

app.listen(PORT, async () => {
  console.log(`Server is listening at port ${PORT}`);
  await connectDB();
});
