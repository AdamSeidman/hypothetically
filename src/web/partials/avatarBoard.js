/**
 * Send avatar sub-panel for games
 */

const Games = require('../../game/gameManager')

function get(req) {
    let room = Games.getRoomByPlayerId(req?.user?.id)
    let ret = {
        players: [],
        scoreText: ' ' // TODO Not showing up at right location
    }
    if (!room?.avatarMap) return ret
    if (!room.inGame || !room.game?.playerScoreArray || !room.usesScoreBoard) {
        ret.players = room.playerAvatarArray || []
    } else {
        ret.players = room.game.playerScoreArray || []
        ret.scoreText = 'Score: '
    }
    return ret
}

module.exports = { get }
