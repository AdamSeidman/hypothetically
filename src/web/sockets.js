/**
 * Handle WebSocket items
 */
const fs = require('fs')
const path = require('path')
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

module.exports = {
    openSocket,
    joinRoom,
    leaveRoom,
    sendToRoomById,
    sendToRoom
}
