import {
  RecognizeTextCommand,
  RecognizeUtteranceCommand,
  StartConversationCommand,
} from "@aws-sdk/client-lex-runtime-v2";
import lexClient from "../config/awsConfig";

async function start_conversation(message: string) {
  //Spin up a new client
  const client = lexClient();

  //Create a command for recognition
  const command = new RecognizeTextCommand({
    text: message,
    botId: process.env.BOT_ID ?? "",
    botAliasId: process.env.BOT_ALIAS_ID ?? "",
    localeId: process.env.LOCALE_ID ?? "",
    sessionId: "new_session",
  });

  try {
    const data = await client.send(command);
    console.log(data);
  } catch (error) {
    // error handling.
    console.log("Error" + error);
  }
}

export default { start_conversation };
