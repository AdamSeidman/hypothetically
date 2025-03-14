/**
 * Create and handle games
 */

const { generateRoomCode } = require('./utils')
const { getDisplayName } = require('../db/tables/users')

let rooms = {}
let playerMap = {}

const DEFAULT_GAME_TYPE = 'hypothetically'

class GameRoom {
    #chatHistory = []
    #gameObj = null
    #gameType = DEFAULT_GAME_TYPE

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
        this.kickedPlayers = []
        this.active = true
        this.joinable = true
        this.running = false
        this.inGame = false
        this.isPublic = !!isPublic
        this.avatarMap = {}
        rooms[code] = this
        playerMap[hostId] = code
    }

    addPlayer(id) {
        if (this.players.includes(id)) return { failReason: 'You are already in this room!' }
        if (this.kickedPlayers.includes(id)) return { failReason: 'You are not allowed to join this room!' }
        if (playerMap[id]) {
            console.warn(`Removed player ${id} from ${playerMap[id]} to add to ${this.code}!`)
            rooms[playerMap[id]].removePlayer(id)
        }
        this.players.push(id)
        playerMap[id] = this.code
        return {
            id,
            pass: true,
            code: this.code
        }
    }

    removePlayer(id) {
        if (this.players.length <= 1) {
            delete rooms[this.code]
            if (playerMap[id]) {
                delete playerMap[id]
            }
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
        console.log(`Deleting room ${this.code}.`)
        delete rooms[this.code]
        return this.code
    }

    addChatMessage(message) {
        if (!message?.message) return
        this.#chatHistory.push(message)
        return message
    }

    setGameType(type, id) {
        if (id == this.host) {
            this.#gameType = type
            return this.code
        }
    }

    kickPlayer(id) {
        if (!id || !this.players.includes(id)) return
        if (this.host === id) return
        let ret = this.removePlayer(id)
        if (ret) {
            this.kickedPlayers.push(id)
        }
        return ret
    }

    startGame() {
        this.inGame = true
        this.joinable = false
        this.avatarMap = {}
        return {
            type: this.gameType,
            code: this.code
        }
    }

    endGame() {
        this.inGame = false
        this.joinable = true
        this.avatarMap = {}
        return {
            code: this.code
        }
    }

    submitAvatar(id, avatar) {
        if (!this.players.includes(id) || !this.inGame || Object.keys(this.avatarMap) === this.players.length) return
        this.avatarMap[id] = avatar
        return {
            numAvatarsChosen: Object.keys(this.avatarMap).length,
            totalPlayers: this.players.length,
            code: this.code,
            avatar,
            map: this.avatarMap
        }
    }

    get chatHistory() {
        return JSON.parse(JSON.stringify(this.#chatHistory))
    }

    get game() {
        return this.gameObj
    }

    get gameType() {
        return this.#gameType
    }

    get avatarInfo() {
        return {
            numAvatarsChosen: Object.keys(this.avatarMap).length,
            totalPlayers: this.players.length,
            code: this.code,
            map: this.avatarMap
        }
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
    let ret = room?.addPlayer(id)
    if (room && !ret?.failReason) {
        room.addChatMessage({ message: `${getDisplayName(id)} joined the room` })
    }
    return ret
}

function removeFromRoom(id) {
    let code = playerMap[id]
    let room = rooms[code]
    if (!room) return
    if (room.host == id) {
        room.conclude()
        return code
    } else {
        room.addChatMessage({ message: `${getDisplayName(id)} left the room` })
        room.removePlayer(id)
    }
}

function addChatMessage(message) {
    if (!message?.message) return
    let room = rooms[playerMap[message?.id]]
    if (!room || !room.players.includes(message?.id)) return
    return room.addChatMessage(message)
}

function getChatHistory(code) {
    let room = rooms[code]
    return room?.chatHistory
}

function getGameType(code) {
    let room = rooms[code]
    return room?.gameType
}

function getPublicGames() {
    let games = []
    Object.entries(rooms).forEach(([code, room]) => {
        if (room.isPublic && room.active && !room.inGame) {
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

function setGameType(type, id) {
    if (typeof type !== 'string') return
    let room = rooms[playerMap[id]]
    if (!room || room.running) return
    return room.setGameType(type, id)
}

function kickPlayer(hostId, kickId, code) {
    if (hostId === kickId) return
    if (!hostId || !kickId || !code) return
    if (playerMap[hostId] !== code || playerMap[kickId] !== code) return
    let room = rooms[code]
    room.addChatMessage({ message: `${getDisplayName(kickId)} left the room` })
    return room.kickPlayer(kickId)
}

function startGame(hostId, code) {
    let room = rooms[code]
    if (!room || room.host !== hostId) return { failReason: 'Could not find game!' }
    if (room.inGame) return { failReason: 'Already in game!' }
    return room.startGame()
}

function isGameRunning(code) {
    let room = rooms[code]
    if (!room) return
    return room.inGame
}

function submitAvatar(id, avatar) {
    let room = rooms[playerMap[id]]
    if (!room) return
    return room.submitAvatar(id, avatar)
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
    removeFromRoom,
    addChatMessage,
    getChatHistory,
    getPublicGames,
    setGameType,
    getGameType,
    kickPlayer,
    startGame,
    isGameRunning,
    submitAvatar
}
