/**
 * Handle submission switching of Things rounds
 */

const pingManager = require('../pingManager')
const Games = require('../../game/gameManager')

function handle(message, socket, id) {
    if (!socket) return
    pingManager.clearPings(id)
    Games.getRoomByPlayerId(id)?.gameObj?.roundFinished(id)
}

module.exports = { handle }
