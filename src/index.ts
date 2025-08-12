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

// Custom functions
import agenda from "./agendaConfig";
import schedulePost from "./jobs/schedulePost";
import defineFacebookJob from "./jobs/postToFacebook";
import { publishPost } from "./jobs/publishPost";

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

connectDB();

agenda.define("agenda running", () => {
  console.log("Agenda is running");
});

// Ensure the agenda is connected to the database before starting
agenda.on('ready', () => {
  console.log("Agenda is ready");
});

// Starting agenda after the database connection
(async() => {
  await agenda.start();
  console.log("Agenda started");
  schedulePost(agenda);
  publishPost(agenda)
  console.log("Scheduled post job defined");
  defineFacebookJob(agenda);
  console.log("Facebook job defined");
  await agenda.every('30 seconds', 'schedule post');
  await agenda.now('schedule post', {});
  await agenda.every('1 second', 'agenda running');
  console.log("Scheduled post job will run every second");
})();


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
