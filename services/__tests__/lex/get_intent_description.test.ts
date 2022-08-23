import RecordModel, { Record } from "../../../models/record";

import LexService from "../../lex";
import mongoTesting from "../../../utils/mongoTesting";

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

    test("Get FallBackIntent utterance", async () => {
        try {
            const intent =
                "How_to_Set_Home_Waypoints_and_Favourite_Locations_Using_SYNC_2";
            const expectedUtterance =
                "How to Set Home, Waypoints and Favourite Locations Using SYNC 2";
            //Try send with empty message
            const utterance = await LexService.get_intent_utterance(intent);

            // Expect the description
            expect(utterance).toBe(expectedUtterance);
        } catch (error: any) {
            //Check we have sent the expect error
            console.log(error.message);
        }
    });
});
