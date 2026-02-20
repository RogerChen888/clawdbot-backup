const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Constants
const TOKEN_PATH = path.join(process.cwd(), 'config', 'gmail-token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'config', 'gmail-credentials.json');

async function getGmailClient() {
  const content = fs.readFileSync(CREDENTIALS_PATH);
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
  );

  const token = fs.readFileSync(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(token));
  return google.gmail({ version: 'v1', auth: oAuth2Client });
}

async function listUnreadMessages() {
  const gmail = await getGmailClient();
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread category:primary', // Only primary inbox, unread
    maxResults: 10,
  });
  
  const messages = res.data.messages;
  if (!messages || messages.length === 0) {
    console.log('No unread messages found.');
    return [];
  }

  const emailDetails = [];
  for (const message of messages) {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
    });
    
    const headers = msg.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
    const from = headers.find(h => h.name === 'From')?.value || '(Unknown Sender)';
    const snippet = msg.data.snippet;
    
    emailDetails.push({ from, subject, snippet });
  }
  return emailDetails;
}

// Run if called directly
if (require.main === module) {
    listUnreadMessages().then(emails => {
        console.log(JSON.stringify(emails, null, 2));
    }).catch(console.error);
}

module.exports = { listUnreadMessages };
