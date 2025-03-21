const socket = io()

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
    console.warn('chat send failure', data)
})

socket.on('roomLeaveFailed', (data) => {
    console.error('room leave failed', data)
})

socket.on('roomLeft', (data) => {
    sessionStorage.setItem('valid', false)
    window.location.href = "/lobbies"
})

socket.on('roomDisbanded', (data) => {
    sessionStorage.setItem('valid', false)
    alert('Host has left the room!')
    setTimeout(() => {
        window.location.href = "/lobbies"
    }, 100)
})

socket.on('loginLocationChanged', (data) => {
    alert('You have logged in from a different location!')
    window.location.href = '/'
})

socket.on('gameTypeChanged', (data) => {
    if (typeof gameTypeChangedEvent === 'function') {
        gameTypeChangedEvent(data)
    }
})

socket.on('numRoundsChanged', (data) => {
    if (typeof numRoundsChangedEvent === 'function') {
        numRoundsChangedEvent(data)
    }
})

socket.on('kicked', (data) => {
    if (typeof kickedEvent === 'function') {
        kickedEvent(data)
    }
})

socket.on('gameEnded', (data) => {
    if (typeof gameEndedEvent === 'function') {
        gameEndedEvent(data)
    }
})

socket.on('gameRender', (data) => {
    if (typeof gameRenderEvent === 'function') {
        gameRenderEvent(data)
    }
})

socket.on('startGameFailed', (data) => {
    if (typeof startGameFailedEvent === 'function') {
        startGameFailedEvent(data)
    }
})

socket.on('gameStarted', (data) => {
    if (typeof gameStartedEvent === 'function') {
        gameStartedEvent(data)
    }
})

socket.on('goToResults', (data) => {
    sessionStorage.removeItem('myAvatar')
    sessionStorage.removeItem('avatarData')
    let timeout = data?.timeout
    if (isNaN(timeout) || timeout < 1) {
        timeout = 1
    }
    setTimeout(() => {
        window.location.href = '/results'
    }, timeout)
})

socket.on('avatarSubmissionFailed', () => {
    alert('Error submitting avatar!')
})

socket.on('newAvatar', (data) => {
    if (typeof newAvatarEvent === 'function') {
        newAvatarEvent(data)
    }
})

socket.on('avatarSubmissionSuccess', (data) => {
    if (typeof avatarSuccessEvent === 'function') {
        avatarSuccessEvent(data)
    }
})

socket.on('answerAccepted', (data) => {
    if (typeof answerAcceptedEvent === 'function') {
        answerAcceptedEvent(data)
    }
})

socket.on('answerRejected', () => {
    alert('Error submitting answer!')
})

socket.on('thingSubmitted', (data) => {
    if (!data?.id) return
    if (typeof thingSubmittedEvent === 'function') {
        thingSubmittedEvent(data.id)
    }
})

function joinRoom(code) {
    if (!code) return
    socket.emit('joinGame', { code })
}

function leaveRoom() {
    socket.emit('leaveGame', {})
    sessionStorage.setItem('valid', false)
    setTimeout(() => {
        window.location.href = '/lobby'
    }, 100)
}

function sendChat(message) {
    if (typeof message !== 'string' || message.trim().length < 1) return
    message = message.trim()
    socket.emit('chat', { message })
}

function setGameType(type) {
    if (typeof type !== 'string' || type.trim().length < 1) return
    type = type.trim()
    socket.emit('setGameType', { type })
}

function setNumRounds(numRounds = '_') {
    if (isNaN(numRounds)) {
        try {
            numRounds = parseInt(`${numRounds}`.trim())
        } catch (err) {
            console.warn('Could not parse int!', err)
            return
        }
    }
    if (isNaN(numRounds) || numRounds < 1 || numRounds > 20) return
    socket.emit('setNumRounds', { numRounds })
}

function emitStartGame(code) {
    socket.emit('startGame', { code })
}

function emitSubmitAvatar(character, color) {
    let avatar = `${character.trim()}|${color.trim()}`
    socket.emit('submitAvatar', { avatar })
    return avatar
}

function submitThingsAnswer(answer) {
    socket.emit('submitThing', { answer })
}

function stopReading() {
    socket.emit('doneReading', {})
}

function makeThingsGuess(characterId, answerText) {
    socket.emit('guessThing', { characterId, answerText })
}

function emitNextThings() {
    socket.emit('thingsNext', {})
}

setInterval(() => {
    socket.emit('ping', {
        page: window.location.href
    })
}, (1000 * 5))
