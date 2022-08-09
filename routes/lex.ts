import express from "express";
import LexService from "../services/lex";

//Setup a router
const lex_routes = express.Router();

//Route for sending a message to lex
lex_routes.post("/send", async (req, res, next) => {
    try {
        //TODO: Create a new record for this chat

        //Get all possible intentions.
        const intentions = await LexService.send_message(
            req.body.message ?? "",
            req.body.sessionId ?? ""
        );

        res.status(200).json({ intentions });
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

//Export routes for lex
export default lex_routes;
