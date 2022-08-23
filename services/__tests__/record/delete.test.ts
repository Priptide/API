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
            expect(false).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("No records found");
        }
    });

    test("delete valid record", async () => {
        //Create record data as active
        const record_model: Record = {
            UUID: "test_uuid",
            chat: {
                language: "en_GB",
                conversation: [],
            },
            session_id: "test_session",
            is_active: false,
        };

        //Save this data too the mock mongodb
        const init_record = await new RecordModel(record_model).save();

        //Find the record
        const records = await RecordModel.find({
            UUID: init_record.UUID,
            session_id: init_record.session_id,
        });

        expect(records.length).toBe(1);

        await RecordService.delete_allrecords();

        const updated_record = await RecordModel.find({
            UUID: init_record.UUID,
            session_id: init_record.session_id,
        });

        expect(updated_record.length).toBe(0);
    });
});
