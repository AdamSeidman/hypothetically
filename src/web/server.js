const fs = require('fs')
const cors = require('cors')
const path = require('path')
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth20').Strategy
require('dotenv').config()

let app = express()
app.use(cors())

let options = {}
let jsonParser = bodyParser.json()

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true, // TODO
        sameSite: 'Lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value || 'No email found',
        photo: profile.photos?.[0]?.value || ''
    }
    return done(null, user)
}))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

app.use(express.static(path.join(__dirname, '../../www')))

 app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
 app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard', // TODO
    failureRedirect: '/'
 }))

function ensureAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        req.logout(() => res.redirect('/'))
        return
    }
    next()
}

app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'))
})

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    const filePath = require('path').join(__dirname, '../../www/admin/index.html')
    res.sendFile(filePath)
})

;['delete', 'get', 'post', 'put'].forEach(verb => {
    fs.readdirSync(path.join(__dirname, verb)).forEach(file => {
        if (path.extname(file) == '.js') {
            let ep = file.slice(0, file.indexOf('.'))
            if (verb === 'get') {
                app.get(`/api/${ep}`, require(`./get/${ep}`))
            } else {
                app[verb](`/api/${ep}`, jsonParser, require(`./${verb}/${ep}`))
            }
        }
    })
})

const PORT = process.env.PORT || 80

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`)
})

module.exports = {}
