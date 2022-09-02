import express from "express";
import { connection } from "mongoose";
import connect from "./config/mongoConfig";
import actions from "./routes/actions";
import lex_routes from "./routes/lex";
import router from "./routes/routes";
import { start_server } from "./server";
import cors from "cors";
import myJob from "./services/cron/cron-job";

//Connect to mongodb
connect();

//Check for open connection to database
connection.once("open", async () => {
    console.log("Connected to database");
    start_server();
    myJob.start();
    console.log("Job started");
});
