import mongoose, { Schema, models } from 'mongoose';

const messageSchema = new Schema(
    {
        name:           {type: String, required: true},
        email:          {type: String, required: true},
        phoneNumber:    {type: Number, required: true},
        companyName:    {type: String, required: true},
        message:        {type: String, required: true},
    }, {
        timestamps: true,
    }
);

const Message = models.Message || mongoose.model("Message", messageSchema);
export default Message;