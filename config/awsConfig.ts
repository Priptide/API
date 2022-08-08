import { LexRuntimeV2Client } from "@aws-sdk/client-lex-runtime-v2";
import "dotenv/config";

export default function lexClient() {
    return new LexRuntimeV2Client({
        region: process.env.AWS_REGION ?? "",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY ?? "",
            secretAccessKey: process.env.AWS_SECRET_KEY ?? "",
        },
    });
}
