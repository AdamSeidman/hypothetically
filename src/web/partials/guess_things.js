/**
 * Allow for guessing in Things game
 */

const Games = require('../../game/gameManager')
const { getDisplayName } = require('../../db/tables/users')

function get(req) {
    let room = Games.getRoomByPlayerId(req?.user?.id)
    if (!room) return { avatars: [], guesses: [] }
    let guesserId = room.gameObj?.guesser
    let prompt = room.gameObj?.currentPrompt || '(missing?)'
    return  {
        prompt,
        avatars: room.gameObj?.getCurrentAvatars(guesserId),
        guesser: (req.user?.id == guesserId),
        guesserName: getDisplayName(guesserId) || '(Unknown)',
        guesses: room.gameObj?.currentGuesses
    }
}

module.exports = { get }
