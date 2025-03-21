/**
 * Join a game with WebSockets
 */

const pingManager = require('../pingManager')
const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    if (!message || !socket) return
    pingManager.clearPings(id)
    let game = Games.getRoomByPlayerId(id)?.gameObj
    if (game && id && game.reader == id) {
        game.doneReading()
    } else {
        console.warn('Bad handling in doneReading!', id)
    }
}

module.exports = { handle }
