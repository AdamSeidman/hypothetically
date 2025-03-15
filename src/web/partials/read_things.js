/**
 * Give readouts for Things game
 */

const Games = require('../../game/gameManager')
const { shuffleArray } = require('../../game/utils')
const { getDisplayName } = require('../../db/tables/users')

function get(req) {
    let room = Games.getRoomByPlayerId(req?.user?.id)
    if (!room) return {}
    let readerId = room.gameObj?.reader
    if (!readerId) {
        return {
            readerName: '(Unknown)',
            prompt: ''
        }
    }
    let prompt = room.gameObj?.currentPrompt || '(missing?)'
    if (readerId == req.user?.id) {
        return {
            reader: true,
            answers: shuffleArray( Object.values(room.gameObj.answerMap) ),
            prompt
        }
    } else {
        return {
            reader: false,
            readerName: getDisplayName(readerId),
            prompt
        }
    }
}

module.exports = { get }
