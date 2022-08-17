import { RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import lexClient from "../config/awsConfig";
import RecordModel from "../models/record";

//Return the full list of possible intents
async function send_message(
    message: string,
    sessionId: string,
    language?: string
) {
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
        localeId: language ?? "en_GB",
        sessionId: sessionId,
    });

    //Attempt to get the data required from the AWS lex server
    const data = await client.send(command);

    //Set the local variables from the data
    const interpretations = data["interpretations"];
    var local_message;
    var timestamp;

    //Add user message to our record.
    record.add_message(false, message);

    if (data["messages"]) {
        local_message = data["messages"][0]["content"] ?? "";

        //Add lex message too our record.
        timestamp = record.add_message(true, local_message);
    }

    //Save the record model.
    await record.save();

    //Return the messages and list of possible interpretations
    return {
        message: { text: local_message, time: timestamp },
        interpretations: interpretations,
    };
}

export default { send_message };
