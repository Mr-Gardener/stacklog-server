import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1] || req.cookies.access_token;

  if (!token) {
    console.log("❌ No token provided");
     res.status(401).json({ message: "No token provided" });
     return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
      model: string;
    };

    if (
      !["superAdmin", "authorAdmin", "moderatorAdmin"].includes(decoded.role) ||
      !["Admin", "Author"].includes(decoded.model)
    ) {
      res.status(403).json({ message: "Invalid token payload" });
      return;
    }

    req.user = decoded as {
      id: string;
      role: "superAdmin" | "authorAdmin" | "moderatorAdmin";
      model: "Admin" | "Author";
    };
    next();
  } catch (err) {
    console.log("❌ Invalid token:", err);
    res.status(401).json({ message: "Invalid token" });
    return ;
  }
};