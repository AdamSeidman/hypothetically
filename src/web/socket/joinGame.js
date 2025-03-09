/**
 * Join a game with WebSockets
 */

const Games = require('../../game/gameManager')

function handle(message, socket, id) {
    let rooms = Games.getAllRooms()
    if (Object.keys(rooms).includes(message.code)) {
        let ret = Games.addToRoom(id, message.code)
        if (ret) {
            console.log(`User ${id} joined room ${message.code}`)
            require('../sockets').joinRoom(id, message.code)
            socket.emit('roomJoined', { 
                code: message.code,
                chatHistory: Games.getChatHistory(message.code),
                players: Games.getPlayersOf(message.code),
                host: Games.getHostOf(message.code)
            })
            return
        }
    }
    socket.emit('roomJoinFailed', { code: message.code })
}

module.exports = { handle }
