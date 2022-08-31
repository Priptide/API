import FeedbackModel, { Feedback } from "../models/feedback";

import RecordModel from "../models/record";

//Function for creating feedback
async function create_feedback(
    score: number,
    session_id: string,
    comment?: string
) {
    //Check the score is between 0 and 5.
    if (score < 0 || score > 5) throw new Error("Invalid score");

    //Check we have a non empty session id.
    if (!session_id) throw new Error("Missing session id");

    //Check this session id is valid.
    const record = await RecordModel.findOne({ session_id: session_id });

    //If no previous record throw an error.
    if (!record) throw new Error("Invalid session id");

    //Check that we haven't already had feedback from this session.
    const previous_feedback = await FeedbackModel.findOne({
        session_id: session_id,
    });

    //If we have already sent feedback throw an error.
    if (previous_feedback) throw new Error("Feedback already received");

    //Create a model for the new feedback.
    let new_feedback: Feedback = {
        score: score,
        session_id: session_id,
        comment: comment,
    };

    //Save this model too the database
    const saved_obj = await new FeedbackModel(new_feedback).save();

    //Return the feedback object
    return saved_obj;
}

export default { create_feedback };
