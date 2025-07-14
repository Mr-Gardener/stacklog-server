import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  coverImage: string;
  tags?: string[];
  status?: "draft" | "published";
  author: Types.ObjectId;
  authorModel: "Admin" | "Author";
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    author: {
      type: Schema.Types.ObjectId,
      refPath: "authorModel",
      required: true,
    },
    authorModel: {
      type: String,
      enum: ["Admin", "Author"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
