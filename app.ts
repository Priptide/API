import { connection } from "mongoose";
import connect from "./config/mongoConfig";

//Connect to mongodb
connect();

//Check for open connection to database
connection.once("open", async () => {
  console.log("Connected to database");
});
