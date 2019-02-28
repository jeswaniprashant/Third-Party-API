const express = require('express');
const app = express();
const fbAuth = require('./authfbapi.js');
const passport = require('passport');
const bodyParser = require('body-parser');

app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/auth/facebook', passport.authenticate('facebook',{scope: ["email"]}));

app.get('/auth/facebook/callback', passport.authenticate('facebook',
                { successRedirect: '/success', failureRedirect: '/failure' }));

app.get('/success', (req, res) => {
    res.send('Success');
})

app.get('/failure', (req, res) => {
    res.send('Failure');
})

app.get('/', (req, res) => {
    res.redirect('/auth/facebook');
})

app.listen(3000);

