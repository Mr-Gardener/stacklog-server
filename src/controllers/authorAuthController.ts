// import { RequestHandler } from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import Author from "../models/authors"; 

// export const loginAuthor: RequestHandler = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const author = await Author.findOne({ email });
//     if (!author) {
//       res.status(404).json({ message: "Invalid credentials" });
//       return;
//     }

//     const isMatch = await bcrypt.compare(password, author.password);
//     if (!isMatch) {
//       res.status(401).json({ message: "Invalid credentials" });
//       return;
//     }

//     const token = jwt.sign(
//       { id: author._id, role: author.role },
//       process.env.JWT_SECRET!,
//       { expiresIn: "2h" }
//     );

//     res.cookie("access_token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: false,
//       maxAge: 2 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: author._id,
//         email: author.email,
//         role: author.role,
//       },
//     });
//   } catch (error) {
//     console.error("Author login error:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
