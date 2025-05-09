/**
 * Handle setting of game type via WebSocket
 */

const logger = require('../../monitor/log')
const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    let ret = Games.setGameType(message?.type, id)
    if (ret) {
        if (!Sockets) {
            Sockets = require('../sockets')
        }
        Sockets.sendToRoomById(id, 'gameTypeChanged', {
            type: message.type,
            id
        })
        logger.log(`Game type of room ${ret} set to ${message.type}`)
    } else {
        logger.warn(`Game type set failure by (${id})`, message)
    }
}

module.exports = { handle }
