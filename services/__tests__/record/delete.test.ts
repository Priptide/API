import RecordModel, { Record } from "../../../models/record";

import RecordService from "../../record";
import mongoTesting from "../../../utils/mongoTesting";

describe("Record_Delete", () => {
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

    //Test for no active record error (no records)
    test("get with no past records", async () => {
        try {
            //Try send with no record and valid uuid
            await RecordService.delete_allrecords();

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("No records found");
        }
    });

    //Test for no active record error (one inactive record)
    test("get with one past inactive record", async () => {
        try {
            //Create record data as inactive
            const record_model: Record = {
                UUID: "test_uuid",
                chat: {
                    language: "en_GB",
                    conversation: [
                        {
                            text: "my message",
                            time: new Date(Date.now()),
                            is_bot: false,
                        },
                    ],
                },
                session_id: "test_session",
                is_active: false,
            };

            await new RecordModel(record_model).save();

            //Try send with valid uuid
            await RecordService.delete_allrecords();

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("No records found");
        }
    });

    //Test for single result with chats
    // test("get with one past active record", async () => {
    //     try {
    //         //Create record data as inactive
    //         const record_model: Record = {
    //             UUID: "test_uuid",
    //             chat: {
    //                 language: "en_GB",
    //                 conversation: [
    //                     {
    //                         text: "my message",
    //                         time: new Date(Date.now()),
    //                         is_bot: false,
    //                     },
    //                 ],
    //             },
    //             session_id: "test_session",
    //             is_active: false,
    //         };

    //         await new RecordModel(record_model).save();

    //         //Try send with valid uuid
    //         await RecordService.get_by_uuid(record_model.UUID);

    //         // Fail test if above expression doesn't throw anything.
    //         expect(true).toBe(false);
    //     } catch (error: any) {
    //         //Check we have sent the expect error
    //         expect(error.message).toBe("No records found");
    //     }
    // });
});
