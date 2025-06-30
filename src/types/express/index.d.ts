import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "superAdmin" | "authorAdmin" | "moderatorAdmin";
    model: "Admin" | "Author";
  };
}


