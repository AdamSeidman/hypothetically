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
    let ret = room.gameObj.guess(id, message.characterId, message.answerText)
    setTimeout(() => {
        let payload = {
            currentGamePage: 'reveal_things',
            currentGameCode: room.code,
            scoreUpdate: room.gameObj.scoreMap,
            roundNumber: room.gameObj.round
        }
        if (ret) {
            payload.iconChange = {
                id: message.characterId
            }
        }
        Sockets.sendToRoomByCode(room.code, 'gameRender', payload)
    }, 100)
}

module.exports = { handle }
