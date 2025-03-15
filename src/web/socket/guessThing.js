/**
 * Make a guess for Things with WebSockets
 */

const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    let room = Games.getRoomByPlayerId(id)
    if (room.gameObj.guesser != id || !message?.characterId, !message?.answerText) return
    // TODO Handle other errors
    let ret = room.gameObj.guess(id, message.characterId, message.answerText)
    console.log(`Guess made by (${id}). Result: ${ret}`, message.characterId, message.answerText)
    setTimeout(() => {
        Sockets.sendToRoomByCode(room.code, 'gameRender', {
            currentGamePage: 'reveal_things',
            currentGameCode: room.code,
            scoreUpdate: room.gameObj.scoreMap
        })
    }, 100)
}

module.exports = { handle }
