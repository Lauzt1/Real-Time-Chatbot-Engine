import mongoose, { Schema, models } from 'mongoose';

const polisherSchema = new Schema(
    {
        name:           {type: String, required: true},
        backingpad:     {type: Number, required: true},
        orbit:          {type: Number, required: true},
        power:          {type: Number, required: true},
        rpm:            {type: String, required: false},
        weight:         {type: Number, required: true},
        description:    {type: String, required: true},
        imageUrl:       {type: String, required: false},
    }, {
        timestamps: true,
    }
);

const Polisher = models.Polisher || mongoose.model("Polisher", polisherSchema);
export default Polisher;