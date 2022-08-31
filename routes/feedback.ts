import FeedbackService from "../services/feedback";
import express from "express";

//Setup a router
const feedback_routes = express.Router();

//Route for sending feedback too the server.
feedback_routes.post("/send", async (req, res, next) => {
    try {
        //Attempt to upload new feedback
        let output = await FeedbackService.create_feedback(
            req.body.score,
            req.body.session_id,
            req.body.comment
        );

        //If successful return the id of this feedback and a message
        res.status(200).json({
            message: "Feedback successfully uploaded",
            id: output._id,
        });
    } catch (error: any) {
        //Check if it is a known error.
        if (error.message == "Missing session id") {
            error.status = 401;
        } else if (error.message == "Invalid session id") {
            error.status = 401;
        } else if (error.message == "Invalid score") {
            error.status = 401;
        } else if (error.message == "Feedback already received") {
            error.status = 401;
        }

        //Move too the next value.
        next(error);
    }
});

//Route for getting the current feedback statistics.
feedback_routes.get("/stats", async (req, res, next) => {});
