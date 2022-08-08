import express from "express";
import { connection } from "mongoose";
import connect from "./config/mongoConfig";
import lex_routes from "./routes/lex";
import router from "./routes/routes";

function start_server() {
    //server setup

    const app = express();

    //port set-up
    const port = process.env.SERVER_PORT ?? 3000;

    //Add express json to allow loading of body data
    app.use(express.json());

    app.use("/api", router);

    //Add lex too the routes
    app.use("/lex", lex_routes);

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
    start_server();
});
