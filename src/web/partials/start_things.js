/**
 * Start the things game
 */

const Games = require('../../game/gameManager')

const MAX_GUESS_LENGTH = 50

function get(req) {
    let room = Games.getRoomByPlayerId(req.user?.id)
    if (!room) {
        return { prompt: '' }
    }
    let game = room.gameObj
    let ret = {
        prompt: game.currentPrompt,
        maxLength: MAX_GUESS_LENGTH
    }
    let answer = game?.answerMap[req.user?.id]
    if (answer) {
        ret.answer = answer
    }
    return ret
}

module.exports = { get }
