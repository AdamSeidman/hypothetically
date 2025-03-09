/**
 * Handle chat functions from WebSocket
 */

const Games = require('../../game/gameManager')
const { getDisplayName } = require('../../db/tables/users')

function handle(message, socket, id) {
    let ret = Games.addChatMessage({
        message: message.message,
        displayName: getDisplayName(id),
        id
    })
    if (ret) {
        console.log(`Chat from ${ret.displayName} (${ret.id}): "${ret.message}"`)
        require('../sockets').sendToRoomById(id, 'newChat', {
            message: message.message,
            from: socket.user,
            id
        })
    } else {
        console.warn('Chat send failure.', id)
        socket.emit('chatSendFailure', message)
    }
}

module.exports = { handle }
