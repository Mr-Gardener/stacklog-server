import mongoose, { Document, Types } from "mongoose";

export interface IComment extends Document{
    postId: Types.ObjectId;
    authorName: string;
    email: string;
    content: string;
    status: "pending" | "approved" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}

    const CommentSchema = new mongoose.Schema<IComment>(
        {
            postId: {type: mongoose.Schema.Types.ObjectId, ref: "post", required: true},
            authorName: {type: String, required: true},
            content: {type: String, required: true},
            status: {
                type: String,
                enum: ["pending", "approved", "rejected"],
                default: "pending"
            }
        },
        { timestamps: true }
    );

    export default mongoose.model<IComment>("comment", CommentSchema)