/**
 * Start the things game
 */

const Games = require('../../game/gameManager')

const MAX_GUESS_LENGTH = 32

function get(req) {
    let room = Games.getRoomByPlayerId(req.user?.id)
    if (!room) {
        return { prompt: '' }
    }
    let game = room.gameObj || { prompt: '' }
    return {
        prompt: game.currentPrompt,
        maxLength: MAX_GUESS_LENGTH
    }
}

module.exports = { get }
