import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.ATLAS_URI;

let client;
let db;
let connectionPromise = null; // Ovo sprječava paralelno spajanje

export async function getDb() {
  // 1. Ako već imamo bazu, odmah je vrati
  if (db) return db;

  // 2. Ako je spajanje već u tijeku, vrati isto obećanje (ne otvaraj novu vezu)
  if (!connectionPromise) {
    client = new MongoClient(uri);

    connectionPromise = client
      .connect()
      .then(() => {
        db = client.db('cijene');
        console.log('✅ MongoDB connected (Singleton)');
        return db;
      })
      .catch((err) => {
        connectionPromise = null; // Ako ne uspije, dopusti ponovni pokušaj
        throw err;
      });
  }

  return connectionPromise;
}
