import express from "express";
import RecordService from "../services/record";

//Setup a router
const record_routes = express.Router();

//Route for sending a message to lex
record_routes.post("/update", async (req, res, next) => {
    try {
        //Using the information in the post request update or create a new record in the db.
        const { session_id, uuid } = await RecordService.update_record(
            req.body.message,
            req.body.is_bot,
            req.body.uuid,
            req.body.session_id,
            req.body.language,
            req.body.name
        );

        //Return the uuid and session id from the database
        res.status(200).json({
            uuid: uuid,
            session_id: session_id,
        });
    } catch (error: any) {
        //Check if it is a known error.
        if (error.message == "No valid record found") {
            error.status = 401;
        } else if (error.message == "No valid message") {
            error.status = 401;
        }

        //Move too the next value.
        next(error);
    }
});

export default record_routes;
