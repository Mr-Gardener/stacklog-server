import { Request, Response } from "express";
import Author from "../models/authors";

export const createAuthorAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(400).json({ message: "Author with this email already exists." });
    }

    const newAuthor = new Author({
      name,
      email,
      password, // You should hash this in a real app
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

export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Delete Author Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
