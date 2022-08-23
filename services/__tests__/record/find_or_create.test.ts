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

    test("send no uuid", async () => {
        //Call the find_or_create method
        const { id, session_id, uuid } = await RecordService.find_or_create();

        //Find new record
        const created_record = await RecordModel.findOne({ _id: id });

        //Create an object of the data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: "en_gb",
                conversation: [],
            },
            session_id: session_id,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });

    test("send no uuid with session id", async () => {
        const test_session_id = "test_session";

        //Call the find_or_create method
        const { id, session_id, uuid } = await RecordService.find_or_create(
            undefined,
            undefined,
            undefined,
            test_session_id
        );

        expect(session_id).not.toEqual(test_session_id);

        //Find new record
        const created_record = await RecordModel.findOne({ _id: id });

        //Create an object of the data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: "en_gb",
                conversation: [],
            },
            session_id: session_id,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });

    test("send uuid but no session id - without any records", async () => {
        //Create a test uuid
        const test_uuid = "my_uuid";

        //Call the find_or_create method
        const { id, session_id, uuid } = await RecordService.find_or_create(
            undefined,
            undefined,
            test_uuid
        );

        //Check the uuid hasn't been changed
        expect(uuid).toBe(test_uuid);

        //Find new record
        const created_record = await RecordModel.findOne({ _id: id });

        //Create an object of the data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: "en_gb",
                conversation: [],
            },
            session_id: session_id,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });

    test("send uuid but no session id - with active record", async () => {
        //Create a test uuid
        const test_uuid = "my_uuid";

        //Create a test record that is set too active
        const test_record: Record = {
            UUID: test_uuid,
            chat: {
                language: "en_gb",
                conversation: [],
            },
            session_id: "test_session",
            is_active: true,
        };

        //Save this record too the data base
        const test_model = await new RecordModel(test_record).save();

        //Call the find_or_create method
        const { id, session_id, uuid } = await RecordService.find_or_create(
            undefined,
            undefined,
            test_uuid
        );

        //Check the values are the same as our test record
        expect(uuid).toBe(test_record.UUID);
        expect(session_id).toBe(test_record.session_id);
        expect(id).toStrictEqual(test_model._id);

        //Find new record
        const created_record = await RecordModel.findOne({ _id: id });

        //Check that this record is the exact same model as our originally created model
        expect(created_record?.toJSON()).toStrictEqual(test_model.toJSON());
    });

    test("send uuid but no session id - with inactive record", async () => {
        //Create a test uuid
        const test_uuid = "my_uuid";

        //Create a test record that is set too inactive
        const test_record: Record = {
            UUID: test_uuid,
            chat: {
                language: "en_gb",
                conversation: [],
            },
            session_id: "test_session",
            is_active: false,
        };

        //Save this record too the data base
        const test_model = await new RecordModel(test_record).save();

        //Call the find_or_create method
        const { id, session_id, uuid } = await RecordService.find_or_create(
            undefined,
            undefined,
            test_uuid
        );

        //Check the uuid is the same as our original uuid
        expect(uuid).toBe(test_record.UUID);

        //Check the other values are different
        expect(session_id).not.toBe(test_record.session_id);
        expect(id).not.toStrictEqual(test_model._id);

        //Find new record
        const created_record = await RecordModel.findOne({ _id: id });

        //Check that this record is not the exact same model as our originally created model
        expect(created_record?.toJSON()).not.toStrictEqual(test_model.toJSON());

        //Create an object of the new data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: "en_gb",
                conversation: [],
            },
            session_id: session_id,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });

    test("send valid uuid and session id", async () => {
        //Create a test uuid
        const test_uuid = "my_uuid";

        //Create a test session id
        const test_session_id = "test_session";

        //Create a test record that is set too inactive
        const test_record: Record = {
            UUID: test_uuid,
            chat: {
                language: "en_gb",
                conversation: [],
            },
            session_id: test_session_id,
            is_active: true,
        };

        //Save this record too the data base
        const test_model = await new RecordModel(test_record).save();

        //Call the find_or_create method
        const { id, session_id, uuid } = await RecordService.find_or_create(
            undefined,
            undefined,
            test_uuid,
            test_session_id
        );

        //Check the uuid is the same as our original uuid
        expect(uuid).toBe(test_record.UUID);

        //Check the session id is the same as our original
        expect(session_id).toBe(test_session_id);

        //Check the id is the same as our original
        expect(id).toStrictEqual(test_model._id);

        //Find new record
        const created_record = await RecordModel.findOne({ _id: id });

        //Check that this record is the exact same model as our originally created model
        expect(created_record?.toJSON()).toStrictEqual(test_model.toJSON());
    });

    test("send uuid session id - with inactive record", async () => {
        //Create a test uuid
        const test_uuid = "my_uuid";

        //Create test session id
        const test_session_id = "test_session";

        //Create a test record that is set too inactive
        const test_record: Record = {
            UUID: test_uuid,
            chat: {
                language: "en_gb",
                conversation: [],
            },
            session_id: test_session_id,
            is_active: false,
        };

        //Save this record too the data base
        const test_model = await new RecordModel(test_record).save();

        //Call the find_or_create method
        const { id, session_id, uuid } = await RecordService.find_or_create(
            undefined,
            undefined,
            test_uuid,
            test_session_id
        );

        //Check the uuid is the same as our original uuid
        expect(uuid).toBe(test_record.UUID);

        //Check the other values are different
        expect(session_id).not.toBe(test_session_id);
        expect(id).not.toStrictEqual(test_model._id);

        //Find new record
        const created_record = await RecordModel.findOne({ _id: id });

        //Check that this record is not the exact same model as our originally created model
        expect(created_record?.toJSON()).not.toStrictEqual(test_model.toJSON());

        //Create an object of the new data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: "en_gb",
                conversation: [],
            },
            session_id: session_id,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });

    test("send uuid but invalid session id", async () => {
        //Create a test uuid
        const test_uuid = "my_uuid";

        //Create test session id
        const test_session_id = "test_session";

        //Call the find_or_create method
        const { id, session_id, uuid } = await RecordService.find_or_create(
            undefined,
            undefined,
            test_uuid,
            test_session_id
        );

        //Check the uuid is the same as our original uuid
        expect(uuid).toBe(test_uuid);

        //Check the session id values are different
        expect(session_id).not.toBe(test_session_id);

        //Find new record
        const created_record = await RecordModel.findOne({ _id: id });

        //Create an object of the new data we expect too see
        const expected_data: Record = {
            _id: id,
            UUID: uuid,
            chat: {
                language: "en_gb",
                conversation: [],
            },
            session_id: session_id,
            is_active: true,
        };

        //Use spread operator to add the version of our data and then compare too the record.
        expect(created_record).toMatchObject({ ...expected_data, __v: 0 });
    });
});
