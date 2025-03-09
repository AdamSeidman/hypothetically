/**
 * Handle WebSocket items
 */
const fs = require('fs')
const path = require('path')
const Game = require('../game/gameManager')
const { getDisplayName } = require('../db/tables/users')

const sockets = {}
const handlers = []

fs.readdirSync(path.join(__dirname, 'socket')).forEach((file) => {
    if (path.extname(file) === '.js') {
        let command = file.slice(0, file.indexOf('.'))
        if (require(`./socket/${command}`).handle) {
            handlers.push(command)
        }
    }
})

function openSocket(id, socket) {
    console.log('Socket opened.', id)
    sockets[id] = socket
    handlers.forEach(event => {
        socket.on(event, (message) => {
            if (socket.user) {
                require(`./socket/${event}`).handle(message, socket, id)
            } else {
                console.error(`Received '${event}' message with no socket user!`, message)
            }
        })
    })
    let code = Game.getGameCodeOf(id)
    if (code) {
        console.log('New socket already in game.', code)
        socket.join(code)
        socket.room = code
    }
    socket.on('disconnect', () => {
        console.log('Socket closed.', id)
        if (sockets[id]) {
            delete sockets[id]
        }
    })
}

function joinRoom(id, code) {
    let socket = sockets[id]
    if (!socket) return
    if (socket.room) {
        socket.leave(socket.room)
    }
    socket.room = code
    socket.join(code)
    socket.to(code).emit('joinRoom', {
        id,
        displayName: getDisplayName(id)
    })
}

function leaveRoom(id, code) {
    let socket = sockets[id]
    if (!socket) return
    if (socket.room === code) {
        socket.to(code).emit('leaveRoom', { id })
        socket.leave(socket.room)
        socket.room = null
    }
}

function sendToRoomById(id, message, payload) {
    let socket = sockets[id]
    if (!socket?.room) return
    socket.to(socket.room).emit(message, {
        socketMessageFrom: id,
        ...payload
    })
}

function sendToRoom(socket, message, payload) {
    if (!socket?.room) return
    socket.to(socket.room).emit(message, {
        socketMessageFrom: socket.user.id,
        ...payload
    })
}

function sendToRoomByCode(code, message, payload) {
    let socket = Object.values(sockets).find(x => x.room === code)
    if (socket) {
        socket.to(code).emit(message, payload)
        socket.emit(message, payload)
        return code
    } else {
        console.warn(`Could not find socket for code '${code}'`)
    }
}

function disbandRoom(code) {
    let socketsInRoom = Object.values(sockets).filter(socket => socket.room === code)
    socketsInRoom.forEach(socket => {
        socket.leave(code)
        socket.room = null
    })
}

module.exports = {
    openSocket,
    joinRoom,
    leaveRoom,
    sendToRoomById,
    sendToRoom,
    sendToRoomByCode,
    disbandRoom
}
