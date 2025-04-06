/**
 * Make a guess for Things with WebSockets
 */

const Games = require('../../game/gameManager')

function handle(message, socket, id) {
    let room = Games.getRoomByPlayerId(id)
    if (room.gameObj.guesser != id || !message?.characterId, !message?.answerText) return
    room.gameObj.guess(id, message.characterId, message.answerText)
}

module.exports = { handle }
