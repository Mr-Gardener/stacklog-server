import mongoose, {Document} from "mongoose";

export interface IPost extends Document {
    title: string;
    content: string;
    coverImage?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>(
    {
        title: {type: String, required: true},
        content: {type: String, required: true },
        coverImage: String,
        tags: [String],
    }, {timestamps: true}
);

export default mongoose.model<IPost>("Post", PostSchema);