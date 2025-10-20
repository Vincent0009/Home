import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection URI (use environment variable in production)
const uri = process.env.MONGODB_URI;

export async function GET(request, { params }) {
  // Await the params object before accessing its properties
  const paramsData = await params;
  const id = paramsData.id;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db("vchinfo"); // Replace with your actual database name
    const collection = database.collection("certs");
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return new NextResponse('Invalid ID format', { status: 400 });
    }
    
    const document = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!document) {
      return new NextResponse('PDF not found', { status: 404 });
    }
    
    // Convert Binary data to Buffer
    const pdfBuffer = Buffer.from(document.data.buffer);
    
    // Return the PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${document.filename}"`,
      },
    });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return new NextResponse('Error fetching PDF: ' + error.message, { status: 500 });
  } finally {
    await client.close();
  }
}
