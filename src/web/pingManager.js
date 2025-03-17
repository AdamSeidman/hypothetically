const { getDisplayName } = require('../db/tables/users')

const USE_PING_MANAGER = false // TODO Move to .env and integrate with games
const NUM_PINGS_FOR_STALL = 6
const NUM_MISSED_PINGS_FOR_INACTIVE = 6
const PING_TASK_FREQUENCY = (30 * 1000)

class UserPingHandler {
    #id = -1

    constructor(id) {
        this.#id = id
        this.inactive = false
        this.stalledOut = false
        this.checkForStall = false
        this.numPings = 0
        this.missedPings = 0
        this.pendingPing = false
        this.displayName = getDisplayName(id) || '[Unknown User]'
    }

    get id() {
        return this.#id
    }
}

let users = []

function ping(id) {
    if (!id) return
    let user = users.find(x => x.id === id)
    if (!user) {
        user = new UserPingHandler(id)
        users.push(user)
    }
    user.pendingPing = true
}

function clearPings(id) {
    if (!id) return
    let user = users.find(x => x.id === id)
    if (!user) {
        user = new UserPingHandler(id)
        users.push(user)
    }
    user.numPings = 0
}

function setStallCheck(id, check) {
    let checkFn = (singleId) => {
        let user = users.find(x => x.id === singleId)
        if (!user) return
        user.checkForStall = !!check
        if (!check) {
            user.numPings = 0
        }
    }
    if (Array.isArray(id)) {
        id.forEach(checkFn)
    } else {
        checkFn(id)
    }
}

function stalledOutEvent(user) {
    if (!user?.stalledOut) return
    console.log(`Ping: ${user.displayName} stalled out!`)
}

function inactiveEvent(user) {
    if (!user?.inactive) return
    console.log(`Ping: ${user.displayName} became inactive!`)
}

function comeAliveEvent(user) {
    if (!user) return
    console.log(`Ping: ${user.displayName} returned!`)
}

function pingTask() {
    users.forEach(user => {
        if (user.inactive || user.stalledOut) {
            if (!user.pendingPing) return
            comeAliveEvent(user)
        } else if (user.pendingPing) {
            user.pendingPing = false
            if (user.checkForStall) {
                user.numPings += 1
            } else {
                user.numPings = 0
            }
            user.missedPings = 0
            if (user.numPings > NUM_PINGS_FOR_STALL) {
                user.stalledOut = true
                stalledOutEvent(user)
            }
        } else {
            user.missedPings += 1
            if (user.missedPings > NUM_MISSED_PINGS_FOR_INACTIVE) {
                user.inactive = true
                inactiveEvent(user)
            }
        }
    })
}

if (USE_PING_MANAGER) {
    setInterval(pingTask, PING_TASK_FREQUENCY)
}

module.exports = {
    ping,
    clearPings,
    setStallCheck
}
