import RecordModel, { Record } from "../../../models/record";
import mongoTesting from "../../../utils/mongoTesting";
import LexService from "../../lex";

describe("Lex_Send_Message", () => {
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

    test("send invalid message id", async () => {
        try {
            //Try send with empty message
            await LexService.send_message("", "my_session");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("No valid message");
        }
    });

    test("send empty session id", async () => {
        try {
            //Try send with empty session id
            await LexService.send_message("my_message", "");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Missing session id");
        }
    });

    test("send invalid session id", async () => {
        try {
            //Try send with empty session id
            await LexService.send_message("my_message", "test_id");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Invalid session id");
        }
    });

    /**
     * Currently unused whilst there are issues with the overall AWS service on GitHub actions.
     */
    test("send valid message", async () => {
        //Create a new
        const recordData: Record = {
            UUID: "12313",
            chat: {
                language: "en_gb",
                conversation: [],
            },
            name: "TestName",
            session_id: "TestSession",
            is_active: true,
        };

        const recordModel = await new RecordModel(recordData).save();

        const message = "How to connect to wifi";
        //Send to the lex service a new message and our test session id
        const data = await LexService.send_message(
            message,
            recordModel.session_id
        );

        //Expect data to be provided
        expect(data).toBeDefined();

        //Get our updated record
        const updatedRecord = await RecordModel.findOne({
            _id: recordModel._id,
        });

        if (updatedRecord) {
            //Check that our record has set two messages
            expect(updatedRecord.chat.conversation.length).toBe(2);

            //Make sure the first message is from the user
            expect(updatedRecord.chat.conversation[0].is_bot).toBe(false);

            //Check the message contains the correct content
            expect(updatedRecord.chat.conversation[0].text).toBe(message);

            //Check the second message is from a bot
            expect(updatedRecord.chat.conversation[1].is_bot).toBe(true);

            //Check the message contains content
            expect(updatedRecord.chat.conversation[1].text).toBeDefined();
        } else {
            expect(true).toBe(false);
        }
    });
});
