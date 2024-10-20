import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/ConnectDB';

export async function GET() {
  const db = await ConnectDB();
  const githubDetailsCollection = db.collection('githubDetails');

  try {
    const integrationData = await githubDetailsCollection.findOne({}, { sort: { createdAt: -1 } });

    if (integrationData) {
      return NextResponse.json({
        connected: true,
        username: integrationData.reposData[0]?.owner?.login, // Assuming this is where the username is stored
        repositories: integrationData.reposData.map((repo) => ({
          name: repo.name,
          html_url: repo.html_url,
        })),
      });
    }

    return NextResponse.json({ connected: false });
  } catch (error) {
    console.error('Error fetching integration status:', error);
    return NextResponse.json({ error: 'Failed to check integration status.' }, { status: 500 });
  }
}
