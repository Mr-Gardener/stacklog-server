import { Request, Response } from "express";
import Author from "../models/authors";
import bcrypt from "bcryptjs";
import Post from "../models/Post";


export const createAuthorAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      res.status(400).json({ message: "Author with this email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // ✅ Hash password

    const newAuthor = new Author({
      name,
      email,
      password: hashedPassword,
      role: "authorAdmin",
    });

    await newAuthor.save();

    res.status(201).json({ message: "Author admin created successfully", author: newAuthor });
  } catch (error) {
    console.error("Create Author Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Author.find().select("-password"); // Don’t return passwords
    res.status(200).json(authors);
  } catch (error) {
    console.error("Get All Authors Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Delete Author Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAuthorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id).lean();

    if (!author) {
       res.status(404).json({ message: "Author not found" });
       return;
    }

    const postCount = await Post.countDocuments({ author: id });

    res.status(200).json({
      _id: author._id,
      name: author.name,
      email: author.email,
      bio: author.bio,
      profileImage: author.profileImage,
      postCount,
    });
  } catch (err) {
    console.error("Error fetching author by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};
