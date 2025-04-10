/**
 * Send avatar sub-panel for games
 */

const Games = require('../../game/gameManager')

function get(req) {
    let room = Games.getRoomByPlayerId(req?.user?.id)
    if (!room?.inGame || !room.game?.playerScoreArray || !room.usesScoreBoard) {
        return {
            players: [],
            scoreText: '&nbsp;' // TODO check
        }
    }
    let players = room.game.playerScoreArray
    return {
        players,
        scoreText: 'Score: '
    }
}

module.exports = { get }
