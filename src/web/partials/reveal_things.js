/**
 * Reveal answers for Things game
 */

const Games = require('../../game/gameManager')
const { getDisplayName } = require('../../db/tables/users')
const Assets = require('../../../www/assets/img/characters')

function get(req) {
    let room = Games.getRoomByPlayerId(req?.user?.id)
    if (!room) return {}
    let guessStache = room.gameObj?.guessStache
    if (!guessStache) return {}
    let avatarParts = room.avatarMap[guessStache.guessId].split('|').map(x => x.trim())
    let prompt = room.gameObj?.currentPrompt || '(missing?)'
    return {
        prompt,
        characterAsset: Assets.characterAssetsBase64[avatarParts[0]],
        colorAsset: Assets.backgroundAssetsBase64[avatarParts[1]],
        guessedName: getDisplayName(guessStache.guessId),
        answerText: guessStache.answerText,
        correct: guessStache.correct,
        guesserName: getDisplayName(guessStache.guesserId),
        isGuesser: guessStache.guesserId === (req.user?.id || '_')
    }
}

module.exports = { get }
