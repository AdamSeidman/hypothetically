/**
 * Create and handle games
 */

const { generateRoomCode } = require('./utils')
const { getDisplayName } = require('../db/tables/users')

let rooms = {}
let playerMap = {}

class GameRoom {
    #chatHistory = []

    constructor(hostId, isPublic) {
        if (playerMap[hostId]) {
            rooms[playerMap[hostId]].removePlayer(hostId)
        }
        let code = generateRoomCode()
        while (Object.keys(rooms).includes(code)) {
            code = generateRoomCode()
        }
        this.code = code
        this.host = hostId
        this.players = [hostId]
        this.active = true
        this.joinable = true
        this.isPublic = !!isPublic
        rooms[code] = this
        playerMap[hostId] = code
    }

    addPlayer(id) {
        if (this.players.includes(id)) return
        if (playerMap[id]) {
            rooms[playerMap[id]].removePlayer(id)
        }
        this.players.push(id)
        playerMap[id] = this.code
        return id
    }

    removePlayer(id) {
        if (this.players.length <= 1) {
            delete rooms[this.code]
            return
        }
        if (!this.players.includes(id)) return
        let idx = this.players.indexOf(id)
        this.players.splice(idx, 1)
        if (this.host == id) {
            this.host = this.players[0]
        }
        if (playerMap[id]) {
            delete playerMap[id]
        }
        return this.host
    }

    switchHost(id) {
        if (this.players.length < 2 || this.host == id || !this.players.includes(id)) return
        this.host = id
        return this.host
    }

    conclude() {
        if (!rooms[this.code]) return
        this.players.forEach(id => {
            if (playerMap[id]) {
                delete playerMap[id]
            }
        })
        delete rooms[this.code]
        return this.code
    }

    addChatMessage(message) {
        if (!message?.message) return
        this.#chatHistory.push(message)
        return message
    }

    get chatHistory() {
        return JSON.parse(JSON.stringify(this.#chatHistory))
    }
}

function makeRoom(hostId, isPublic) {
    if (playerMap[hostId]) return
    let room = new GameRoom(hostId, isPublic)
    return room.code
}

function deleteRoom(code) {
    let room = rooms[code]
    if (!room) return
    return room.conclude()
}

function switchHost(code, newHostId) {
    let room = rooms[code]
    return room?.switchHost(newHostId)
}

function getHostOf(code) {
    let room = rooms[code]
    return room?.host
}

function getPlayersOf(code) {
    let room = rooms[code]
    if (!room?.players) return
    let ret = {}
    room.players.forEach(player => {
        ret[player] = getDisplayName(player)
    })
    return ret
}

function getGameCodeOf(id) {
    return playerMap[id]
}

function getAllRooms() {
    let ret = {}
    Object.entries(rooms).forEach(([code, game]) => {
        ret[code] = getDisplayName(game.host) || 'Unknown Host'
    })
    return ret
}

function addToRoom(id, code) {
    let room = rooms[code]
    return room?.addPlayer(id)
}

function addChatMessage(message) {
    if (!message?.message) return
    let room = rooms[playerMap[message?.id]]
    return room?.addChatMessage(message)
}

function getChatHistory(code) {
    let room = rooms[code]
    return room?.chatHistory
}

function getPublicGames() {
    let games = []
    Object.entries(rooms).forEach(([code, room]) => {
        if (room.isPublic && room.active) {
            games.push({
                isPublic: true,
                code,
                joinable: room.joinable,
                hostName: getDisplayName(room.host),
                numPlayers: room.players.length
            })
        }
    })
    return games
}

module.exports = {
    makeRoom,
    deleteRoom,
    switchHost,
    getHostOf,
    getPlayersOf,
    getGameCodeOf,
    getAllRooms,
    addToRoom,
    addChatMessage,
    getChatHistory,
    getPublicGames
}
