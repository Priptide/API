import RecordService from "../services/record";
import express from "express";

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

//Route for getting your most recent record from lex
record_routes.post("/get", async (req, res, next) => {
    try {
        //Using a the uuid provided we want to get the most recent record
        const { session_id, uuid, chat, name } =
            await RecordService.get_by_uuid(req.body.uuid);

        //Return the uuid, session id, chat history and name from the record
        res.status(200).json({
            uuid: uuid,
            session_id: session_id,
            chat: chat,
            name: name,
        });
    } catch (error: any) {
        //Check if it is a known error.
        if (error.message == "Invalid UUID") {
            error.status = 401;
        } else if (error.message == "No records found") {
            error.status = 401;
        }

        //Move too the next value.
        next(error);
    }
});

// delete records if inactive for 24 hours, or empty
record_routes.post("/clean", async (req, res) => {
    await RecordService.clean_inactive_records();
    res.send({ message: "Inactive records removed." });
});

//delete record if user asks
record_routes.post("/delete/:uuid", async (req, res) => {
    await RecordService.delete_record(req.params.uuid);
    res.status(200).json("Successful deleting ");
});

export default record_routes;
