/**
 * Handle setting number of game rounds via WebSocket
 */

const logger = require('../../monitor/log')
const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    let ret = Games.setNumRounds(message?.numRounds, id)
    if (ret) {
        if (!Sockets) {
            Sockets = require('../sockets')
        }
        Sockets.sendToRoomById(id, 'numRoundsChanged', {
            numRounds: message.numRounds,
            id
        })
        logger.log(`Number of rounds of room ${ret} set to ${message.numRounds}`)
    } else {
        logger.warn(`Number of rounds set failure by (${id})`, message)
    }
}

module.exports = { handle }
