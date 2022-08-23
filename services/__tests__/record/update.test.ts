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

    //Test updating without required information
    test("send invalid message", async () => {
        try {
            //Try send with empty message
            await RecordService.update_record("", false);

            // Fail test if above expression doesn't throw anything.
            expect(true).toBe(false);
        } catch (error: any) {
            //Check we have sent the expect error
            expect(error.message).toBe("No valid message");
        }
    });

    //Updating without any extra information (USER)
    test("send valid message only - USER", async () => {
        //Try send with only message
        const { uuid, session_id } = await RecordService.update_record(
            "my message",
            false
        );

        //Find the record
        const record = await RecordModel.findOne({
            UUID: uuid,
            session_id: session_id,
        });

        //Check this record exists
        expect(record).toBeDefined();

        //Check the record is active
        expect(record?.is_active).toBe(true);

        //Check the language is defaulted
        expect(record?.chat.language).toEqual("en_GB");

        //Check the chat length is 1
        expect(record?.chat.conversation.length).toBe(1);

        //Check the information is the same as inputted
        expect(record?.chat.conversation[0].text).toEqual("my message");
        expect(record?.chat.conversation[0].is_bot).toEqual(false);
    });

    //Updating without any extra information (BOT)
    test("send valid message only - BOT", async () => {
        //Try send with only message
        const { uuid, session_id } = await RecordService.update_record(
            "my message",
            false
        );

        //Find the record
        const record = await RecordModel.findOne({
            UUID: uuid,
            session_id: session_id,
        });

        //Check this record exists
        expect(record).toBeDefined();

        //Check the record is active
        expect(record?.is_active).toBe(true);

        //Check the language is defaulted
        expect(record?.chat.language).toEqual("en_GB");

        //Check the chat length is 1
        expect(record?.chat.conversation.length).toBe(1);

        //Check the information is the same as inputted
        expect(record?.chat.conversation[0].text).toEqual("my message");
        expect(record?.chat.conversation[0].is_bot).toEqual(false);
    });

    //Updating with session and uuid but no valid session - (USER)
    test("send valid message, uuid and session id with no current session - USER", async () => {
        //Try send with message, uuid, session id
        const { uuid, session_id } = await RecordService.update_record(
            "my message",
            false,
            "my_uuid",
            "my_session"
        );

        //Check the uuid is unchanged
        expect(uuid).toEqual("my_uuid");

        //Check the session id is different
        if (session_id == "my_session") expect(true).toBe(false);

        //Find the record
        const record = await RecordModel.findOne({
            UUID: uuid,
            session_id: session_id,
        });

        //Check this record exists
        expect(record).toBeDefined();

        //Check the record is active
        expect(record?.is_active).toBe(true);

        //Check the language is defaulted
        expect(record?.chat.language).toEqual("en_GB");

        //Check the chat length is 1
        expect(record?.chat.conversation.length).toBe(1);

        //Check the information is the same as inputted
        expect(record?.chat.conversation[0].text).toEqual("my message");
        expect(record?.chat.conversation[0].is_bot).toEqual(false);
    });

    //Updating with session and uuid but no valid session - (BOT)
    test("send valid message, uuid and session id with no current session - USER", async () => {
        //Try send with message, uuid, session id
        const { uuid, session_id } = await RecordService.update_record(
            "my message",
            true,
            "my_uuid",
            "my_session"
        );

        //Check the uuid is unchanged
        expect(uuid).toEqual("my_uuid");

        //Check the session id is different
        if (session_id == "my_session") expect(true).toBe(false);

        //Find the record
        const record = await RecordModel.findOne({
            UUID: uuid,
            session_id: session_id,
        });

        //Check this record exists
        expect(record).toBeDefined();

        //Check the record is active
        expect(record?.is_active).toBe(true);

        //Check the language is defaulted
        expect(record?.chat.language).toEqual("en_GB");

        //Check the chat length is 1
        expect(record?.chat.conversation.length).toBe(1);

        //Check the information is the same as inputted
        expect(record?.chat.conversation[0].text).toEqual("my message");
        expect(record?.chat.conversation[0].is_bot).toEqual(true);
    });

    //Updating with session and uuid but inactive session
    test("update an inactive challenge", async () => {
        //Create record data as inactive
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

        //Try send with message, uuid, session id
        const { uuid, session_id } = await RecordService.update_record(
            "my message",
            true,
            init_record.UUID,
            init_record.session_id
        );

        //Check the uuid is unchanged
        expect(uuid).toEqual(init_record.UUID);

        //Check the session id is different
        if (session_id == init_record.session_id) expect(true).toBe(false);

        //Find the record
        const record = await RecordModel.findOne({
            UUID: uuid,
            session_id: session_id,
        });

        //Check this record exists
        expect(record).toBeDefined();

        //Check the record is active
        expect(record?.is_active).toBe(true);

        //Check the language is defaulted
        expect(record?.chat.language).toEqual("en_GB");

        //Check the chat length is 1
        expect(record?.chat.conversation.length).toBe(1);

        //Check the information is the same as inputted
        expect(record?.chat.conversation[0].text).toEqual("my message");
        expect(record?.chat.conversation[0].is_bot).toEqual(true);
    });

    //Updating with session and uuid and valid session
    test("update valid record", async () => {
        //Create record data as active
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
        const init_record = await new RecordModel(record_model).save();

        //Try send with message, uuid, session id
        const { uuid, session_id } = await RecordService.update_record(
            "my message",
            false,
            init_record.UUID,
            init_record.session_id
        );

        //Check the uuid is unchanged
        expect(uuid).toEqual(init_record.UUID);

        //Check the session id is the same
        expect(session_id).toBe(init_record.session_id);

        //Find the record
        const record = await RecordModel.findOne({
            UUID: uuid,
            session_id: session_id,
        });

        //Check this record exists
        expect(record).toBeDefined();

        //Check the record is active
        expect(record?.is_active).toBe(true);

        //Check the language is defaulted
        expect(record?.chat.language).toEqual("en_GB");

        //Check the chat length is 1
        expect(record?.chat.conversation.length).toBe(1);

        //Check the information is the same as inputted
        expect(record?.chat.conversation[0].text).toEqual("my message");
        expect(record?.chat.conversation[0].is_bot).toEqual(false);
    });

    //Updating with session and uuid and valid session - existing messages (USER)
    test("update record with existing message - USER", async () => {
        //Create record data as active
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
            is_active: true,
        };

        //Save this data too the mock mongodb
        const init_record = await new RecordModel(record_model).save();

        //Try send with message, uuid, session id
        const { uuid, session_id } = await RecordService.update_record(
            "my message",
            false,
            init_record.UUID,
            init_record.session_id
        );

        //Check the uuid is unchanged
        expect(uuid).toEqual(init_record.UUID);

        //Check the session id is the same
        expect(session_id).toBe(init_record.session_id);

        //Find the record
        const record = await RecordModel.findOne({
            UUID: uuid,
            session_id: session_id,
        });

        //Check this record exists
        expect(record).toBeDefined();

        //Check the record is active
        expect(record?.is_active).toBe(true);

        //Check the language is defaulted
        expect(record?.chat.language).toEqual("en_GB");

        //Check the chat length is 2
        expect(record?.chat.conversation.length).toBe(2);

        //Check the first message is the same
        expect(record?.chat.conversation[0].text).toEqual(
            record_model.chat.conversation[0].text
        );
        expect(record?.chat.conversation[0].is_bot).toEqual(false);

        //Check the information is the same as inputted
        expect(record?.chat.conversation[1].text).toEqual("my message");
        expect(record?.chat.conversation[1].is_bot).toEqual(false);
    });

    //Updating with session and uuid and valid session - existing messages (BOT)
    test("update record with existing message - BOT", async () => {
        //Create record data as active
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
            is_active: true,
        };

        //Save this data too the mock mongodb
        const init_record = await new RecordModel(record_model).save();

        //Try send with message, uuid, session id
        const { uuid, session_id } = await RecordService.update_record(
            "my message",
            true,
            init_record.UUID,
            init_record.session_id
        );

        //Check the uuid is unchanged
        expect(uuid).toEqual(init_record.UUID);

        //Check the session id is the same
        expect(session_id).toBe(init_record.session_id);

        //Find the record
        const record = await RecordModel.findOne({
            UUID: uuid,
            session_id: session_id,
        });

        //Check this record exists
        expect(record).toBeDefined();

        //Check the record is active
        expect(record?.is_active).toBe(true);

        //Check the language is defaulted
        expect(record?.chat.language).toEqual("en_GB");

        //Check the chat length is 2
        expect(record?.chat.conversation.length).toBe(2);

        //Check the first message is the same
        expect(record?.chat.conversation[0].text).toEqual(
            record_model.chat.conversation[0].text
        );
        expect(record?.chat.conversation[0].is_bot).toEqual(false);

        //Check the information is the same as inputted
        expect(record?.chat.conversation[1].text).toEqual("my message");
        expect(record?.chat.conversation[1].is_bot).toEqual(true);
    });

    //Updating with session and uuid and valid session - using language and name
    test("send invalid message", async () => {
        //Create record data as active
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
            is_active: true,
            name: "test",
        };

        //Save this data too the mock mongodb
        const init_record = await new RecordModel(record_model).save();

        //Try send with message, uuid, session id
        const { uuid, session_id } = await RecordService.update_record(
            "my message",
            true,
            init_record.UUID,
            init_record.session_id,
            "fr_FR",
            "charlie"
        );

        //Check the uuid is unchanged
        expect(uuid).toEqual(init_record.UUID);

        //Check the session id is the same
        expect(session_id).toBe(init_record.session_id);

        //Find the record
        const record = await RecordModel.findOne({
            UUID: uuid,
            session_id: session_id,
        });

        //Check this record exists
        expect(record).toBeDefined();

        //Check the record is active
        expect(record?.is_active).toBe(true);

        //Check the language is set to our value
        expect(record?.chat.language).toEqual("fr_FR");

        //Check the name is updated
        expect(record?.name).toEqual("charlie");

        //Check the chat length is 2
        expect(record?.chat.conversation.length).toBe(2);

        //Check the first message is the same
        expect(record?.chat.conversation[0].text).toEqual(
            record_model.chat.conversation[0].text
        );
        expect(record?.chat.conversation[0].is_bot).toEqual(false);

        //Check the information is the same as inputted
        expect(record?.chat.conversation[1].text).toEqual("my message");
        expect(record?.chat.conversation[1].is_bot).toEqual(true);
    });
});
