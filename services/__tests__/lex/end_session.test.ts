import RecordModel, { Record } from "../../../models/record";
import mongoTesting from "../../../utils/mongoTesting";
import LexService from "../../lex";

describe("Lex_End_Session", () => {
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

    test("send invalid user id", async () => {
        try {
            //Try send with empty uuid
            await LexService.end_session("my_session", "");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("No valid UUID");
        }
    });

    test("send invalid session id", async () => {
        try {
            //Try send with empty session id
            await LexService.end_session("", "my_uuid");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Missing session id");
        }
    });

    test("send session id and uuid without record", async () => {
        try {
            //Try send without record created
            await LexService.end_session("my_session", "my_uuid");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Record not found");
        }
    });

    test("send valid information - active model", async () => {
        //Create record data
        const record_model: Record = {
            UUID: "test_uuid",
            chat: {
                language: "en_GB",
                conversation: [],
            },
            session_id: "test_session",
            is_active: true,
        };

        //Save this data too the mock mongodb
        const record = await new RecordModel(record_model).save();

        //Check the model is set to active
        expect(record.is_active).toBe(true);

        //Send with valid information
        await LexService.end_session(
            record_model.session_id,
            record_model.UUID
        );

        //Find the model updated in the database
        const updated_record = await RecordModel.findById(record._id);

        //Check the model is set to inactive
        expect(updated_record?.is_active).toBe(false);

        //Update the original data and check nothing else changed
        record_model.is_active = false;
        expect(updated_record).toMatchObject(record_model);
    });

    test("send valid information - inactive model", async () => {
        //Create record data
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
        const record = await new RecordModel(record_model).save();

        //Check the model is set to inactive
        expect(record.is_active).toBe(false);

        //Send with valid information
        await LexService.end_session(
            record_model.session_id,
            record_model.UUID
        );

        //Find the model updated in the database
        const updated_record = await RecordModel.findById(record._id);

        //Check nothing changed in the original model
        expect(updated_record).toMatchObject(record_model);
    });
});
