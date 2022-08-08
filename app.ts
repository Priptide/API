import { connection } from "mongoose";
import connect from "./config/mongoConfig";
import LexService from "./services/lex";

//Connect to mongodb
connect();

//Check for open connection to database
connection.once("open", async () => {
  console.log("Connected to database");
});
