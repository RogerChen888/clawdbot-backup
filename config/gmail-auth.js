const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Constants
const TOKEN_PATH = path.join(__dirname, 'gmail-token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'gmail-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// Load credentials
async function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
  );
  return oAuth2Client;
}

// Generate Auth URL
async function generateAuthUrl() {
  const content = fs.readFileSync(CREDENTIALS_PATH);
  const credentials = JSON.parse(content);
  const oAuth2Client = await authorize(credentials);
  
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  
  console.log(authUrl);
}

// Check for arguments
if (process.argv[2] === 'generate-url') {
    generateAuthUrl().catch(console.error);
} else {
    console.error('Usage: node gmail-auth.js generate-url');
}
