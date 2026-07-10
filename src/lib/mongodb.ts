import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global.__mongoClientPromise) {
    global.__mongoClientPromise = client.connect();
  }
  clientPromise = global.__mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export const getMongoClient = async () => clientPromise;

export const getDatabase = async () => {
  const connectedClient = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME;

  if (dbName) {
    return connectedClient.db(dbName);
  }

  return connectedClient.db();
};
