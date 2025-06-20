// Third party libraries
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// routes imports
import authRoutes from './routes/auth.routes'
import accountRoutes from './routes/accounts/accouts.routes';
import postRoutes from './routes/posts/posts.routes'

// DB connections
import { connectDB } from "./dataBase/connection";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});
connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
