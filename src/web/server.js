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

// Body parser setup
let jsonParser = bodyParser.json()

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}))

// Passport initialization
app.use(passport.initialize())
app.use(passport.session())

// Passport Google OAuth setup
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

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

// Session check and login guard
app.use((req, res, next) => {
    if (req.path.includes('login')) {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
    } else if (!req.path.includes('login') && (req.path.endsWith('.html') || !req.path.includes('.'))) {
        if (!req.session || !req.isAuthenticated()) {
            return req.logout(() => res.redirect('/login'))
        }
    }
    next()
})

// Static files setup
app.use(express.static(path.join(__dirname, '../../www')))

// Logout route
app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/login'))
})

// Dynamic routes (API endpoints)
;['delete', 'get', 'post', 'put'].forEach(verb => {
    fs.readdirSync(path.join(__dirname, verb)).forEach(file => {
        if (path.extname(file) === '.js') {
            let ep = file.slice(0, file.indexOf('.'))
            if (verb === 'get') {
                app.get(`/api/${ep}`, require(`./get/${ep}`))
            } else {
                app[verb](`/api/${ep}`, jsonParser, require(`./${verb}/${ep}`))
            }
        }
    })
})

// Server setup
const PORT = process.env.PORT || 80
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`)
})
