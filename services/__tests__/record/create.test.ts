import RecordModel, { Record } from "../../../models/record";

import RecordService from "../../record";
import mongoTesting from "../../../utils/mongoTesting";

describe("Record_Create", () => {
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

    test("create record without language", async () => {
        //Create temporary variables
        const name = "test_name";
        const test_uuid = "my_uuid";

        //Create a new record
        const { id, session_id, uuid } = await RecordService.create(
            undefined,
            test_uuid,
            name
        );

        //Check the outputted uuid is valid
        expect(uuid).toBe(test_uuid);

        //Find our current record
        const created_record = await RecordModel.findOne({ _id: id });

        //Create an object of the data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: "en_GB",
                conversation: [],
            },
            session_id: session_id,
            name: name,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });

    test("create record without uuid", async () => {
        //Create temporary variables
        const name = "test_name";
        const language = "en_us";

        //Create a new record
        const { id, session_id, uuid } = await RecordService.create(
            language,
            undefined,
            name
        );

        //Find our current record
        const created_record = await RecordModel.findOne({ _id: id });

        //Create an object of the data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: language,
                conversation: [],
            },
            session_id: session_id,
            name: name,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });

    test("create record without name", async () => {
        //Create temporary variables
        const language = "en_us";
        const test_uuid = "my_uuid";

        //Create a new record without the name variable
        const { id, session_id, uuid } = await RecordService.create(
            language,
            test_uuid
        );

        //Check the outputted uuid is valid
        expect(uuid).toBe(test_uuid);

        //Find our current record
        const created_record = await RecordModel.findOne({ _id: id });

        //Create an object of the data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: language,
                conversation: [],
            },
            session_id: session_id,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });

    test("create record without any information", async () => {
        //Create a new record with no parameters
        const { id, session_id, uuid } = await RecordService.create();

        //Find our current record
        const created_record = await RecordModel.findOne({ _id: id });

        //Create an object of the data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: "en_GB",
                conversation: [],
            },
            session_id: session_id,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });

    test("create record with all information", async () => {
        //Create temporary variables
        const name = "test_name";
        const language = "en_us";
        const test_uuid = "my_uuid";

        //Create a new record
        const { id, session_id, uuid } = await RecordService.create(
            language,
            test_uuid,
            name
        );

        //Check the outputted uuid is valid
        expect(uuid).toBe(test_uuid);

        //Find our current record
        const created_record = await RecordModel.findOne({ _id: id });

        //Create an object of the data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: language,
                conversation: [],
            },
            session_id: session_id,
            name: name,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });
});
