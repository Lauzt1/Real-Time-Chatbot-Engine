import mongoose, { Schema, models } from 'mongoose';

const polisherSchema = new Schema(
    {
        name:           {type: String, required: true},
        backingpad:     {type: Number, required: true},
        orbit:          {type: Number, required: true},
        power:          {type: Number, required: true},
        rpm:            {type: String, required: true},
        weight:         {type: Number, required: true},
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

const Polisher = models.Polisher || mongoose.model("Polisher", polisherSchema);
export default Polisher;