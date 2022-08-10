import express from "express";
import { connection } from "mongoose";
import connect from "./config/mongoConfig";
import actions from "./routes/actions";
import lex_routes from "./routes/lex";
import router from "./routes/routes";
import cors from "cors";

function start_server() {
    //server setup

    const app = express();

    //port set-up
    const port = process.env.SERVER_PORT ?? 3000;

    app.use(cors());
    //Add express json to allow loading of body data
    app.use(express.json());

    app.use("/api", router);

    app.use("/action", actions)

    //Add lex too the routes
    app.use("/lex", lex_routes);

    //Setup routing for errors
    app.use((error: any, req: any, res: any, next: any) => {
        console.log(error.stack);

        res.status(error.status || 500);

        res.json({
            status: error.status || 500,
            message: error.message,
        });
    });

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
