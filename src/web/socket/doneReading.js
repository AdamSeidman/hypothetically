/**
 * Join a game with WebSockets
 */

const logger = require('../../monitor/log')
const Games = require('../../game/gameManager')
const { isAdmin } = require('../../db/tables/users')

let Sockets = undefined

function handle(message, socket, id) {
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    if (!message || !socket) return
    let game = Games.getRoomByPlayerId(id)?.gameObj
    if (game && id && (game.reader == id || isAdmin(id))) {
        game.doneReading()
    } else {
        logger.warn('Bad handling in doneReading!', id)
    }
}

module.exports = { handle }
