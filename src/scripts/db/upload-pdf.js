// src/scripts/db/upload-pdf.js
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const fs = require('fs');

async function uploadPDF() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB_NAME);
    const collection = database.collection("certs");
    
    // Read the PDF file
    const pdfBuffer = fs.readFileSync('GenAI star Cert.pdf');
    
    // Create a document with the PDF data
    const result = await collection.insertOne({
      filename: "GenAI star Cert.pdf",
      contentType: "application/pdf",
      uploadDate: new Date(),
      data: Buffer.from(pdfBuffer)
    });
    
    console.log(`PDF uploaded with ID: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

uploadPDF().catch(console.error);
