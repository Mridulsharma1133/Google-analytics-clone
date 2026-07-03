import { MongoClient } from "mongodb";

const uri ="mongodb+srv://GA26:UqmDA6RLhdFzg1Ia@cluster0.0z2hufx.mongodb.net/";

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log("✅ Connected");
  await client.close();
} catch (err) {
  console.error("❌ Error:", err);
}