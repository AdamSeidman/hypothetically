const fs = require('fs')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const express = require('express')
const nunjucks = require('nunjucks')
const passport = require('passport')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const session = require('express-session')
const database = require('../db/database')
const { openSocket } = require('./sockets')
const Games = require('../game/gameManager')
const GoogleStrategy = require('passport-google-oauth20').Strategy
require('dotenv').config()

let app = express()
app.use(helmet({ contentSecurityPolicy: false }))
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
    let returnTo = [req.headers['cookie'] || ""].flat().find(x => x?.includes('returnTo='))
    if (returnTo) {
        returnTo = returnTo.slice(returnTo.indexOf('returnTo=')).split('=')[1].split(';')[0].trim()
        returnTo = decodeURIComponent(returnTo)
    }

    if (req.path === '/' && req.isAuthenticated() && returnTo) {
        res.clearCookie('returnTo')
        return res.redirect(returnTo)
    } else if (req.path.includes('login')) {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
    } else if (!req.path.includes('login') && !req.path.startsWith('/privacy') && !req.path.startsWith('/tos') &&
            (req.path.endsWith('.html') || !req.path.includes('.'))) {
        if (!req.session || !req.isAuthenticated()) {
            let returnTo = null
            if (req.path.startsWith('/join/') || req.path === '/lobby') {
                returnTo = req.path
            } else if (req.path === '/game') {
                returnTo = '/lobby'
            }
            if (returnTo) {
                res.cookie('returnTo', returnTo, { maxAge: (1000 * 60 * 5) })
            }
            return req.logout(() => {
                res.redirect('/login')
            })
        }
    }
    next()
})

// Static files setup
const publicDir = path.join(__dirname, '../../www')
app.use(express.static(publicDir))
fs.readdirSync(publicDir).forEach((subDir) => {
    // Look for index.html's in subdirectories
    const fullPath = path.join(publicDir, subDir)
    if (fs.statSync(fullPath).isDirectory()) {
        const indexFile = path.join(fullPath, 'index.html')
        if (fs.existsSync(indexFile)) {
            app.get(`/${subDir}.html`, (req, res) => {
                res.sendFile(indexFile)
            })
        }
    }
})
// Page icons
app.use(express.static(path.join(__dirname, '../../icons')))
// Optional share folder
const shareDir = path.join(__dirname, '../../share')
if (fs.existsSync(shareDir) && fs.lstatSync(shareDir).isDirectory()) {
    console.log('Linking file share directory.')
    const serveIndex = require('serve-index')
    app.use('/share', express.static(shareDir), serveIndex(shareDir, { icons: true, hidden: false }))
}

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
const epHandlers = {}
;['get', 'post', 'put'].forEach((verb) => {
    fs.readdirSync(path.join(__dirname, verb)).forEach((file) => {
        if (path.extname(file) === '.js') {
            const handle = `./${verb}/${file.slice(0, file.indexOf('.'))}`
            epHandlers[handle] = require(handle)
        }
    })
})
app.use('/api/:ep', jsonParser, (req, res, next) => {
    if (req.method.toLowerCase() !== 'get' && (!req.isAuthenticated() || !req.user?.id)) {
        return res.status(403).json({})
    }
    const handle = `./${req.method.toLowerCase()}/${req.params?.ep || '_'}`
    if (epHandlers[handle]) {
        let ret = epHandlers[handle](req, res)
        if (typeof ret === 'number') {
            res.status(ret).json({})
        } else if (ret) {
            let code = ret.code
            if (typeof code !== 'number') {
                code = 200
            }
            res.status(code).json(ret)
        }
    } else {
        next()
    }
})

const joinGame = require('./put/joinGame')
app.get('/join/:code', async (req, res) => {
    if (!req.body) {
        req.body = {}
    }
    req.body.code = req.params?.code?.trim() || "."

    let ret = await joinGame(req)
    if (ret === 200) {
        res.status(200).redirect('/lobby')
    } else if (ret?.err) {
        res.status(400).redirect('/lobbies')
    } else {
        res.status(404).sendFile(path.join(__dirname, '../../www/badCode.html'))
    }
})

// NJK Partials
let njk = nunjucks.configure(path.join(__dirname, 'partials'), { express: app })
app.set('view engine', 'njk')
njk.addFilter('titlecase', (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))

const partialRenderers = {}
fs.readdirSync(path.join(__dirname, 'partials')).forEach((file) => {
    if (path.extname(file) === '.js') {
        let partial = file.slice(0, file.indexOf('.'))
        partialRenderers[partial] = require(`./partials/${partial}`)
        app.get(`/partials/${partial}`, (req, res) => {
            res.render(partial, partialRenderers[partial].get(req))
        })
    }
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
    // Check if user is authentication from session and attach their info to the socket
    const user = socket.request.session.passport?.user
    if (user) {
        socket.user = user
        openSocket(socket.user.id, socket)
    }
})

// Not Found handling catch-all
app.use((req, res) => {
    const printExclusions = [
        '/assets/js/lib/socket.io.min.js.map'
    ]
    if (!printExclusions.includes(req.url)) {
        console.warn(`Incoming 404: ${req.method} ${req.url}`)
    }
    res.status(404).sendFile(path.join(__dirname, '../../www/404.html'))
})

// Server setup
const PORT = process.env.PORT || 80
server.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`)
})
