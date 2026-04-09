import { Institute } from './models/institute.model';
// src/UserPayload.ts
export interface UserPayload {
    id: string;
    email: string;
    role: string;
    admin: string | null;
    institute?: string | null;
    // [key: string]: any;
  }
  