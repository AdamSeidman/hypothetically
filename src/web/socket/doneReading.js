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
        if (game.doneReading()) {
            setTimeout(() => {
                Sockets.sendToRoomByCode(game.code, 'gameRender', {
                    currentGamePage: `guess_things`,
                    currentGameCode: game.code
                })
            }, 200)
        } else {
            console.warn('Wrong state in doneReading!', id, game.code)
        }
    } else {
        console.warn('Bad handling in doneReading!', id)
    }
}

module.exports = { handle }
