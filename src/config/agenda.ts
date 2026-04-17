import mongoose from "mongoose";
import agendaDefault from "agenda";

const AgendaConstructor = typeof agendaDefault === "function" 
  ? agendaDefault 
  : (agendaDefault as any).Agenda || ((agendaDefault as any).default as any);

const agenda = new AgendaConstructor({
  mongo: mongoose.connection,
  collection: "agendaJobs",
  defaultConcurrency: 5,
  maxConcurrency: 10,
  defaultLockLifetime: 10 * 60 * 1000,
});

agenda.on("error", (error: Error) => {
  console.error("[Agenda] Error:", error);
});

interface JobAttributes {
  data?: Record<string, unknown>;
  unique?: boolean;
  uniqueOpts?: Record<string, unknown>;
  disable?: boolean;
}

interface Job<T = unknown> {
  attrs: JobAttributes;
  save: () => Promise<Job<T>>;
  remove: () => Promise<Job<T>>;
  run: () => Promise<void>;
  fail: (err: string | Error) => void;
  isRunning: () => Promise<boolean>;
  schedule: (date: Date | string) => Job<T>;
  repeatEvery: (interval: string, options?: Record<string, unknown>) => Job<T>;
  priority: (priority: number) => Job<T>;
  nextRunAt: () => Date | null;
  lastRunAt: () => Date | null;
  lastFinishedAt: () => Date | null;
  failedAt: () => Date | null;
  failReason: () => string | null;
}

export type { Job };
export default agenda;
