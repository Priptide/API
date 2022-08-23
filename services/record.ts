import RecordModel, { Chat, Record } from "../models/record";
import { generateSessionId, generateUUID } from "../utils/cryptoGeneration";
import { Types } from "mongoose";

//Inserting a record
async function create(
    language?: string,
    uuid?: string,
    name?: string
): Promise<{ id: Types.ObjectId; session_id: string; uuid: string }> {
    //Create a new record object
    const data: Record = {
        UUID: uuid ? uuid : await generateUUID(),
        chat: {
            language: language ? language : "en_GB",
            conversation: [],
        },
        name: name ? name : "",
        session_id: await generateSessionId(),
        is_active: true,
    };

    //Make the record a schema and save it too our database
    const record = await new RecordModel(data).save();

    //Return the id, session id and uuid of the user
    return { id: record._id, session_id: record.session_id, uuid: record.UUID };
}

//Finding a record
async function find_record() {
    await RecordModel.find({})
        .then((res) => {
            console.log({ res });
        })
        .catch((err) => {
            console.log(err);
        });
}

// Getting a record by UUID
async function find_byId_record(uuid: string) {
    if (!uuid) throw new Error("Missing uuid");

    await RecordModel.findOne({ UUID: uuid })
        .then((res) => {
            //console.log({ res });
            return res;
        })
        .catch((err) => {
            console.log(err);
        });
}

//Used when it is unknown if we have or have not got a current record
async function find_or_create(
    language?: string,
    name?: string,
    uuid?: string,
    session_id?: string
): Promise<{ id: Types.ObjectId; session_id: string; uuid: string }> {
    //Check if we have a uuid
    if (uuid) {
        //Check if we gave a session id
        if (session_id) {
            //If so lookup this session
            const lookup_record = await RecordModel.findOne({
                session_id: session_id,
            });

            //If we can't find the record or it is now currently inactive then return a new record.
            if (!lookup_record || !lookup_record.is_active)
                return create(language, uuid, name);
            else {
                //Check if the language changed
                if (language && language != lookup_record.chat.language) {
                    lookup_record.chat.language = language;
                }

                //Check if the name has changed
                if (name && name != lookup_record.name) {
                    lookup_record.name = name;
                }

                //Update record in case of change
                await lookup_record.save();

                //Return information on record
                return {
                    id: lookup_record._id,
                    session_id: session_id,
                    uuid: uuid,
                };
            }
        } else {
            //Try and find an active record by the user
            const lookup_record = await RecordModel.findOne({
                UUID: uuid,
                is_active: true,
            });

            //If we can't find any active record then create a new active record.
            if (!lookup_record) return create(language, uuid, name);
            else {
                //Check if the language changed
                if (language && language != lookup_record.chat.language) {
                    lookup_record.chat.language = language;
                }

                //Check if the name has changed
                if (name && name != lookup_record.name) {
                    lookup_record.name = name;
                }

                //Update record in case of change
                await lookup_record.save();

                return {
                    id: lookup_record._id,
                    session_id: lookup_record.session_id,
                    uuid: uuid,
                };
            }
        }
    } else {
        //If not create and return a new record
        return create(language, undefined, name);
    }
}

//Used to update or create and update a record for non lex related usage
async function update_record(
    message: string,
    is_bot: boolean,
    init_uuid?: string,
    init_session_id?: string,
    language?: string,
    name?: string
): Promise<{ uuid: string; session_id: string }> {
    //Check we have a valid message
    if (!message) throw new Error("No valid message");

    //Check if this record exists if not we can create a new one.
    const { id, session_id, uuid } = await find_or_create(
        language,
        name,
        init_uuid,
        init_session_id
    );

    //Find this record we looked up
    const record = await RecordModel.findById(id);

    //If there is no record found return an error
    if (!record) throw new Error("No valid record found");

    //Update the record with the given message
    record.add_message(is_bot, message);

    //Save the record
    await record.save();

    //Return the session id and uuid
    return {
        uuid: uuid,
        session_id: session_id,
    };
}

//Used to find the users most recent chat, it will also mark any old active chats as inactive
async function get_by_uuid(uuid: string) {
    //Check the uuid isn't an empty string
    if (!uuid) throw new Error("Invalid uuid");

    //Find an records that are still active
    const records = await RecordModel.find({ UUID: uuid, is_active: true });

    //If we can't find any records then throw an error
    if (records.length == 0) throw new Error("No records found");

    var session_id: string;

    var chat: Chat;

    //If the length is greater than 1 we need to work out which is most recent.
    if (records.length > 1) {
        //Set the first element last active as an initial state.
        var last_active_max = records[0].last_active();
        var last_active_record = records[0];

        //Loop through each record.
        for (let i = 1; i < records.length; i++) {
            //Get the time they were last active.
            const last_active = records[i].last_active();

            //Check if this record is the first active or was active more recently.
            if (!last_active_max || last_active > last_active_max) {
                //Update as the new max.
                last_active_max = last_active;

                //If there was a previous record then set it too inactive and save.
                if (last_active_record) {
                    last_active_record.is_active = false;
                    await last_active_record.save();
                }

                //Update the last active record too this record.
                last_active_record = records[i];
            } else {
                //If not then we want to set this record to inactive and save it.
                records[i].is_active = false;
                await records[i].save();
            }
        }
        //Get the session id and chat params from the newest record
        session_id = last_active_record.session_id;
        chat = last_active_record.chat;
    } else {
        //Set the session id and chat params
        session_id = records[0].session_id;
        chat = records[0].chat;
    }

    //Return the uuid, session id and chat (language and messages)
    return { session_id: session_id, uuid: uuid, chat: chat };
}

export default {
    create,
    find_record,
    find_byId_record,
    find_or_create,
    update_record,
    get_by_uuid,
};
