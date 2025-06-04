// declare namespace Express {
//   export interface Request {
//     user?: {
//       id: string;
//       role: "admin" | "author";
//     };
//   }
// }


import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}