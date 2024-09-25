const { google } = require('googleapis');


const CLIENT_ID = process.env.CLIENT_ID2;
const CLIENT_SECRET = process.env.CLIENT_SECRET2;
const REDIRECT_URL = process.env.REDIRECT_URL2;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN2;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = oAuth2Client;