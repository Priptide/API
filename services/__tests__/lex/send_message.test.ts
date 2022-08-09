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

    // test("send valid message", async () => {
    //     //Send to the lex service a new message and our test session id
    //     const data = await LexService.send_message(
    //         "How to connect to wifi",
    //         "test_session"
    //     );

    //     //Expect data to be provided
    //     expect(data).toBeDefined();
    // });
});
