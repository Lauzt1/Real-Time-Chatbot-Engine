// src/models/admin.js
import mongoose, { Schema, models } from 'mongoose';

const adminSchema = new Schema(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
    }, {
        timestamps: true,
    }
);

const Admin = models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;