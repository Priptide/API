import RecordModel, { Record } from "../../../models/record";

import RecordService from "../../record";
import mongoTesting from "../../../utils/mongoTesting";

describe("Record_Update", () => {
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

    //Test for uuid error
    test("get with invalid uuid", async () => {
        try {
            //Try send with empty uuid
            await RecordService.get_by_uuid("");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("Invalid uuid");
        }
    });

    //Test for no active record error (no records)
    test("get with no past records", async () => {
        try {
            //Try send with no record and valid uuid
            await RecordService.get_by_uuid("my_user");

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
            await RecordService.get_by_uuid("my_user");

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("No records found");
        }
    });

    //Test for single result with chats
    test("get with one past active record", async () => {
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
            await RecordService.get_by_uuid(record_model.UUID);

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("No records found");
        }
    });

    //Test for single result with chats
    test("get with one active and one inactive record", async () => {
        //Create record data as inactive
        const inactive_record_model: Record = {
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
            session_id: "test_session_inactive",
            is_active: false,
        };

        //Create record data as active
        const active_record_model: Record = {
            UUID: "test_uuid",
            chat: {
                language: "en_GB",
                conversation: [
                    {
                        text: "my message",
                        time: new Date(Date.now()),
                        is_bot: false,
                    },
                    {
                        text: "bot message",
                        time: new Date(Date.now() + 6000),
                        is_bot: false,
                    },
                ],
            },
            session_id: "test_session_active",
            is_active: true,
        };

        //Upload both the records
        const inactive_record = await new RecordModel(
            inactive_record_model
        ).save();
        const active_record = await new RecordModel(active_record_model).save();

        //Send with valid uuid
        const { session_id, uuid, chat, name } =
            await RecordService.get_by_uuid(inactive_record.UUID);

        //Check we received the right data.
        expect(name).toBe("");
        expect(session_id).toBe(active_record_model.session_id);
        expect(uuid).toBe(active_record_model.UUID);
        expect(chat).toMatchObject(active_record_model.chat);
    });

    //Test for multiple with chats in order
    test("get with two active records in order", async () => {
        //Create first older record data
        const first_record_model: Record = {
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
            session_id: "test_session_inactive",
            is_active: true,
        };

        //Create second newer record data
        const second_record_model: Record = {
            UUID: "test_uuid",
            chat: {
                language: "en_GB",
                conversation: [
                    {
                        text: "my message",
                        time: new Date(Date.now()),
                        is_bot: false,
                    },
                    {
                        text: "bot message",
                        time: new Date(Date.now() + 6000),
                        is_bot: true,
                    },
                ],
            },
            session_id: "test_session_active",
            name: "test",
            is_active: true,
        };

        //Upload both the records
        const first_record = await new RecordModel(first_record_model).save();
        const second_record = await new RecordModel(second_record_model).save();

        //Send with valid uuid
        const { session_id, uuid, chat, name } =
            await RecordService.get_by_uuid(first_record_model.UUID);

        //Check we received the right data.
        expect(name).toBe(second_record_model.name);
        expect(session_id).toBe(second_record_model.session_id);
        expect(uuid).toBe(second_record_model.UUID);
        expect(chat).toMatchObject(second_record_model.chat);
    });

    //Test for multiple with chats in reverse order
    test("get with two active records in reverse order", async () => {
        //Create first newer record data
        const first_record_model: Record = {
            UUID: "test_uuid",
            chat: {
                language: "en_GB",
                conversation: [
                    {
                        text: "my message",
                        time: new Date(Date.now()),
                        is_bot: false,
                    },

                    {
                        text: "bot message",
                        time: new Date(Date.now() + 6000),
                        is_bot: true,
                    },
                ],
            },
            session_id: "test_session_inactive",
            name: "test1",
            is_active: true,
        };

        //Create second older record data
        const second_record_model: Record = {
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
            session_id: "test_session_active",
            name: "test2",
            is_active: true,
        };

        //Upload both the records
        const first_record = await new RecordModel(first_record_model).save();
        const second_record = await new RecordModel(second_record_model).save();

        //Send with valid uuid
        const { session_id, uuid, chat, name } =
            await RecordService.get_by_uuid(first_record_model.UUID);

        //Check we received the right data.
        expect(name).toBe(first_record_model.name);
        expect(session_id).toBe(first_record_model.session_id);
        expect(uuid).toBe(first_record_model.UUID);
        expect(chat).toMatchObject(first_record_model.chat);
    });

    //Test with one having chats and one not
    test("get with two active records one older with messages and a newer one without messages", async () => {
        //Create first older record data
        const first_record_model: Record = {
            UUID: "test_uuid",
            chat: {
                language: "en_GB",
                conversation: [
                    {
                        text: "my message",
                        time: new Date(Date.now() - 6000),
                        is_bot: false,
                    },

                    {
                        text: "bot message",
                        time: new Date(Date.now() - 1000),
                        is_bot: true,
                    },
                ],
            },
            session_id: "test_session_inactive",
            name: "test1",
            is_active: true,
        };

        //Create second newer record data without chats
        const second_record_model: Record = {
            UUID: "test_uuid",
            chat: {
                language: "en_GB",
                conversation: [],
            },
            session_id: "test_session_active",
            name: "test2",
            is_active: true,
        };

        //Upload both the records
        const first_record = await new RecordModel(first_record_model).save();
        const second_record = await new RecordModel(second_record_model).save();

        //Send with valid uuid
        const { session_id, uuid, chat, name } =
            await RecordService.get_by_uuid(first_record_model.UUID);

        //Check we received the right data.
        expect(name).toBe(second_record_model.name);
        expect(session_id).toBe(second_record_model.session_id);
        expect(uuid).toBe(second_record_model.UUID);
        expect(chat).toMatchObject(second_record_model.chat);
    });
});
