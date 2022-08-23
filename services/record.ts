import RecordModel, { Record } from "../models/record";
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
            language: language ? language : "en_gb",
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
            else
                return {
                    id: lookup_record._id,
                    session_id: session_id,
                    uuid: uuid,
                };
        } else {
            //Try and find an active record by the user
            const lookup_record = await RecordModel.findOne({
                UUID: uuid,
                is_active: true,
            });

            //If we can't find any active record then create a new active record.
            if (!lookup_record) return create(language, uuid, name);
            else
                return {
                    id: lookup_record._id,
                    session_id: lookup_record.session_id,
                    uuid: uuid,
                };
        }
    } else {
        //If not create and return a new record
        return create(language, undefined, name);
    }
}

//Deleting records if message is empty || conversation is older than a day
async function delete_allrecords() {
    if(last_active > )
    await RecordModel.deleteMany({ is_active: false });
}
//allows us to delete by userid
async function delete_record(uuid?: string) {
    if (uuid) {
        await RecordModel.deleteMany({ UUID: uuid });
    } else {
        console.log("record missing");
    }
}

export default {
    create,
    find_record,
    find_byId_record,
    find_or_create,
    delete_allrecords,
    delete_record,
};
