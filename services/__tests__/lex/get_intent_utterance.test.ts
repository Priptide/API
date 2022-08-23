import { stringify } from "querystring";
import RecordModel, { Record } from "../../../models/record";
import mongoTesting from "../../../utils/mongoTesting";
import LexService, { AlternateButton } from "../../lex";

describe("Lex_Get_Intent_Utterance", () => {
    /**
     * Connect to a new in-memory database before running any tests.
     */

    beforeAll(async () => await mongoTesting.connect());

    /**
     * Clear all test data after every test.
     */

    afterEach(async () => await mongoTesting.clearDatabase());

    /**
     * Remove and close the db and server.
     */

    afterAll(async () => await mongoTesting.closeDatabase());

    test("Empty name", async () => {
        try {

            const empty_name = ""
            //Try send with empty name
            const utterance = await LexService.get_intent_utterance(empty_name);

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Empty name");
        }
    });

    test("Invalid name", async () => {
        try {

            const invalid_name = "I_like_apples"
            //Try send with invalid name
            const utterance = await LexService.get_intent_utterance(invalid_name);
            // Should return nothing when invalid name.
            expect(utterance).toBe(undefined);
        } catch (error: any) {

            console.log(error.message);
            //Fail the test if any unexpected error came up
            expect(true).toBe(false);
        }
    });

    test("Valid name and language", async () => {
        try {
            // Valid intent name taken from the Lex Console
            const valid_name = "How_to_Perform_a_SYNC_Master_Reset";
            const valid_language = "en_GB"

            //Try send with valid name and language
            const response = await LexService.get_intent_utterance(valid_name, valid_language);
            // Should return an Alternate Button
            expect(response).toStrictEqual({ text: "How to Perform a SYNC Master Reset", url: "https://www.ford.co.uk/support/how-tos/sync/troubleshooting/how-to-perform-a-sync-master-reset" });
        } catch (error: any) {
            // Print the error
            console.log(error.message);
            //Fail the test if any unexpected error came up
            expect(true).toBe(false);
        }
    });

    test("Invalid language", async () => {
        try {
            const valid_name = "How_to_Perform_a_SYNC_Master_Reset";
            const invalid_language = "invalid";
            //Try send with invalid language
            const response = await LexService.get_intent_utterance(valid_name, invalid_language);
            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {

            //Check we have sent the expected error
            expect(error.message).toBe("Invalid language");
        }
    });




});
