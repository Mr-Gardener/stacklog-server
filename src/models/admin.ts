import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["admin", "author"], default: "author" }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
