// app/api/items/route.ts
import { NextResponse } from 'next/server';
// Import Next.js's response helper

import clientPromise from '@/lib/mongodb';
// Import our database connection module

export async function GET() {
  try {
    console.log("Attempting to connect to MongoDB...");
    const client = await clientPromise;
    console.log("MongoDB client connected successfully");
    
    const db = client.db(process.env.MONGODB_DB_NAME);
    console.log(`Using database: ${process.env.MONGODB_DB_NAME}`);
    
    const items = await db.collection('items').find({}).toArray();
    console.log(`Retrieved ${items.length} items from collection`);
    
    return NextResponse.json({
      success: true,
      items: items,
      count: items.length
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch items',
      details: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Define a function to handle POST requests to /api/items
  try {
    const body = await request.json();
    // Parse the JSON body from the incoming request
    
    const client = await clientPromise;
    // Wait for the database connection
    
    const db = client.db(process.env.MONGODB_DB_NAME);
    // Select the database
    
    const result = await db.collection('items').insertOne(body);
    // Insert the request body as a new document in the 'items' collection
    
    return NextResponse.json(result, { status: 201 });
    // Return the result with 201 status code (created)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
    // Return an error message with 500 status code
  }
}
