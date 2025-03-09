const socket = io() // TODO

socket.on('newChat', (data) => {
    console.log('new chat', data)
})

socket.on('joinRoom', (data) => {
    console.log('join room', data)
})

socket.on('leaveRoom', (data) => {
    console.log('leave room', data)
})

socket.on('roomJoined', (data) => {
    console.log('room joined', data)
})

socket.on('roomJoinFailed', (data) => {
    console.log('room join failed', data)
})

socket.on('chatSendFailure', (data) => {
    console.log('chat send failure', data)
})

function joinRoom(code) {
    if (!code) return
    socket.emit('joinGame', { code })
}

function sendChat(message) {
    if (typeof message !== 'string' || message.trim().length < 1) return
    message = message.trim()
    socket.emit('chat', { message })
}
