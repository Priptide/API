import RecordService from "../services/record";
import express from "express";

const actions_routes = express.Router();

actions_routes.post("/testdrive-click", async (req, res, next) => {
    try {
        //Create or update the current record with the users input message
        const { session_id, uuid } = await RecordService.update_record(
            "Book a Test Drive",
            false,
            req.body.uuid,
            req.body.session_id,
            req.body.language,
            req.body.name
        );

        await RecordService.update_record(
            "https://www.ford.co.uk/shop/test-drive",
            false,
            uuid,
            session_id,
            req.body.language,
            req.body.name
        );

        res.status(200).json({
            message: "https://www.ford.co.uk/shop/test-drive",
            uuid: uuid,
            session_id: session_id,
        });
    } catch (error: any) {
        //Check if it is a known error.
        console.log(error);

        //Move too the next value.
        next(error);
    }
});

actions_routes.post("/book-service-click", async (req, res, next) => {
    try {
        //Create or update the current record with the users input message
        const { session_id, uuid } = await RecordService.update_record(
            "Book a Service",
            false,
            req.body.uuid,
            req.body.session_id,
            req.body.language,
            req.body.name
        );

        //Update what the bot replies
        await RecordService.update_record(
            "https://www.ford.co.uk/support/book-a-service/dealer-step",
            false,
            uuid,
            session_id,
            req.body.language,
            req.body.name
        );
        res.status(200).json({
            message:
                "https://www.ford.co.uk/support/book-a-service/dealer-step",
        });
    } catch (error: any) {
        //Check if it is a known error.

        console.log(error);
        //Move too the next value.
        next(error);
    }
});
actions_routes.post("/price-comp-click", async (req, res, next) => {
    try {
        const { session_id, uuid } = await RecordService.update_record(
            "Price Comparison",
            false,
            req.body.uuid,
            req.body.session_id,
            req.body.language,
            req.body.name
        );

        await RecordService.update_record(
            "http://www.compare.ford.co.uk/home?kee=380519",
            false,
            uuid,
            session_id,
            req.body.language,
            req.body.name
        );

        res.status(200).json({
            message: "http://www.compare.ford.co.uk/home?kee=380519",
        });
    } catch (error: any) {
        //Check if it is a known error.

        console.log(error);

        //Move too the next value.
        next(error);
    }
});

export default actions_routes;

//

// actions_routes.get("/getuuid", async (req, res, next) => {
//     try {

//         //Get a record with the uuid.
//         const recordUUId = await RecordService.find_byId_record(
//             req.body.uuid ?? "",
//         );

//         res.status(200).json({ recordUUId });

//     } catch (error: any) {
//         //Check if it is a known error.
//         if (error.message == "Missing session id") {
//             error.status = 401;
//         } else if (error.message == "No valid message") {
//             error.status = 401;
//         } else if (error.message == "Invalid session id") {
//             error.status = 401;
//         }

//         //Move too the next value.
//         next(error);
//     }
// });
