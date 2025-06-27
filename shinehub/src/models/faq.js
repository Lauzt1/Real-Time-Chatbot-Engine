import mongoose, { Schema, models } from 'mongoose';

const faqSchema = new Schema(
    {
        question:   { type: String, required: true },
        answer:     { type: String, required: true },
        contextType:{ type: String, required: true },
        contextKey: { type: String, required: false },
        priority:   { type: Number, default: 0 },
    }, {
        timestamps: true,
    }
);

const Faq = models.Faq || mongoose.model("Faq", faqSchema);
export default Faq;