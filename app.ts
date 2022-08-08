import { connection } from "mongoose";
import connect from "./config/mongoConfig";
import express from "express";
import router from "./routes/routes";
import RecordService from "./services/record";

function start_server() {
    //server setup

    const app = express();

    //port set-up
    const port = process.env.SERVER_PORT;

    app.use("/api", router);

    // start the express server
    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
}

//Connect to mongodb
connect();

//Check for open connection to database
connection.once("open", async () => {
    console.log("Connected to database");
    RecordService.insert_record("test_id", "siana", "en_gb");
    start_server();
});
