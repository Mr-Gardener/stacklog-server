import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  coverImage: string;
  tags?: string[];
  author: Types.ObjectId;
  authorModel: "Admin" | "Author";
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    tags: { type: [String], required: false },
    author: {
      type: Schema.Types.ObjectId,
      refPath: "authorModel", 
      required: true,
    },
    authorModel: {
      type: String,
      enum: ["Author", "Admin"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);