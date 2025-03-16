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
            let payload = {
                currentGamePage: ret,
                currentGameCode: room.code,
                scoreUpdate: room.gameObj.scoreMap
            }
            if (ret.toLowerCase().includes('start')) {
                payload.iconChange = {
                    clear: true
                }
                payload.roundNumber = ++room.gameObj.round
            }
            Sockets.sendToRoomByCode(room.code, 'gameRender', payload)
        }, 50)
    }
}

module.exports = { handle }
