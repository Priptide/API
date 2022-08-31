import FeedbackModel, { Feedback } from "../../../models/feedback";
import RecordModel, { Record } from "../../../models/record";

import FeedbackService from "../../feedback";
import mongoTesting from "../../../utils/mongoTesting";

describe("Feedback_Create", () => {
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

    test("average feedback - same scores", async () => {
        //Create and save feedback from this session
        const feedback_1: Feedback = {
            score: 2,
            session_id: "session_1",
        };

        //Add three feedbacks with different session but the same scores
        await new FeedbackModel(feedback_1).save();
        await new FeedbackModel({
            ...feedback_1,
            session_id: "session_2",
        }).save();
        await new FeedbackModel({
            ...feedback_1,
            session_id: "session_3",
        }).save();

        //Get the current average score.
        const avg_score = await FeedbackService.average_score();

        //Check this average score is equal too the same constant provided score.
        expect(avg_score).toBe(2);
    });

    test("average feedback - different scores", async () => {
        //Add fake different feedback data
        await new FeedbackModel({ score: 2, session_id: "session_1" }).save();
        await new FeedbackModel({ score: 4, session_id: "session_2" }).save();
        await new FeedbackModel({ score: 1, session_id: "session_3" }).save();
        await new FeedbackModel({ score: 3, session_id: "session_4" }).save();
        await new FeedbackModel({ score: 3, session_id: "session_5" }).save();

        //Get the average score of the feedback
        const avg_score = await FeedbackService.average_score();

        //Generate the average score we expect
        const expected_score = 13 / 5;

        //Check these two scores are the same
        expect(avg_score).toBe(expected_score);
    });
});
