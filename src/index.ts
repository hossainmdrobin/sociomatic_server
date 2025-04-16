import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes'
import { connectDB } from "./dataBase/connection";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});
connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
