import { Request, Response } from "express";
import { AuthRequest } from "../types/express/index";
import Admin from "../models/admin";
import Author from "../models/authors";
import "../models/admin";     
import "../models/authors";

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id, role } = user;

    if (role === "superAdmin") {
      const superAdmin = await Admin.findById(id).select("-password");
      if (!superAdmin) {
        res.status(404).json({ message: "Admin not found" });
        return;
      }
      res.status(200).json(superAdmin);
      return;
    }

    if (role === "authorAdmin") {
      const author = await Author.findById(id).select("-password");
      if (!author) {
        res.status(404).json({ message: "Author not found" });
        return;
      }
      res.status(200).json(author);
      return;
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthRequest).user;

    if (!user || !user.id || !user.role) {
       res.status(401).json({ message: "Unauthorized" });
       return;
    }

    const { name, bio } = req.body;
    const profileImage = req.file ? (req.file as any).path : req.body.profileImage;

    const updateData: Record<string, any> = { name };
    if (bio) updateData.bio = bio;
    if (profileImage) updateData.profileImage = profileImage;

    let updated;
    if (user.role === "superAdmin") {
      updated = await Admin.findByIdAndUpdate(user.id, updateData, {
        new: true,
      }).select("-password");
    } else if (user.role === "authorAdmin") {
      updated = await Author.findByIdAndUpdate(user.id, updateData, {
        new: true,
      }).select("-password");
    } else {
       res.status(400).json({ message: "Invalid role" });
       return;
    }

    if (!updated) {
       res.status(404).json({ message: "User not found" });
       return;
    }

     res.status(200).json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error("Profile update error:", err);
     res.status(500).json({ message: "Server error" });
  }
};