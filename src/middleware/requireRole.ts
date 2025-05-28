import { RequestHandler } from "express";

export const requireRole = (role: string): RequestHandler => {
  return (req, res, next) => {
    // @ts-ignore
    if (req.user?.role === role) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};
