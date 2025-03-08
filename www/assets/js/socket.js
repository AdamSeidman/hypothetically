const socket = io() // TODO

socket.emit('incomingMessage', JSON.stringify({message: 'Hi!'})) // TODO remove

socket.on('response', (data) => {
    // TODO Figure out server response
    console.log('Server response:', data)
})

socket.on('message', (data) => {
    console.log('Server message', data)
})
