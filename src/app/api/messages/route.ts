import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
// Rate limiting constants
const RATE_LIMIT_WINDOW = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
const MAX_MESSAGES_PER_IP = 1;
const MESSAGE_TTL = 3 * 24 * 60 * 60; // 3 days in seconds

// Hash IP address for privacy
function hashIpAddress(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT).digest('hex');
}

// Get client IP address
function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return '127.0.0.1'; // Fallback
}

// Validate message content
function validateMessage(data: any) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2 || data.name.trim().length > 50) {
    errors.push('Name must be between 2 and 50 characters');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.message || data.message.trim().length < 10 || data.message.trim().length > 500) {
    errors.push('Message must be between 10 and 500 characters');
  }
  
  // Check for spam patterns
  const spamPatterns = [
    /https?:\/\//gi, // URLs
    /\b(buy|sell|cheap|free|money|cash|prize|winner)\b/gi, // Spam keywords
  ];
  
  if (spamPatterns.some(pattern => pattern.test(data.message))) {
    errors.push('Message contains prohibited content');
  }
  
  return errors;
}

// GET - Retrieve messages
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    
    const messages = await db.collection('messages')
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .project({ 
        name: 1, 
        message: 1, 
        createdAt: 1
        // No need to explicitly exclude fields - they won't be returned
      })
      .toArray();
    
    return NextResponse.json({
      success: true,
      messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch messages'
    }, { status: 500 });
  }
}

// POST - Create new message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clientIp = getClientIp(request);
    const hashedIp = hashIpAddress(clientIp);
    
    // Validate input
    const validationErrors = validateMessage(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: validationErrors
      }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    
    // Check rate limiting
    const now = new Date();
    const rateLimitCheck = await db.collection('rateLimits').findOne({
      hashedIp,
      lastMessageAt: { 
        $gte: new Date(now.getTime() - RATE_LIMIT_WINDOW) 
      }
    });
    
    if (rateLimitCheck && rateLimitCheck.messageCount >= MAX_MESSAGES_PER_IP) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. You can only post one message per 3 days.'
      }, { status: 429 });
    }
    
    // Check if we already have 20 messages
    const messageCount = await db.collection('messages').countDocuments();
    
    // If we have 20 or more messages, remove the oldest one
    if (messageCount >= 20) {
      const oldestMessage = await db.collection('messages')
        .find()
        .sort({ createdAt: 1 })
        .limit(1)
        .toArray();
        
      if (oldestMessage.length > 0) {
        await db.collection('messages').deleteOne({ _id: oldestMessage[0]._id });
      }
    }
    
    // Create message
    const messageDoc = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      message: body.message.trim(),
      ipAddress: hashedIp,
      createdAt: now,
      expiresAt: new Date(now.getTime() + (MESSAGE_TTL * 1000))
    };
    
    const result = await db.collection('messages').insertOne(messageDoc);
    
    // Update rate limiting
    await db.collection('rateLimits').updateOne(
      { hashedIp },
      {
        $set: {
          hashedIp,
          lastMessageAt: now,
          expiresAt: new Date(now.getTime() + RATE_LIMIT_WINDOW)
        },
        $inc: { messageCount: 1 }
      },
      { upsert: true }
    );
    
    return NextResponse.json({
      success: true,
      messageId: result.insertedId
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create message'
    }, { status: 500 });
  }
}