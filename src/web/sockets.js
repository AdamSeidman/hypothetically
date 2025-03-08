/**
 * Handle WebSocket items
 */
const sockets = {}

function socketOpened(id, socket) {
    console.log('Socket opened: ', id)
    sockets[id] = socket
    socket.emit('message', {
        type: 'connection',
        id,
        payload: {
            status: 'opened'
        }
    })
}

function socketClosed(id) {
    console.log('Socket closed: ', id)
    if (sockets[id]) delete sockets[id]
}

function handleIncomingMessage(id, message) {
    if (!sockets[id]?.user) {
        console.error('Received message from unknown socket', message)
        if (sockets[id]) {
            delete sockets[id]
        }
        return
    }
    console.log(`Received message from ${sockets[id].user.displayName} (${id}):`)
    console.log(message)
}

module.exports = {
    socketOpened,
    socketClosed,
    handleIncomingMessage
}
