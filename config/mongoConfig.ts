import mongoose from "mongoose";

import "dotenv/config";

export default async function connect(): Promise<void> {
    //Get the users connection URL
    var connectionURL = process.env.DATABASE_URI ?? "";

    //Connect to mongoose database
    try {
        mongoose.connect(connectionURL);
    } catch (err) {
        console.error(err);
    }
}