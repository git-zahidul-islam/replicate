// src/app/api/integrations/route.ts
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

export async function GET() {
  const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo,user`;

  // Redirect to GitHub OAuth URL
  return new Response(null, {
    status: 302, // HTTP status for redirection
    headers: { Location: githubOAuthURL },
  });
}