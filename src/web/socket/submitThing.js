/**
 * Handle submission of Things answers
 */

const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    let room = Games.getRoomByPlayerId(id)
    if (!room?.gameObj?.submitAnswer || room.gameType.trim().toLowerCase() !== 'things' ||
            typeof message?.answer !== 'string' || message.answer.trim().length < 1 || !id) {
        socket.emit('answerRejected', message)
        return
    }
    let done = room.gameObj.submitAnswer(id, message.answer)
    socket.emit('answerAccepted', { answer: message.answer })
    Sockets.sendToRoomByCode(room.code, 'thingSubmitted', { id })
    if (done) {
        setTimeout(() => {
            Sockets.sendToRoomByCode(room.code, 'gameRender', {
                currentGamePage: 'read_things',
                currentGameCode: room.code
            })
        }, 1000)
    }
}

module.exports = { handle }
