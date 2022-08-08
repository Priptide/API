import { connection } from "mongoose";
import connect from "./config/mongoConfig";

//Connect to mongodb
connect();

//Check for open connection to database
connection.once("open", async () => {
    console.log("Connected to database");
});

//server setup 

import express from "express";
const app = express();

//port set-up
 const port = process.env.SERVER_PORT;

app.get( "/", ( req, res ) => {
    // render the index template
    res.send("hello");
} );

// start the express server
app.listen( port, () => {
    
    console.log( `server started at http://localhost:${ port }` );
} );



