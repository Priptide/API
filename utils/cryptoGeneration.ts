import crypto from "crypto";

import RecordModel from "../models/record";

export async function generateUUID(): Promise<string> {
    //Generate 16 random bytes of hex and convert it too a string.
    const { randomBytes } = await crypto;
    const buf = randomBytes(16).toString("hex");

    //If the UUID is unique then return it, if not return a new unique one.
    if (await RecordModel.findOne({ UUID: buf })) return await generateUUID();
    else return buf;
}

export async function generateSessionId(): Promise<string> {
    //Generate 32 random bytes of hex and convert it too a string.
    const { randomBytes } = await crypto;
    const buf = randomBytes(32).toString("hex");

    //If the session id is unique then return it, if not return a new unique one.
    if (await RecordModel.findOne({ session_id: buf }))
        return await generateSessionId();
    else return buf;
}
