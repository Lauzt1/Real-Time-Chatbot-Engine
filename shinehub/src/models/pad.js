import mongoose, { Schema, models } from 'mongoose';

const padSchema = new Schema(
    {
        name:           {type: String, required: true},
        code:           {type: String, required: true},
        size:           {type: Number, required: true},
        colour:         {type: String, required: false},
        description:    {type: String, required: true},
    }, {
        timestamps: true,
    }
);

const Pad = models.Pad || mongoose.model("Polishing Pad", padSchema);
export default Pad;