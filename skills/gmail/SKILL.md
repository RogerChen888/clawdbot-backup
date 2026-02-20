# Gmail Skill
This skill fetches unread emails from the user's primary inbox and summarizes them.

## Usage
Run `node fetch_emails.js` to get a JSON array of unread emails.

## Configuration
Requires `config/gmail-credentials.json` and `config/gmail-token.json`.

## Capabilities
- Read unread emails from `category:primary`
- Summarize sender, subject, and snippet
