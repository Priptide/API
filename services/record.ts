import RecordModel, { Record } from "../models/record";

//Inserting a record
async function insert_record(uuid: string, name: string, language: string) {
    const data: Record = {
        UUID: uuid,
        chat: {
            language: language,
            conversation: [],
        },
        name: name,
        session_id: "random_id",
        is_active: true,
    };
    const record = await new RecordModel(data).save();

    return { id: record._id };
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
async function find_byId_record(uuid: String) {
    await RecordModel.findById(uuid)
        .then((res) => {
            console.log({ res });
        })
        .catch((err) => {
            console.log(err);
        });
}

export default { insert_record, find_record, find_byId_record };
