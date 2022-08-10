import crypto from "crypto";

import RecordModel from "../models/record";

export async function generateUUID(): Promise<string> {
    const { randomBytes } = await crypto;
    const buf = randomBytes(16).toString("hex");

    if (await RecordModel.findOne({ UUID: buf })) return await generateUUID();
    else return buf;
}

export async function generateSessionId(): Promise<string> {
    const { randomBytes } = await crypto;
    const buf = randomBytes(32).toString("hex");

    if (await RecordModel.findOne({ session_id: buf }))
        return await generateSessionId();
    else return buf;
}
