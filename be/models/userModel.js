// models/userModel.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        uid: {
            type: String, required: [true, "uid from firebase is required"], unique: true
        }, 
        email: {
            type: String, required: [true, "email from firebase is required"], unique: true
        },
        name: {
            type: String, required: [true, "name from firebase is required"],
        },
        role: {
            type: String, enum: ["admin", "user"], default: "user"
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
