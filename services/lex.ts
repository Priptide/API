import { RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import lexClient from "../config/awsConfig";

async function start_conversation(message: string, sessionId: string) {
  //Check we have a valid message
  if (!message) throw new Error("No valid message");

  //Check we have a session id
  if (!sessionId) throw new Error("Missing session id");

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
}

export default { start_conversation };
