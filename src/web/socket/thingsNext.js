/**
 * Handle submission switching of Things rounds
 */

const Games = require('../../game/gameManager')

function handle(message, socket, id) {
    if (!socket) return
    Games.getRoomByPlayerId(id)?.gameObj?.roundFinished(id)
}

module.exports = { handle }
