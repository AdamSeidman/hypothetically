/**
 * Allow for guessing in Things game
 */

const Games = require('../../game/gameManager')
const { getDisplayName } = require('../../db/tables/users')

function get(req) {
    let room = Games.getRoomByPlayerId(req?.user?.id)
    if (!room) return {}
    let guesserId = room.gameObj?.guesser
    if (!guesserId) return {}
    let prompt = room.gameObj?.currentPrompt || '(missing?)'
    return {
        prompt,
        guesser: (req.user?.id == guesserId),
        guesserName: getDisplayName(guesserId),
        avatars: room.gameObj?.currentAvatars,
        guesses: room.gameObj?.currentGuesses
    }
}

module.exports = { get }
