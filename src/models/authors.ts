import mongoose, { Schema, Document } from "mongoose";

export interface IAuthor extends Document {
  name: string;
  profileImage?: string;
  email: string;
  password: string;
  bio?: string;
  role: "authorAdmin" | "author";
}

const AuthorSchema = new Schema<IAuthor>({
  name: { type: String, required: true },
  profileImage: { type: String },
  bio: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["authorAdmin", "author"], default: "authorAdmin" },
}, { timestamps: true });

const Author = mongoose.model<IAuthor>("Author", AuthorSchema);
export default Author;