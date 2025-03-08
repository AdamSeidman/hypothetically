const fs = require('fs')
const cors = require('cors')
const path = require('path')
const express = require('express')
const passport = require('passport')
const Sockets = require('./sockets')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const session = require('express-session')
const database = require('../db/database')
const GoogleStrategy = require('passport-google-oauth20').Strategy
require('dotenv').config()

let app = express()
app.use(cors())

// Body parser setup
let jsonParser = bodyParser.json()
app.use(express.urlencoded({ extended: true }))

class SbStore extends session.Store {
    constructor() {
        super()
        Object.entries(database.sessions).forEach(([key, method]) => {
            this[key] = method
        })
    }
}

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: new SbStore()
}

// Session setup
app.use(session(sessionOptions))

// Passport initialization
app.use(passport.initialize())
app.use(passport.session())

// Passport Google OAuth setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value || 'No email found',
        photo: profile.photos?.[0]?.value || ''
    }
    let res = await database.users.login(user)
    if (res) {
        return done(null, user)
    }
    return done(null, false, { message: 'Error logging in user' })
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
            return req.logout(() => {
                res.redirect('/login')
            })
        }
    }
    next()
})

// Static files setup
app.use(express.static(path.join(__dirname, '../../www')))

// Logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.clearCookie('connect.sid')
        if (req.sessionID) {
            database.sessions.destroy(req.sessionID)
        }
        res.status(200).redirect('/login')
    })
})

// Dynamic routes (API endpoints)
;['delete', 'get', 'post', 'put'].forEach(verb => {
    fs.readdirSync(path.join(__dirname, verb)).forEach((file) => {
        if (path.extname(file) === '.js') {
            let ep = file.slice(0, file.indexOf('.'))
            if (verb === 'get') {
                app.get(`/api/${ep}`, require(`./get/${ep}`))
            } else {
                app[verb](`/api/${ep}`, jsonParser, async (req, res) => {
                    if (!req.isAuthenticated()) {
                        return res.status(403).json({})
                    } else {
                        let ret = await require(`./${verb}/${ep}`)(req, res)
                        if (ret) res.status(ret).json({})
                    }
                })
            }
        }
    })
})

// WebSocket server setup
const server = require('http').Server(app)
const io = new Server(server)

// Set up express-session as middleware for socket.io
io.use((socket, next) => {
    session(sessionOptions)(socket.request, {}, next)
})

// WebSocket connection handler
io.on('connection', (socket) => {
    console.log('User connected.')

    // Check if user is authentication from session and attach their info to the socket
    const user = socket.request.session.passport?.user

    if (user) {
        socket.user = user
        Sockets.socketOpened(socket.user.id, socket)

        // Handle incoming message
        socket.on('incomingMessage', (message) => {
            if (socket.user) {
                let msg = {}
                try {
                    msg = JSON.parse(message)
                    Sockets.handleIncomingMessage(socket.user.id, msg)
                } catch (err) {
                    console.error('Could not parse incomingMessage', err, '\n', message)
                }
            } else {
                console.error('Receieved incomingMessage with no socket user', message)
            }
        })
    }

    socket.on('disconnect', () => {
        console.log('User disconnected')
        if (user) {
            Sockets.socketClosed(user.id)
        }
    })
})

// Server setup
const PORT = process.env.PORT || 80
server.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`)
})
