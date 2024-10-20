import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/ConnectDB';

export async function POST(req) {
  const { title, message, repository } = await req.json();

  if (!title || !message || !repository) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const db = await ConnectDB();
  const githubDetailsCollection = db.collection('githubDetails');

  try {
    // Fetch the stored GitHub token and username from the database
    const integrationData = await githubDetailsCollection.findOne({}, { sort: { createdAt: -1 } });

    if (!integrationData) {
      return NextResponse.json({ error: 'GitHub integration not found' }, { status: 404 });
    }

    const accessToken = integrationData.token; // Assuming the token is stored here
    const username = integrationData.reposData[0]?.owner?.login;

    // Use Next.js built-in fetch
    const response = await fetch(`https://api.github.com/repos/${username}/${repository}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body: message,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, issue: data });
    } else {
      return NextResponse.json({ error: data.message || 'Failed to create issue' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating GitHub issue:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
