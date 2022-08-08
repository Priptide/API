import { Timestamp } from "mongodb";
import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

export interface Record {
    _id?: number;
    UUID: String;
    chat: Chat;
    name?: String;
}

export interface Chat {
    _id?: number;
    language: String;
    conversation: Array<Message>;
}

export interface Message {
    text: String;
    time: Date;
    is_bot: boolean;
}

const recordSchema = new Schema<Record>({
    UUID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
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
});

export default model("Record", recordSchema);
