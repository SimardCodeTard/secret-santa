import { Collection, Db, DeleteResult, InsertOneResult, MongoClient, ObjectId, ServerApiVersion, UpdateResult } from "mongodb";
import { Logger } from "./logger";
import { assertDefined } from "./utils";
import { MongodItemType } from "./types/database";

export enum CollectionNamesEnum {
    USER = 'user',
    DRAW = 'draw',
    MEMBER = 'member'
}

export const ENCRYPTION_SALT_ROUNDS = Number(process.env.ENCRYPTION_SALT_ROUNDS as string);
assertDefined(ENCRYPTION_SALT_ROUNDS);

// Shared MongoClient instance.
let client: MongoClient | undefined;

const DB_NAME = process.env.DB_NAME as string;
assertDefined(DB_NAME);

const MONGO_URI = process.env.MONGO_DB_URI as string;
assertDefined(MONGO_URI);

// Options for MongoClient in production environment.
const productionMongoClientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
};

let pendingRequests = 0;

// Wrapper function to handle pending requests
const usePendingRequests = async <T>(operation: () => Promise<T>): Promise<T> => {
    pendingRequests++;
    let operationResult
    try {
        operationResult = await operation();
        Logger.debug('operation result : ' + JSON.stringify(operationResult))
        return operationResult;
    } finally {
        pendingRequests--;
        closeClient();
    }
};

// Closes the MongoClient and resets the client.
const closeClient = async () => {
    Logger.debug("trying to close client")
    if (client && pendingRequests === 0) {
        await client.close();
        client = undefined;
        Logger.debug("client closed");
    } else if (client) {
        Logger.debug("did not close client: requests still pending");
        setTimeout(closeClient, 250);
    } else {
        Logger.debug("did not close client: client already closed");
    }
};

// Retrieves or initializes the MongoClient.
const getClient = async (): Promise<MongoClient> => {
    if (!client) {
        client = new MongoClient(
            MONGO_URI as string,
            productionMongoClientOptions
        );
        await client.connect();
    }
    return client;
};

export const getDb = async (): Promise<Db> => (await getClient()).db(DB_NAME);

export const getCollection = async (collectionName: CollectionNamesEnum): Promise<Collection> => (await getDb()).collection(collectionName);

export const findAll = async <T extends MongodItemType> (collection: Collection): Promise<T[]> => {
    Logger.debug("finding all in collection " + collection.collectionName);
    return usePendingRequests(async () => {
        return await collection.find({}).toArray() as T[];
    });
};

export const findMany = async <T extends MongodItemType> (collection: Collection, params: object): Promise<T[]> => {
    Logger.debug("Finding with params " + JSON.stringify(params) + " in Collection " + collection.collectionName);
    return usePendingRequests(async () => {
        return await collection.find(params).toArray() as T[];
    });
}

export const findOne = async <T extends MongodItemType> (collection: Collection, params: object): Promise<T> => {
    Logger.debug("Finding with params " + JSON.stringify(params) + " in Collection " + collection.collectionName);
    return usePendingRequests(async () => {
        return await collection.findOne(params) as T;
    });
}

export const deleteById = async (collection: Collection, id: ObjectId): Promise<DeleteResult> => {
    Logger.debug("deleting item with id " + id + " in collection " + collection.collectionName);
    return usePendingRequests(async () => {
        return await collection.deleteOne({_id: new ObjectId(id)});
    });
};

export const insertOne = async <T extends MongodItemType> (collection: Collection, item: T): Promise<InsertOneResult> => {
    Logger.debug("inserting item " + JSON.stringify(item) + " in collection " + collection.collectionName);
    return usePendingRequests(async () => {
        return await collection.insertOne({...item});
    });
};

export const updateOne = async <T extends MongodItemType> (collection: Collection, item: T): Promise<null | UpdateResult> => {
    Logger.debug("updating item " + JSON.stringify(item) + " in collection " + collection.collectionName);
    const { _id, ...updateData } = item; // Destructure to separate _id from the rest of the data
    
    if(!_id) {
        return null;
    }

    return usePendingRequests(async () => {
        return await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData }
        );
    });
};
