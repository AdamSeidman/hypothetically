/**
 * Handle chat functions from WebSocket
 */

const logger = require('../../monitor/log')
const Games = require('../../game/gameManager')
const { getDisplayName } = require('../../db/tables/users')

let Sockets = undefined

function handle(message, socket, id) {
    let ret = Games.addChatMessage({
        message: message.message,
        displayName: getDisplayName(id),
        id
    })
    if (ret) {
        if (!Sockets) {
            Sockets = require('../sockets')
        }
        logger.info(`Chat from ${ret.displayName} (${ret.id})`, `"${ret.message}"`)
        Sockets.sendToRoomById(id, 'newChat', {
            message: message.message,
            from: socket.user,
            displayName: getDisplayName(id),
            id
        })
    } else {
        logger.warn('Chat send failure.', id)
        socket.emit('chatSendFailure', message)
    }
}

module.exports = { handle }
