// /actions/getUUId

import express from "express";
import RecordService from "../services/record";

const actions_routes = express.Router();

actions_routes.get("/actions/getuuid", async (req, res, next) => {
    try {
        
        //Get a record with the uuid.
        const recordUUId = await RecordService.find_byId_record(
            req.body.uuid ?? "",
        );

        res.status(200).json({ recordUUId });

        
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

actions_routes.get("/actions/testdrive-click" , async (req, res, next) => {
    try {
        
        console.log("2");
        
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

actions_routes.get("/actions/book-service-click" , async (req, res, next) => {
    try {
        
        console.log("1");
        
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
actions_routes.get("/actions/price-comp-click" , async (req, res, next) => {
    try {
        
    console.log("0");
        
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


export default actions_routes