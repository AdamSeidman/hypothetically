const socket = io() // TODO

socket.on('newChat', (data) => {
    if (typeof newChatEvent === 'function') {
        newChatEvent(data)
    }
})

socket.on('joinRoom', (data) => {
    if (typeof joinRoomEvent === 'function') {
        joinRoomEvent(data)
    }
})

socket.on('leaveRoom', (data) => {
    if (typeof leaveRoomEvent === 'function') {
        leaveRoomEvent(data)
    }
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

socket.on('roomLeaveFailed', (data) => {
    console.log('room leave failed', data)
})

socket.on('roomLeft', (data) => {
    console.log('room left', data)
    window.location.href = "/lobbies"
})

socket.on('roomDisbanded', (data) => {
    console.log('room disbanded', data)
    alert('Host has left the room!')
    window.location.href = "/lobbies"
})

function joinRoom(code) {
    if (!code) return
    socket.emit('joinGame', { code })
}

function leaveRoom() {
    socket.emit('leaveGame', {})
    setTimeout(() => {
        window.location.href = '/lobby'
    }, 100)
}

function sendChat(message) {
    if (typeof message !== 'string' || message.trim().length < 1) return
    message = message.trim()
    socket.emit('chat', { message })
}
