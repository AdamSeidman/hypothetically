/**
 * Reveal answers for Things game
 */

const Games = require('../../game/gameManager')
const { getDisplayName } = require('../../db/tables/users')
const Assets = require('../../../www/assets/img/characters')

function get(req) {
    let room = Games.getRoomByPlayerId(req?.user?.id)
    if (!room) return {}
    let guessStash = room.gameObj?.guessStash
    if (!guessStash) return {}
    let avatarParts = room.avatarMap[guessStash.guessId].split('|').map(x => x.trim())
    let prompt = room.gameObj?.currentPrompt || '(missing?)'
    return {
        prompt,
        characterAsset: Assets.characterAssetsBase64[avatarParts[0]],
        colorAsset: Assets.backgroundAssetsBase64[avatarParts[1]],
        guessedName: getDisplayName(guessStash.guessId),
        answerText: guessStash.answerText,
        correct: guessStash.correct,
        guesserName: getDisplayName(guessStash.guesserId),
        isGuesser: guessStash.guesserId === (req.user?.id || '_')
    }
}

module.exports = { get }
