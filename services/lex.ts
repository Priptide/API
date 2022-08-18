import { Interpretation, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import { ListIntentsCommand, DescribeIntentCommand, SampleUtterance } from "@aws-sdk/client-lex-models-v2";
import { lexClient, modelLexClient } from "../config/awsConfig";
import RecordModel from "../models/record";


//Return the full list of possible intents
async function send_message(message: string, sessionId: string, language?:string): Promise<{ message: { text: string, time: Date }, interpretations: Interpretation[] }> {
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
        message: { text: local_message ?? "", time: timestamp },
        interpretations: interpretations ?? [],
    };
}

async function get_intent_utterance(name: string): Promise<string | undefined> {
    const client = modelLexClient();
    const listIdsCommand = new ListIntentsCommand({ botId: process.env.BOT_ID ?? "", localeId: process.env.LOCALE_ID ?? "", botVersion: "2" });
    const listIds = await client.send(listIdsCommand);
    const id = listIds.intentSummaries?.find(summary => summary.intentName === name)?.intentId;
    const descriptionCommand = new DescribeIntentCommand({ botId: process.env.BOT_ID ?? "", localeId: process.env.LOCALE_ID ?? "", botVersion: "2", intentId: id });
    const response = await client.send(descriptionCommand);
    return response.sampleUtterances ? response.sampleUtterances[0].utterance : "";
}

export default { send_message, get_intent_utterance };
