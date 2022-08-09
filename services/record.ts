import express from "express"
import RecordModel, {Record} from "../models/record"

async function insert_record(uuid: string, name: string, language: string){
    const data:Record = {
        UUID: uuid,
        chat:{
            language: language,
            conversation: [],
        },
        name: name,
    }
    const record = await new RecordModel(data).save();

    return {id: record._id};
}

function get_record(){
    RecordModel.find({})
    .then(res =>{
        console.log({res});
    })
    .catch(err =>{
        console.log(err);
    })
}

export default {insert_record, get_record}; 