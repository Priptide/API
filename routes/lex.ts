import express from "express";
import LexService from "../services/lex";

//Setup a router
const lex_routes = express.Router();

//Route for sending a message to lex
lex_routes.post("/send", async (req, res, next) => {
    try {
        const intentions = await LexService.send_message(
            req.body.message ?? "",
            req.body.sessionId ?? ""
        );

        res.status(200).json({ intentions });
    } catch (error: any) {
        if (error.message == "Missing session id") {
            error.status = 401;
        } else if (error.message == "No valid message") {
            error.status = 401;
        }

        next(error);
    }
});

//Export routes for lex
export default lex_routes;
