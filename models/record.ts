import { Timestamp } from 'mongodb';
import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

interface Record{
    _id : number;
    UUID : String;
    chat : Chat;
    name : String;
}

interface Chat{
    _id: number;
    language : String;
    conversation : Array<Message>;
}

interface Message{
    text: String;
    time: Timestamp;
    is_bot:boolean
}

const recordSchema = new Schema<Record>({
  UUID:{
    type:String,
    required:true
  },
  chat:[
    {
        language: {type: String, required: true},
        conversation:[
            {
                text: {type : String, required: true},
                time: { type: Timestamp, required: true},
                is_bot: {type: Boolean, required: true},
            }
        ]
    }
  ]
});

export default model("Record", recordSchema);