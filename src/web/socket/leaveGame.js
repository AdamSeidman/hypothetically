/**
 * Leave a game with WebSockets
 */

const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    let code = Games.getGameCodeOf(id)
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    if (!code) {
        socket.emit('roomLeaveFailed', { id })
        return
    }
    let ret = Games.removeFromRoom(id)
    socket.emit('roomLeft', { code, id })
    if (ret) {
        socket.to(code).emit('roomDisbanded', { code, id })
        Sockets.disbandRoom(code)
    } else {
        Sockets.leaveRoom(id, code)
    }
}

module.exports = { handle }
