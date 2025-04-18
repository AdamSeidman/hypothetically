/**
 * Table: users
 * 
 * Website users and data
 */

const logger = require('../../monitor/log')
const stats = require('../../monitor/stats')

let users = []
let client = undefined

const TABLE_NAME = 'users'
const REFRESH_INTERVAL_MINS = 5
const MAX_DISPLAY_NAME_LENGTH = 20

async function create(supabase) {
    client = supabase
    const { data, error } = await client.from(TABLE_NAME).select()
    if (error) {
        throw new Error(error)
    }
    else {
        users = data
        stats.setUserCount(users.length)
    }
    setInterval(async () => {
        const { data, error } = await client.from(TABLE_NAME).select()
        if (error) {
            logger.error('Error refreshing users!', error)
        } else {
            users = data
            stats.setUserCount(users.length)
        }
    }, (REFRESH_INTERVAL_MINS * 60 * 1000))
}

async function login(googleData) {
    if (!googleData) return
    let user = users.find(x => x.google_id == googleData.id)
    if (user) {
        logger.log(`Logging in ${user.email}`)
        const { error } = await client
            .from(TABLE_NAME)
            .update({ last_login: 'NOW()' })
            .eq('google_id', googleData.id)
        if (error) {
            logger.error('Error logging in user!', error)
        } else {
            return user
        }
    } else {
        let display_name = googleData.displayName.trim().split(' ')[0] || googleData.displayName || 'User'
        if (display_name.length > MAX_DISPLAY_NAME_LENGTH) {
            display_name = display_name.slice(0, MAX_DISPLAY_NAME_LENGTH)
        }
        user = {
            google_id: googleData.id,
            email: googleData.email || '',
            profile_picture: googleData.photo,
            name: googleData.displayName || googleData.email,
            display_name
        }
        logger.info(`Registering new user (${user.name})`, user.email)
        const { data, error } = await client
            .from(TABLE_NAME)
            .insert(user)
            .select()
        if (error || data.length !== 1) {
            logger.error('Error registering user!', error || '[no return data]')
        } else {
            user = data[0]
            users.push(user)
            stats.incrementUserCount()
            return user
        }
    }
}

async function setDisplayName(id, newName) {
    if (!id || typeof newName !== 'string' || newName.trim().length < 1) return
    let user = users.find(x => x.google_id == id)
    if (!user) return
    user.display_name = newName.trim()
    const { error } = await client
        .from(TABLE_NAME)
        .update({ display_name: newName.trim() })
        .eq('google_id', id)
    return error
}

async function setDefaultAvatar(googleId, avatar) {
    if (!googleId || typeof avatar !== 'string') return
    if (avatar.trim().length < 1) {
        avatar = null
    } else {
        avatar = avatar.trim()
    }
    const { error } = await client
        .from(TABLE_NAME)
        .update({ default_avatar: avatar })
        .eq('google_id', googleId)
    if (!error) {
        let user = users.find(x => x.google_id == googleId)
        if (user) user.default_avatar = avatar
    }
    return error
}

function isAdmin(googleId) {
    if (!googleId) return false
    let user = users.find(x => x.google_id == googleId)
    return user?.is_admin || false
}

function isOwner(googleId) {
    if (!googleId) return false
    let user = users.find(x => x.google_id == googleId)
    return user?.is_owner || false
}

function getDisplayName(googleId) {
    if (!googleId) return
    let user = users.find(x => x.google_id == googleId)
    if (user) {
        return user.display_name
    }
}

function getDefaultAvatar(googleId) {
    if (!googleId) return
    let user = users.find(x => x.google_id == googleId)
    if (user) {
        if (user.default_avatar === null) {
            return {
                none: true
            }
        }
        let parts = user.default_avatar.split('|') || []
        return {
            character: parts[0],
            color: parts[1],
            none: false
        }
    }
}

module.exports = {
    create,
    isAdmin,
    isOwner,
    getDisplayName,
    getDefaultAvatar,
    queries: {
        login,
        setDisplayName,
        setDefaultAvatar
    }
}
