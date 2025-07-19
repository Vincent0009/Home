import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    
    // Test a simple operation (ping)
    await db.admin().ping();
    
    return NextResponse.json({
      success: true,
      message: 'Connected to MongoDB successfully!',
      database: process.env.MONGODB_DB_NAME,
      collections: collections.map(col => col.name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to MongoDB',
      error: error.message
    }, { status: 500 });
  }
}
