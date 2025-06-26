import mongoose, { Schema, models } from 'mongoose';

const padSchema = new Schema(
    {
        name:           {type: String, required: true},
        code:           {type: String, required: true},
        size:           {type: Number, required: true},
        properties:     {type: String, required: true},
        colour:         {type: String, required: true},
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

const Pad = models.Pad || mongoose.model("Pad", padSchema);
export default Pad;