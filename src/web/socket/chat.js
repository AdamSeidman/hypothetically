/**
 * Handle chat functions from WebSocket
 */

function handle(message, socket, id) {
    require('../sockets').sendToRoomById(id, 'newChat', {
        message: message.message,
        from: socket.user,
        id
    })
}

module.exports = { handle }
