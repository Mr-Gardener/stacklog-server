import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    bio: { type: String },                  
    profileImage: { type: String },         
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, enum: ["superAdmin", "authorAdmin", "moderatorAdmin"], required: true,},
    // model: {type: String, enum: ["superAdmin", "authorAdmin", "moderatorAdmin"], required: true,},
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;

