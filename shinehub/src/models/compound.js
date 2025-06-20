import mongoose, { Schema, models } from 'mongoose';

const compoundSchema = new Schema(
    {
        name:           {type: String, required: true},
        code:           {type: String, required: true},
        size:           {type: Number, required: true},
        description:    {type: String, required: true},
    }, {
        timestamps: true,
    }
);

const Compound = models.Compound || mongoose.model("Compound", compoundSchema);
export default Compound;