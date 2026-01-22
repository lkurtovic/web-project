import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.ATLAS_URI;
let client;
let db;

export async function getDb() {
  if (!db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('cijene');
    console.log('✅ MongoDB connected');
  }
  return db;
}
