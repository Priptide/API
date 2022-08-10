import mongoTesting from "../../../utils/mongoTesting";

import RecordService from "../../record";

import RecordModel from "../../../models/record";

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
        const { id, session_id, uuid } = await RecordService.create(
            undefined,
            "my_uuid",
            "test_name"
        );

        console.log(id);

        const created_record = await RecordModel.findOne({ _id: id });

        expect(created_record).toBeDefined();
    });

    test("create record without uuid", async () => {});

    test("create record without name", async () => {});

    test("create record without any information", async () => {});

    test("create record with all information", async () => {});
});
