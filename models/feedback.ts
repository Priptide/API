import { Schema, Types, model } from "mongoose";

export interface Feedback {
    _id?: Types.ObjectId;
    score: number;
    comment?: string;
    session_id: string;
}

const feedbackSchema = new Schema<Feedback>({
    score: { type: Number, required: true },
    comment: String,
    session_id: { type: String, required: true, unique: true },
});

export default model<Feedback>("Feedback", feedbackSchema);
