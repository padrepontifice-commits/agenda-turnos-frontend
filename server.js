require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const {google} = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: SCOPES,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'dev_secret'],
  maxAge: 24 * 60 * 60 * 1000
}));

function createOAuthClient() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI || `http://localhost:${PORT}/oauth2callback`
  );
  return oAuth2Client;
}

app.get('/auth', (req, res) => {
  const oAuth2Client = createOAuthClient();
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');
  try {
    const oAuth2Client = createOAuthClient();
    const {tokens} = await oAuth2Client.getToken(code);
    req.session.tokens = tokens;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving access token');
  }
});

app.post('/create-event', async (req, res) => {
  const {summary, description, date, startTime, durationMinutes, calendarId} = req.body;
  if (!date || !startTime || !durationMinutes || !summary) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + parseInt(durationMinutes, 10) * 60000);

  const calendar = google.calendar({version: 'v3', auth});

  const event = {
    summary,
    description: description || '',
    start: { dateTime: startDateTime.toISOString() },
    end: { dateTime: endDateTime.toISOString() },
  };

  try {
    const targetCalendarId = calendarId && calendarId.length > 0 ? calendarId : 'primary';
    const response = await calendar.events.insert({
      calendarId: targetCalendarId,
      resource: event,
      sendUpdates: 'all'
    });
    res.json({ success: true, eventId: response.data.id, htmlLink: response.data.htmlLink });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.get('/session-info', (req, res) => {
  res.json({ logged: !!req.session.tokens });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
