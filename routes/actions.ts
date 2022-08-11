import express from "express";

const actions_routes = express.Router();

actions_routes.get("/testdrive-click", async (req, res, next) => {
    try {
        res.status(200).json({
            message: "https://www.ford.co.uk/shop/test-drive",
        });
    } catch (error: any) {
        //Check if it is a known error.
        console.log(error);

        //Move too the next value.
        next(error);
    }
});

actions_routes.get("/book-service-click", async (req, res, next) => {
    try {
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
actions_routes.get("/price-comp-click", async (req, res, next) => {
    try {
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
