import express from "express";

//Setup a router
const feedback_routes = express.Router();

//Route for sending feedback too the server.
feedback_routes.post("/send", async (req, res, next) => {
    try {
    } catch (error: any) {
        //Check if it is a known error.
        if (error.message == "Missing session id") {
            error.status = 401;
        } else if (error.message == "Invalid session id") {
            error.status = 401;
        } else if (error.message == "Invalid score") {
            error.status = 401;
        }

        //Move too the next value.
        next(error);
    }
});

//Route for getting the current feedback statistics.
feedback_routes.get("/stats", async (req, res, next) => {});
