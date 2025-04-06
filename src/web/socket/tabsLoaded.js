/**
 * Start the game with WebSockets
 */

const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    let room = Games.getRoomByPlayerId(id)
    if (!room.gameObj || room.gameType?.trim().toLowerCase() !== 'tentabs' || !room.inGame) return

    let ret = room.gameObj.tabsLoaded(id)
    if (ret) {
        ret.timestamp = room.gameObj.timestamp
        socket.emit('playTabs', ret)
        if (room.gameObj.timestamp === null) {
            // TODO set timestamp
            Sockets.sendToRoom(socket, 'playTabs', ret)
        }
    }
}

module.exports = { handle }
