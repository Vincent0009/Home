// src/scripts/db/setup-indexes.js
// Run this script to set up TTL indexes
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

async function setupIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);

    // TTL index for messages (3 days)
    // Note: Messages are also limited to 20 entries total, with oldest being removed first
    await db.collection('messages').createIndex(
      { "expiresAt": 1 },
      { expireAfterSeconds: 0 }
    );

    // TTL index for rate limits (3 days)
    // Rate limits are maintained separately from messages to prevent spam
    await db.collection('rateLimits').createIndex(
      { "expiresAt": 1 },
      { expireAfterSeconds: 0 }
    );

    // Index for rate limiting queries
    await db.collection('rateLimits').createIndex({ "hashedIp": 1 });

    // Index for message queries - important for finding oldest messages efficiently
    await db.collection('messages').createIndex({ "createdAt": 1 });
    await db.collection('messages').createIndex({ "createdAt": -1 });

    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error setting up indexes:', error);
  } finally {
    await client.close();
  }
}

setupIndexes();