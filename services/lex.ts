import {
    DescribeIntentCommand,
    IntentFilter,
    IntentFilterName,
    IntentFilterOperator,
    ListIntentsCommand,
} from "@aws-sdk/client-lex-models-v2";
import { lexClient, modelLexClient } from "../config/awsConfig";

import { RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import RecordModel from "../models/record";

//Create an interface for buttons
export interface AlternateButton {
    text: string;
    url?: string;
}

//Return the full list of possible intents
async function send_message(
    message: string,
    sessionId: string,
    language?: string
): Promise<{
    message: { text: string; time: Date };
    alternateButtons: AlternateButton[];
}> {
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
        localeId: language ? language : "en_GB",
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

    //Create a list for alternative buttons
    const alternateButtons: AlternateButton[] = [];

    //Get the length of the interpretations
    const length = interpretations?.length ?? 0;

    //Iterate through the interpretations and turn them into buttons
    for (let i = 0; i < length; i++) {
        //Check we have a list and element at our pointer
        if (interpretations && interpretations[i]) {
            //Create a button from this interpretation
            const localButton = await get_intent_utterance(
                interpretations[i].intent?.name ?? "",
                language
            );

            //If we have a valid button, add this too the list
            if (localButton) alternateButtons.push(localButton);
        }
    }

    //Return the messages and list of alternative options
    return {
        message: { text: local_message ?? "", time: timestamp },
        alternateButtons: alternateButtons ?? [],
    };
}

//Return the content of any given intent using the intentName
async function get_intent_utterance(
    name: string,
    language?: string
): Promise<AlternateButton | undefined> {
    //Create a client for using the lex model API
    const client = modelLexClient();

    //Create a filter for our list command
    const filter: IntentFilter = {
        name: IntentFilterName.IntentName,
        values: [name],
        operator: IntentFilterOperator.Equals,
    };

    //Create a command to find the intent id using the intent name
    var searchCommand = new ListIntentsCommand({
        botId: process.env.BOT_ID ?? "",
        localeId: language ? language : "en_GB",
        botVersion: process.env.BOT_VERSION ?? "",
        filters: [filter],
        maxResults: 600,
    });

    //Send the search command too the server
    var searchResults = await client.send(searchCommand);

    //Keep looping until there are no more results or we find a result
    while (
        searchResults.nextToken &&
        (searchResults.intentSummaries?.length ?? 0) <= 0
    ) {
        searchCommand.input.nextToken = searchResults.nextToken;
        searchResults = await client.send(searchCommand);
    }

    //Check that we have a single unique result return empty if not
    if (searchResults.intentSummaries?.length != 1) return;

    //Get our current id
    const id = searchResults.intentSummaries[0].intentId;

    //Check we have an id, return null if not
    if (!id) return;

    //Create a command for get the description of the given intent using the found id
    const descriptionCommand = new DescribeIntentCommand({
        botId: process.env.BOT_ID ?? "",
        localeId: process.env.LOCALE_ID ?? "",
        botVersion: process.env.BOT_VERSION ?? "",
        intentId: id,
    });

    //Send command to get information of the given intent
    const response = await client.send(descriptionCommand);

    //If there is no utterances or it's empty return an empty string
    if (!response.sampleUtterances || !response.sampleUtterances[0].utterance)
        return;

    //Check that a url is attached too the response object
    if (
        !response.fulfillmentCodeHook ||
        !response.fulfillmentCodeHook.postFulfillmentStatusSpecification ||
        !response.fulfillmentCodeHook.postFulfillmentStatusSpecification
            .successResponse ||
        !response.fulfillmentCodeHook.postFulfillmentStatusSpecification
            .successResponse.messageGroups ||
        response.fulfillmentCodeHook.postFulfillmentStatusSpecification
            .successResponse.messageGroups.length == 0 ||
        !response.fulfillmentCodeHook?.postFulfillmentStatusSpecification
            ?.successResponse?.messageGroups[0].message
    )
        return;

    //Create an object for the first utterance (actual of the intent) and the intent id
    const output: AlternateButton = {
        text: response.sampleUtterances[0].utterance,
        url: response.fulfillmentCodeHook?.postFulfillmentStatusSpecification
            ?.successResponse?.messageGroups[0].message.plainTextMessage?.value,
    };

    //Return this object
    return output;
}

//Used to mark a session as complete
async function end_session(session_id: string, uuid: string) {
    //First we want to check session and uuids are valid
    if (!session_id) throw new Error("Missing session id");
    if (!uuid) throw new Error("No valid UUID");

    //Now we want to find the record for these users
    const record = await RecordModel.findOne({
        UUID: uuid,
        session_id: session_id,
    });

    //If we can't find a record throw an error
    if (!record) throw new Error("Record not found");

    //Otherwise we want to mark this record as no longer active
    record.is_active = false;

    //Update the record
    await record.save();
}

export default { send_message, get_intent_utterance, end_session };
