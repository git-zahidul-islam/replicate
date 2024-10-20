// src/app/api/callback/route.ts
import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/ConnectDB';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
  }

  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

  // Exchange the authorization code for an access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error }, { status: 400 });
  }

  const accessToken = tokenData.access_token;

  // Fetch user repositories using the access token
  const reposResponse = await fetch('https://api.github.com/user/repos', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  const reposData = await reposResponse.json();

  const db = await ConnectDB()
  const githubDetailsCollection = db.collection('githubDetails');

  const integrationData = {
    accessToken,
    reposData,
    createdAt: new Date(),
  };

//   insert data
try {
    await githubDetailsCollection.insertOne(integrationData);
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
    return NextResponse.json({ error: 'Failed to store integration data' }, { status: 500 });
  }

  return NextResponse.json({ access_token: accessToken, repositories: reposData }, { status: 200 });
}

