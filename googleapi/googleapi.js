const {google} = require('googleapis');
const express = require('express');
const url = require('url');
const ls= require('local-storage');
const bodyParser = require('body-parser');
const app = express();

const googleConfig = {
    clientId: '683661531153-8aj8er9lc91matk7rj49dh535hhv5kdn.apps.googleusercontent.com',
    clientSecret: '7Cd5U8Yssu0BgEBkW5dKNPk4',
    redirectUrl: 'http://localhost:3000/redirect'
};

const oAuth2Client = new google.auth.OAuth2(
    '683661531153-8aj8er9lc91matk7rj49dh535hhv5kdn.apps.googleusercontent.com',
    '7Cd5U8Yssu0BgEBkW5dKNPk4',
    'http://localhost:3000/redirect'
);

function createConnection() {
    return new google.auth.OAuth2 (
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirectUrl
    );
}

const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/contacts.readonly'
];

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

function getUrl() {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.redirect(getUrl());
})

app.get('/redirect', async (req, res) => {
    console.log(req.query.code);
    const {tokens} = await oAuth2Client.getToken(req.query.code);
    oAuth2Client.setCredentials(tokens);
    ls.set('rtoken', tokens);

    res.redirect('/contacts');
})

app.get('/contacts', (req, res) => {
    oAuth2Client.setCredentials(ls.get('rtoken'));
    const service = google.people({version: 'v1', auth: oAuth2Client});
    service.people.connections.list({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses'
    }, (error, resposnse) => {
        if(error) {
            console.error(error);
        }
        else {
            res.send(JSON.stringify(resposnse.data.connections));
        }
    });
});

app.listen(3000);

module.exports = app;