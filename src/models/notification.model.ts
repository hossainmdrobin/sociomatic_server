import { Schema, model, Document } from "mongoose";

export interface INotification extends Document {
  user: string; // user who receives the notif
  title: string;
  message: string;
  action?: string; // e.g., "OPEN_POST", "FOLLOW_USER"
  link?: string;   // URL or app route
  read: boolean;
  createdAt: Date;
}
