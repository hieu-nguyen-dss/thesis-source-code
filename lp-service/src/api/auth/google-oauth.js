const { google } = require('googleapis')

const { googleAuth } = require('../../config/vars')

const oauth2Client = new google.auth.OAuth2(googleAuth)

const getGoogleAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    response_type: 'json'
  })
}