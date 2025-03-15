/**
 * Handle submission switching of Things rounds
 */

const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    let room = Games.getRoomByPlayerId(id)
    if (!room || !socket) return
    let ret = room.gameObj?.roundFinished(id)
    if (ret) {
        setTimeout(() => {
            Sockets.sendToRoomByCode(room.code, 'gameRender', {
                currentGamePage: ret,
                currentGameCode: room.code,
                scoreUpdate: room.gameObj.scoreMap
            })
        }, 50)
    }
}

module.exports = { handle }
