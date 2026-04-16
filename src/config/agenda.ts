import Agenda from "agenda";
import mongoose from "mongoose";

const agenda = new Agenda({
  mongo: mongoose.connection,
  collection: "agendaJobs",
  defaultConcurrency: 5,
  maxConcurrency: 10,
  defaultLockLifetime: 10 * 60 * 1000,
});

agenda.on("error", (error) => {
  console.error("[Agenda] Error:", error);
});

export default agenda;
