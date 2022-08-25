import mongoose, { Model, Types, model } from "mongoose";
const { Schema } = mongoose;

export interface Record {
    _id?: Types.ObjectId;
    UUID: string;
    chat: Chat;
    name?: string;
    session_id: string;
    is_active: boolean;
}

export interface Chat {
    _id?: Types.ObjectId;
    language: string;
    conversation: Array<Message>;
}

export interface Message {
    text: string;
    time: Date;
    is_bot: boolean;
}

interface RecordMethods {
    add_message(is_bot: boolean, message: string): Date;
    last_active(): Date;
}

type RecordModel = Model<Record, {}, RecordMethods>;

const recordSchema = new Schema<Record, RecordModel, RecordMethods>({
    UUID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    chat: {
        language: { type: String, required: true },
        conversation: [
            {
                text: { type: String, required: true },
                time: { type: Date, required: true },
                is_bot: { type: Boolean, required: true },
            },
        ],
    },
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

recordSchema.method(
    "add_message",
    function (is_bot: boolean, message: string): Date {
        //Create a new message element.
        const local_message: Message = {
            text: message,
            time: new Date(Date.now()),
            is_bot: is_bot,
        };

        //Add this message element too the record schema.
        this.chat.conversation.push(local_message);

        return local_message.time;
    }
);

recordSchema.method("last_active", function (): Date {
    //Check the length of messages is greater than zero if not return when the document was created
    if (this.chat.conversation.length == 0) return this._id.getTimestamp();

    //Find the last message we have added
    const final_message: Message =
        this.chat.conversation[this.chat.conversation.length - 1];

    //Return the time of this message
    return final_message.time;
});

export default model<Record, RecordModel>("Record", recordSchema);
