const { MongoClient, ServerApiVersion } = require("mongodb");
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI environment variable is not set");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function testConnection(): Promise<void> {
  try {
    await client.connect(); // Connect to the MongoDB cluster
    console.log("✅ Connected to MongoDB Atlas successfully!");
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Failed to connect to MongoDB Atlas:", err.message);
    } else {
      console.error("❌ Failed to connect to MongoDB Atlas:", err);
    }
  } finally {
    await client.close(); // Close the connection
  }
}

testConnection();
