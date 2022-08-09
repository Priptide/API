import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

export interface Record {
    _id?: number;
    UUID: string;
    chat: Chat;
    name: string;
    session_id: string;
    is_active: boolean;
}

export interface Chat {
    _id?: number;
    language: string;
    conversation: Array<Message>;
}

export interface Message {
    text: string;
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
