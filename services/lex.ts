import { RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import lexClient from "../config/awsConfig";
import RecordModel from "../models/record";

//Return the full list of possible intents
async function send_message(message: string, sessionId: string) {
    //Check we have a valid message
    if (!message) throw new Error("No valid message");

    //Check we have a session id
    if (!sessionId) throw new Error("Missing session id");

    //Get the current record
    const record = await RecordModel.findOne({ session_id: sessionId });

    //Check there is a valid record
    if (!record) throw new Error("Invalid session id");

    //Spin up a new client
    const client = lexClient();

    //Create a command for text recognition
    const command = new RecognizeTextCommand({
        text: message,
        botId: process.env.BOT_ID ?? "",
        botAliasId: process.env.BOT_ALIAS_ID ?? "",
        localeId: process.env.LOCALE_ID ?? "",
        sessionId: sessionId,
    });

    //Attempt to get the data required from the AWS lex server
    const data = await client.send(command);

    //Return the list of possible interpretations
    return data["interpretations"];
}

//Returns only the single most likely intent
async function get_main_intent(message: string, sessionId: string) {
    //Get all possible intentions
    const intentions = await send_message(message, sessionId);

    //If there is no intensions or the list is empty return an error
    if (!intentions || intentions.length == 0) {
        throw new Error("Server error: No Intentions found!");
    }

    //Return the first intent
    return intentions[0];
}

export default { send_message, get_main_intent };
