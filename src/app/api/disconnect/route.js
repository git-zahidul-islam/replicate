// src/app/api/integrations/disconnect/route.ts
import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/ConnectDB';

export async function DELETE(request) {
  const db = await ConnectDB();
  const githubDetailsCollection = db.collection('githubDetails');

  try {
    // Remove the integration data
    const result = await githubDetailsCollection.deleteOne({}); // Adjust the filter based on your needs

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'No integration found to disconnect.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Integration disconnected successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error disconnecting integration:', error);
    return NextResponse.json({ error: 'Failed to disconnect the integration.' }, { status: 500 });
  }
}
