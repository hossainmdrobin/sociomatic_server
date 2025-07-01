// src/UserPayload.ts
export interface UserPayload {
    id: string;
    email: string;
    role: string;
    admin: string | null;
    // [key: string]: any;
  }
  