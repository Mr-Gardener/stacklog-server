import mongoose, {Document} from "mongoose";
import  {  Schema, Types } from "mongoose";


export interface IPost extends Document {
    title: string;
    content: string;
    coverImage?: string;
    tags?: string[];
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    
}

const PostSchema = new mongoose.Schema<IPost>(
    {
        title: {type: String, required: true},
        content: {type: String, required: true },
        coverImage: {type: String, required: true},
        tags: {type: [String], required: true},
        author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    }, 
    {timestamps: true}
);

export default mongoose.model<IPost>("Post", PostSchema);