import { RequestHandler } from "express";

export const requireRole = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    // @ts-ignore
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};

