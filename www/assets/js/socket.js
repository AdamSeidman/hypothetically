const socket = io()

function onAny() {
    if (typeof onAnyEventHandler === 'function') {
        onAnyEventHandler()
    }
}

socket.on('newChat', (data) => {
    if (typeof newChatEvent === 'function') {
        newChatEvent(data)
    }
    onAny()
})

socket.on('joinRoom', (data) => {
    if (typeof joinRoomEvent === 'function') {
        joinRoomEvent(data)
    }
    onAny()
})

socket.on('leaveRoom', (data) => {
    if (typeof leaveRoomEvent === 'function') {
        leaveRoomEvent(data)
    }
    onAny()
})

socket.on('roomJoined', (data) => {
    console.log('room joined', data)
    onAny()
})

socket.on('roomJoinFailed', (data) => {
    console.log('room join failed', data)
    onAny()
})

socket.on('chatSendFailure', (data) => {
    console.warn('chat send failure', data)
    onAny()
})

socket.on('roomLeaveFailed', (data) => {
    console.error('room leave failed', data)
    onAny()
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
    onAny()
})

socket.on('numRoundsChanged', (data) => {
    if (typeof numRoundsChangedEvent === 'function') {
        numRoundsChangedEvent(data)
    }
    onAny()
})

socket.on('kicked', (data) => {
    if (typeof kickedEvent === 'function') {
        kickedEvent(data)
    }
    onAny()
})

socket.on('gameEnded', (data) => {
    if (typeof gameEndedEvent === 'function') {
        gameEndedEvent(data)
    }
    onAny()
})

socket.on('gameRender', (data) => {
    if (typeof gameRenderEvent === 'function') {
        gameRenderEvent(data)
    }
    onAny()
})

socket.on('startGameFailed', (data) => {
    if (typeof startGameFailedEvent === 'function') {
        startGameFailedEvent(data)
    }
    onAny()
})

socket.on('gameStarted', (data) => {
    if (typeof gameStartedEvent === 'function') {
        gameStartedEvent(data)
    }
    onAny()
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
    onAny()
})

socket.on('newAvatar', (data) => {
    if (typeof newAvatarEvent === 'function') {
        newAvatarEvent(data)
    }
    onAny()
})

socket.on('avatarSubmissionSuccess', (data) => {
    if (typeof avatarSuccessEvent === 'function') {
        avatarSuccessEvent(data)
    }
    onAny()
})

socket.on('answerAccepted', (data) => {
    if (typeof answerAcceptedEvent === 'function') {
        answerAcceptedEvent(data)
    }
    onAny()
})

socket.on('playTabs', (data) => {
    if (typeof playTabsEvent === 'function') {
        playTabsEvent(data)
    }
    onAny()
})

socket.on('answerRejected', () => {
    alert('Error submitting answer!')
    onAny()
})

socket.on('thingSubmitted', (data) => {
    if (!data?.id) return
    if (typeof thingSubmittedEvent === 'function') {
        thingSubmittedEvent(data.id)
    }
    onAny()
})

socket.on('leftMidGame', (data) => {
    if (!data?.id) return
    if (typeof leftMidGameEvent === 'function') {
        leftMidGameEvent(data.id)
    }
    onAny()
})

socket.on('midGameJoin', (data) => {
    if (!data?.id) return
    if (typeof midGameJoinEvent === 'function') {
        midGameJoinEvent(data)
    }
    onAny()
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

function emitTabsLoaded() {
    socket.emit('tabsLoaded', {})
}

function disconnectRoutine() {
    const overlay = document.createElement('div')
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: none;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        pointer-events: all;
    `
    document.body.appendChild(overlay)
    setTimeout(() => {
        alert('The sever has disconnected from this page!')
    }, 150)
}

socket.on('disconnect', () => {
    document.title = `Inactive | ${document.title}`
    const favicon = document.querySelector("link[rel~='icon']")
    if (favicon) {
        favicon.href = '/staleFavicon.ico'
    }
    setTimeout(disconnectRoutine, 1000)
})
