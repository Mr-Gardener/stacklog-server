import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express/index";
import cookieParser from "cookie-parser";

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  
  if (!token) {
     res.status(401).json({ message: "No token provided" });
     return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as { id: string; role: string };
    next();
  } catch (err) {
     res.status(401).json({ message: "Invalid token" });
  }
};
