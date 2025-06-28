// src/models/enquiry.js
import mongoose, { Schema, models } from "mongoose";

const enquirySchema = new Schema(
  {
    category: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    companyName: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "responded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = models.Enquiry || mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
