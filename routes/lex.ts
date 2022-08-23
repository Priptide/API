import express from "express";
import LexService from "../services/lex";
import RecordService from "../services/record";

//Setup a router
const lex_routes = express.Router();

//Route for sending a message to lex
lex_routes.post("/send", async (req, res, next) => {
    try {
        //Create a new record for this chat or find the current one.
        const { id, session_id, uuid } = await RecordService.find_or_create(
            req.body.language ?? "en_GB",
            req.body.name,
            req.body.uuid,
            req.body.session_id
        );

        //Get all possible intentions.
        const { message, alternateButtons } = await LexService.send_message(
            req.body.message ?? "",
            session_id,
            req.body.language ?? "en_GB"
        );

        //If there is a message send it back or return an error otherwise.
        if (message) {
            res.status(200).json({
                uuid: uuid,
                session_id: session_id,
                message: message,
                alternateButtons: alternateButtons,
            });
        } else {
            res.status(500).json({
                message: "Internal Server Error - No Results Found",
            });
        }
    } catch (error: any) {
        //Check if it is a known error.
        if (error.message == "Missing session id") {
            error.status = 401;
        } else if (error.message == "No valid message") {
            error.status = 401;
        } else if (error.message == "Invalid session id") {
            error.status = 401;
        }

        //Move too the next value.
        next(error);
    }
});

//This route is used to end an active lex session
lex_routes.post("/end", async (req, res, next) => {
    try {
        //Attempt to end the current session
        await LexService.end_session(req.body.session_id, req.body.uuid);

        //Assuming this is done we just return a successful result
        res.status(200).json({
            message: "Operation completed successfully",
        });
    } catch (error: any) {
        //Check if it is a known error.
        if (error.message == "Missing session id") {
            error.status = 401;
        } else if (error.message == "No valid UUID") {
            error.status = 401;
        } else if (error.message == "Record not found") {
            error.status = 401;
        }

        //Move too the next value.
        next(error);
    }
});

//Export routes for lex
export default lex_routes;
