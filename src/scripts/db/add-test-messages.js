// src/scripts/db/add-test-messages.js
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const crypto = require('crypto');

// Function to hash IP addresses (same as in your API route)
function hashIpAddress(ip, salt) {
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

async function addTestMessages() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB_NAME);
    const messagesCollection = db.collection('messages');
    const rateLimitsCollection = db.collection('rateLimits');
    
    // Generate random test data
    const testData = [];
    const numberOfMessages = 25; // Create 25 messages to test the 20 limit
    const MESSAGE_TTL = 3 * 24 * 60 * 60; // 3 days in seconds
    
    console.log(`Generating ${numberOfMessages} test messages...`);
    
    for (let i = 1; i <= numberOfMessages; i++) {
      // Create messages with different timestamps to test ordering
      const now = new Date();
      // Set creation time to be staggered - older messages first
      const createdAt = new Date(now.getTime() - (numberOfMessages - i) * 60000); // Each 1 minute apart
      
      const testIp = `192.168.1.${i % 254 + 1}`; // Generate different IPs
      const hashedIp = hashIpAddress(testIp, process.env.IP_SALT);
      
      testData.push({
        name: `Test User ${i}`,
        email: `test${i}@example.com`,
        message: `This is test message #${i}. Testing the message board functionality with a message that has enough characters to be valid.`,
        ipAddress: hashedIp,
        createdAt: createdAt,
        expiresAt: new Date(createdAt.getTime() + (MESSAGE_TTL * 1000))
      });
      
      // Also add rate limit entries
      await rateLimitsCollection.updateOne(
        { hashedIp },
        {
          $set: {
            hashedIp,
            lastMessageAt: createdAt,
            expiresAt: new Date(createdAt.getTime() + (3 * 24 * 60 * 60 * 1000)) // 3 days
          },
          $inc: { messageCount: 1 }
        },
        { upsert: true }
      );
    }
    
    // Insert messages one by one with a small delay to ensure proper ordering
    for (const message of testData) {
      await messagesCollection.insertOne(message);
      console.log(`Added message: "${message.message.substring(0, 30)}..."`);
      
      // Small delay to ensure distinct timestamps if needed
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Verify the count
    const count = await messagesCollection.countDocuments();
    console.log(`Total messages in database: ${count}`);
    
    if (count > 20) {
      console.log(`Warning: There are more than 20 messages (${count}). Your limit enforcement may not be working.`);
    } else if (count === 20) {
      console.log('Success! The database has exactly 20 messages, which means the limit is working.');
      
      // Check which messages were kept (should be the newest ones)
      const messages = await messagesCollection.find().sort({ createdAt: -1 }).toArray();
      console.log('Most recent message:', messages[0].message.substring(0, 30) + '...');
      console.log('Oldest message kept:', messages[messages.length - 1].message.substring(0, 30) + '...');
    } else {
      console.log(`There are only ${count} messages, which is less than the limit of 20.`);
    }
    
  } catch (error) {
    console.error('Error adding test messages:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
addTestMessages().catch(console.error);   