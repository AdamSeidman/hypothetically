/**
 * Handle WebSocket items
 */
const fs = require('fs')
const path = require('path')
const Game = require('../game/gameManager')
const { getDisplayName } = require('../db/tables/users')
const { randomUUID } = require('crypto')

const REJOIN_GRACE_TIME = 10 * 1000

const sockets = {}
const handlers = []
const rejoinList = {}
const eventHandlers = {}

fs.readdirSync(path.join(__dirname, 'socket')).forEach((file) => {
    if (path.extname(file) === '.js') {
        let command = file.slice(0, file.indexOf('.'))
        if (require(`./socket/${command}`).handle) {
            handlers.push(command)
        }
    }
})

function openSocket(id, socket) {
    if (sockets[id]) {
        sockets[id].emit('loginLocationChanged')
        if (sockets[id].room) {
            sockets[id].leave(sockets[id].room)
        }
    }
    socket.uuid = randomUUID()
    sockets[id] = socket
    handlers.forEach(event => {
        socket.on(event, (message) => {
            if (socket.user) {
                if (sockets[id].uuid === socket.uuid) {
                    if (!eventHandlers[event]) {
                        eventHandlers[event] = require(`./socket/${event}`)
                    }
                    eventHandlers[event].handle(message, socket, id)
                } else {
                    console.warn(`Received '${event}' message on stale socket!`, id, message)
                }
            } else {
                console.error(`Received '${event}' message with no socket user!`, message)
            }
        })
    })
    let code = Game.getGameCodeOf(id)
    if (code) {
        socket.join(code)
        socket.room = code
    }
    socket.on('disconnect', () => {
        if (sockets[id] && sockets[id].uuid === socket.uuid) {
            delete sockets[id]
            let code = Game.getGameCodeOf(id)
            if (!code) return
            rejoinList[id] = code
            setTimeout(() => {
                delete rejoinList[id]
                if (!sockets[id]) {
                    Game.removeFromRoom(id)
                }
            }, REJOIN_GRACE_TIME)
        } else {
            console.warn('Socket was stale or missing!', id)
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
        socket.to(code).emit('leaveRoom', {
            id,
            displayName: getDisplayName(id)
        })
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

function sendToRoom(socket, message, payload, includeSelf) {
    if (!socket?.room) return
    let data = {
        socketMessageFrom: socket.user.id,
        ...payload
    }
    socket.to(socket.room).emit(message, data)
    if (includeSelf) {
        socket.emit(message, data)
    }
}

function sendToRoomByCode(code, message, payload) {
    if (!code) return
    let roomSockets = Object.values(sockets).filter(x => x.room === code)
    if ((roomSockets?.length || 0) < 1) {
        console.warn(`Could not find socket(s) for code '${code}'`)
        return
    }
    roomSockets.forEach(socket => {
        if (socket) {
            socket.emit(message, payload)
        }
    })
    return code
}

function disbandRoom(code) {
    let socketsInRoom = Object.values(sockets).filter(socket => socket.room === code)
    socketsInRoom.forEach(socket => {
        socket.leave(code)
        socket.room = null
    })
}

function kickFromRoom(id, code) {
    if (!id || !code) return
    let socket = sockets[id]
    if (socket && socket.room === code) {
        let name = getDisplayName(id)
        socket.to(code).emit('leaveRoom', {
            id,
            displayName: name
        })
        console.log(`${name} (${id}) kicked from room ${code}.`)
        socket.emit('kicked', {})
        socket.leave(code)
        socket.room = null
        return code
    } else {
        console.error(`Could not find socket for ${id} (Room ${code})`)
    }
}

function sendToId(id, message, payload) {
    if (!sockets[id] || typeof message !== 'string' || !payload) return
    sockets[id].emit(message, payload)
    return true
}

module.exports = {
    openSocket,
    joinRoom,
    leaveRoom,
    sendToRoomById,
    sendToRoom,
    sendToRoomByCode,
    disbandRoom,
    kickFromRoom,
    sendToId
}
