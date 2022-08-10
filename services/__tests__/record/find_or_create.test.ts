import mongoTesting from "../../../utils/mongoTesting";

import RecordService from "../../record";

import RecordModel, { Record } from "../../../models/record";

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
});
