import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Utility function to create a MongoDB client
const createMongoClient = (): MongoClient => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is not set");
  }
  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
};

// Unit Test for MongoDB connection
describe("MongoDB Connection Test", () => {
  let client: MongoClient;

  beforeAll(() => {
    // Initialize the MongoDB client
    client = createMongoClient();
  });

  afterAll(async () => {
    // Close the MongoDB connection after tests
    if (client) {
      await client.close();
    }
  });

  it("should successfully connect to MongoDB Atlas", async () => {
    try {
      await client.connect(); // Attempt to connect
      console.log("✅ Connected to MongoDB Atlas successfully!");
      expect(true).toBe(true); // Assert successful connection
    } catch (err) {
      if (err instanceof Error) {
        console.error("❌ Failed to connect to MongoDB Atlas:", err.message);
        throw err; // Re-throw error for test to fail
      }
    }
  });
});
