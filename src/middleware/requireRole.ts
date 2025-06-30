import { RequestHandler } from "express";
import { AuthRequest } from "../types/express/index";

export const requireRole = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = (req as AuthRequest).user;

    if (user && roles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};

