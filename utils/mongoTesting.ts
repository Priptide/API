import mongoose from "mongoose";
const { MongoMemoryServer } = require("mongodb-memory-server");

var mongod: typeof MongoMemoryServer.create;

export default {
    /**
     * Connect to the in-memory database.
     */
    connect: async () => {
        mongod = await MongoMemoryServer.create();
        const uri = await mongod.getUri();
        await mongoose.connect(uri);
    },

    /**
     * Drop database, close the connection and stop mongod.
     */
    closeDatabase: async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongod.stop();
    },

    /**
     * Remove all the data for all db collections.
     */
    clearDatabase: async () => {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    },
};
