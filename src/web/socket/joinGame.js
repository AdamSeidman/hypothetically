/**
 * Join a game with WebSockets
 */

const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    let rooms = Games.getAllRooms()
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    if (Object.keys(rooms).includes(message.code)) {
        let ret = Games.addToRoom(id, message.code)
        if (ret.failReason) {
            console.log(`User ${id} failed to join ${message.code}`)
            socket.emit('roomJoinFailed', { code: message.code, reason: ret.failReason })
        } else if (ret) {
            console.log(`User ${id} joined room ${message.code}`)
            Sockets.joinRoom(id, message.code)
            socket.emit('roomJoined', { 
                code: message.code,
                chatHistory: Games.getChatHistory(message.code),
                players: Games.getPlayersOf(message.code),
                host: Games.getHostOf(message.code),
                id
            })
        }
    } else {
        socket.emit('roomJoinFailed', { code: message.code })
    }
}

module.exports = { handle }
