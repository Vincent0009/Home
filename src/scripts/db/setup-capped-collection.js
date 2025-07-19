// src/scripts/db/setup-capped-collection.js
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

async function setupCappedCollection() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);

    // Drop existing messages collection if it exists
    try {
      await db.collection('messages').drop();
      console.log('Dropped existing messages collection');
    } catch (e) {
      console.log('No existing messages collection to drop');
    }

    // Create a new capped collection
    await db.createCollection('messages', {
      capped: true,
      size: 1000000, // 1MB, adjust as needed
      max: 20 // Maximum number of documents
    });

    console.log('Created capped collection for messages with 20 document limit');

    // Set up TTL index for expiration
    await db.collection('messages').createIndex(
      { "expiresAt": 1 },
      { expireAfterSeconds: 0 }
    );

    // Index for message queries
    await db.collection('messages').createIndex({ "createdAt": 1 });
    await db.collection('messages').createIndex({ "createdAt": -1 });

    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error setting up capped collection:', error);
  } finally {
    await client.close();
  }
}

setupCappedCollection();