import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "superAdmin" | "authorAdmin" | "moderatorAdmin";
        model: "Admin" | "Author";
      };
    }
  }
}

export {};

