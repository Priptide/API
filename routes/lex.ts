import express from "express";
import LexService from "../services/lex";

//Setup a router
const lex_routes = express.Router();

//Route for sending a message to lex
lex_routes.post("/send", async (req, res) => {
    const intentions = await LexService.send_message(
        req.body.message ?? "",
        req.body.sessionId ?? ""
    );

    res.status(200).json({ intentions });
});

//Export routes for lex
export default lex_routes;
