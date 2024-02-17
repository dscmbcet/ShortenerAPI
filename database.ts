/*
Shortener API
GDSC MBCET
*/

import { MongoClient } from "mongo";

import config from "$env";

console.log("Connecting to MongoDB...");
const client = new MongoClient();
const MONGO_URL = new URL(config.MONGO_URI);
if (!MONGO_URL.searchParams.has("authMechanism")) {
  MONGO_URL.searchParams.set("authMechanism", "SCRAM-SHA-1");
}
try {
  await client.connect(MONGO_URL.href);
} catch (err) {
  console.error("Error connecting to MongoDB", err);
  throw err;
}
const db = client.database("GDSC-Shortener");

interface URLStorageSchema {
  url: string;
  hash: string;
  createdAt: Date;
  clicks: number;
  uniqueClicks: number;
}

const URLStorage = db.collection<URLStorageSchema>("URLStorage");

async function doesHashExist(hash: string) {
  const result = await URLStorage.findOne({ hash });
  return !!result;
}

async function createShortURL(url: string, hash: string) {
  hash = hash.toLowerCase();
  if (await doesHashExist(hash)) {
    return false;
  }
  await URLStorage.insertOne({
    url,
    hash,
    createdAt: new Date(),
    clicks: 0,
    uniqueClicks: 0,
  });

  return true;
}

async function getURL(hash: string) {
  hash = hash.toLowerCase();
  const result = await URLStorage.findOne({ hash });
  return result;
}

export { createShortURL, getURL };
