import RecordModel, { Record } from "../models/record";
import { generateSessionId, generateUUID } from "../utils/cryptoGeneration";

//Inserting a record
async function create(language: string, uuid?: string, name?: string) {
    const data: Record = {
        UUID: uuid ? uuid : await generateUUID(),
        chat: {
            language: language,
            conversation: [],
        },
        name: name ?? "",
        session_id: await generateSessionId(),
        is_active: true,
    };
    const record = await new RecordModel(data).save();

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

    if (!uuid)  throw new Error("Missing uuid")

    await RecordModel.findOne({UUID: uuid})
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
    language: string,
    name?: string,
    uuid?: string,
    session_id?: string
) {
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
                return create(language, name ?? "", uuid);
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
            if (!lookup_record) return create(language, name ?? "", uuid);
            else
                return {
                    id: lookup_record._id,
                    session_id: lookup_record.session_id,
                    uuid: uuid,
                };
        }
    } else {
        //If not create and return a new record
        return create(language, name ?? "");
    }
}

export default { create, find_record, find_byId_record, find_or_create };
