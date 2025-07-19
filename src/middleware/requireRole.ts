import { RequestHandler } from "express";

export const requireRole = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = req.user;

    if (user && roles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};