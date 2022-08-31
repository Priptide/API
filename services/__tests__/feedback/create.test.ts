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

    test("send invalid score - below zero", async () => {
        try {
            //Try send with invalid score
            await FeedbackService.create_feedback(-1, "test_session");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Invalid score");
        }
    });

    test("send invalid score - above five", async () => {
        try {
            //Try send with invalid score
            await FeedbackService.create_feedback(6, "test_session");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Invalid score");
        }
    });

    test("send empty session id", async () => {
        try {
            //Try send with empty session id
            await FeedbackService.create_feedback(3, "");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Missing session id");
        }
    });

    test("send invalid session id", async () => {
        try {
            //Try send with invalid session id
            await FeedbackService.create_feedback(3, "invalid_session");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Invalid session id");
        }
    });

    test("send already submitted session id", async () => {
        try {
            //Create a valid record
            const test_record: Record = {
                UUID: "test_uuid",
                chat: {
                    language: "en_GB",
                    conversation: [],
                },
                session_id: "test_session",
                is_active: true,
            };

            //Save this record
            await new RecordModel(test_record).save();

            //Create and save feedback from this session
            const test_feedback: Feedback = {
                score: 2,
                session_id: test_record.session_id,
            };

            await new FeedbackModel(test_feedback).save();

            //Try send with already used session id
            await FeedbackService.create_feedback(3, test_record.session_id);

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Feedback already received");
        }
    });

    test("send already valid information - no comment", async () => {
        //Create a valid record
        const test_record: Record = {
            UUID: "test_uuid",
            chat: {
                language: "en_GB",
                conversation: [],
            },
            session_id: "test_session",
            is_active: true,
        };

        //Save this record
        await new RecordModel(test_record).save();

        //Create expected feedback from this session
        const expected_feedback: Feedback = {
            score: 3,
            session_id: test_record.session_id,
        };

        //Try send with already used session id
        let feedback_id = await FeedbackService.create_feedback(
            3,
            test_record.session_id
        );

        //Find the feedback we created
        const created_feedback = await FeedbackModel.findById(feedback_id);

        expect(created_feedback).toMatchObject(expected_feedback);
    });

    test("send already valid information - comment", async () => {
        //Create a valid record
        const test_record: Record = {
            UUID: "test_uuid",
            chat: {
                language: "en_GB",
                conversation: [],
            },
            session_id: "test_session",
            is_active: true,
        };

        //Save this record
        await new RecordModel(test_record).save();

        //Create expected feedback from this session
        const expected_feedback: Feedback = {
            score: 3,
            session_id: test_record.session_id,
            comment: "Great service",
        };

        //Try send with already used session id
        let feedback_id = await FeedbackService.create_feedback(
            3,
            test_record.session_id,
            "Great service"
        );

        //Find the feedback we created
        const created_feedback = await FeedbackModel.findById(feedback_id);

        expect(created_feedback).toMatchObject(expected_feedback);
    });
});
