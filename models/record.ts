import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

interface Record {
    _id: number;
    UUID: String;
    chat: Chat;
    name: String;
    session_id: String;
    is_active: boolean;
}

interface Chat {
    _id: number;
    language: String;
    conversation: Array<Message>;
}

interface Message {
    text: String;
    time: Date;
    is_bot: boolean;
}

const recordSchema = new Schema<Record>({
    UUID: {
        type: String,
        required: true,
    },
    chat: [
        {
            language: { type: String, required: true },
            conversation: [
                {
                    text: { type: String, required: true },
                    time: { type: Date, required: true },
                    is_bot: { type: Boolean, required: true },
                },
            ],
        },
    ],
    session_id: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true,
    },
});

export default model("Record", recordSchema);
