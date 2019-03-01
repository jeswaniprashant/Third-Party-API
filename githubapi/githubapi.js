const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let passport = require('passport')
const GithubStrategy = require('passport-github').Strategy;

passport.use(new GithubStrategy({
    clientID: "56ec8323fd3ca88716ae",
    clientSecret: "ba7bc6299f4c60e74fef565279b63192893b1586" ,
    callbackURL: "http://localhost:3000/auth/github/callback",
},
function(accessToken, refreshToken, profile, done) {
    done(null, profile);
}
));


app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github',
                { successRedirect: '/success', failureRedirect: '/failure' }));

app.get('/success', (req, res) => {
    res.send('Success');
})

app.get('/failure', (req, res) => {
    res.send('Failure');
})

app.get('/', (req, res) => {
    res.redirect('/auth/github');
})

app.listen(3000);

