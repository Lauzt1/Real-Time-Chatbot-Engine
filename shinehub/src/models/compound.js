import mongoose, { Schema, models } from 'mongoose';

const compoundSchema = new Schema(
    {
        name:           {type: String, required: true},
        code:           {type: String, required: true},
        size:           {type: Number, required: true},
        properties:     {type: String, required: true},
        type:           {type: String, required: true},
        description:    {type: String, required: true},
        images: [{
            url:      { type: String, required: true },
            publicId: { type: String, required: true },
        }],
    }, {
        timestamps: true,
    }
);

const Compound = models.Compound || mongoose.model("Compound", compoundSchema);
export default Compound;