/**
 * Join a game with WebSockets
 */

const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    if (!message || !socket) return
    let game = Games.getRoomByPlayerId(id)?.gameObj
    if (game && id && game.reader == id) {
        game.doneReading()
    } else {
        console.warn('Bad handling in doneReading!', id)
    }
}

module.exports = { handle }
