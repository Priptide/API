import express from "express";
import { connection } from "mongoose";
import actions from "./routes/actions";
import lex_routes from "./routes/lex";
import router from "./routes/routes";

//server setup
export function start_server() {
    //server setup
    const app = express();

    //Add express json to allow loading of body data
    app.use(express.json());

    app.use("/api", router);

    app.use("/action", actions);

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

    //Set the port from an environment variable or default to 3000.
    const port = process.env.SERVER_PORT ?? 3000;

    //Listen on the current port
    const server = app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });

    return server;
}

// start the express server
