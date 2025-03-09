/**
 * Leave a game with WebSockets
 */

const Games = require('../../game/gameManager')

function handle(message, socket, id) {
    let code = Games.getGameCodeOf(id)
    if (!code) {
        socket.emit('roomLeaveFailed', { id })
        return
    }
    let ret = Games.removeFromRoom(id)
    socket.emit('roomLeft', { code, id })
    if (ret) {
        socket.to(code).emit('roomDisbanded', { code, id })
        require('../sockets').disbandRoom(code)
    } else {
        require('../sockets').leaveRoom(id, code)
    }
}

module.exports = { handle }
