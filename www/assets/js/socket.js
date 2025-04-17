if (typeof io !== 'function') {
    console.error(io)
    alert('Error! Socket library not available!')
}

const socket = io()

if (!socket) {
    console.error('Could not make socket!', socket)
    alert('Error connecting to server!')
}

// Boolean value is check for 'id' param
// Return is whether to continue after function
const socketHandlers = {
    newChat: false,
    joinRoom: false,
    leaveRoom: false,
    gameTypeChanged: false,
    numRoundsChanged: false,
    kicked: false,
    gameEnded: false,
    gameRender: false,
    startGameFailed: false,
    gameStarted: false,
    newAvatar: false,
    avatarSubmissionSuccess: false,
    answerAccepted: false,
    playTabs: false,
    thingSubmitted: true,
    leftMidGame: true,
    midGameJoin: true,
    roomLeft: () => {
        sessionStorage.setItem('valid', false)
        window.location.href = "/lobbies"
    },
    roomDisbanded: () => {
        sessionStorage.setItem('valid', false)
        alert('Host has left the room!')
        setTimeout(() => {
            window.location.href = "/lobbies"
        }, 100)
    },
    loginLocationChanged: () => {
        alert('You have logged in from a different location!')
        window.location.href = '/'
    },
    goToResults: (data) => {
        sessionStorage.removeItem('myAvatar')
        sessionStorage.removeItem('avatarData')
        let timeout = data?.timeout
        if (isNaN(timeout) || timeout < 1) {
            timeout = 1
        }
        setTimeout(() => {
            window.location.href = '/results'
        }, timeout)
    },
    avatarSubmissionFailed: () => {
        alert('Error submitting avatar!')
        return true
    },
    answerRejected: () => {
        alert('Error submitting answer!')
        return true
    },
    disconnect: () => {
        document.title = `Inactive | ${document.title}`
        const favicon = document.querySelector("link[rel~='icon']")
        if (favicon) {
            favicon.href = '/staleFavicon.ico'
        }
        setTimeout(() => {
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
        }, 1000)
    }
}

function onSocketAny(data) {
    if (typeof onAnyEventHandler === 'function') {
        onAnyEventHandler()
    } else if (Array.isArray(onAnyEventHandler)) {
        onAnyEventHandler.forEach(fn => fn(data))
    }
}

Object.entries(socketHandlers).forEach(([event, handler]) => {
    socket.on(event, function (data) {
        let doOnAny = true
        if (typeof handler === 'function') {
            doOnAny = handler(data)
        } else if (handler && !data?.id) {
            return
        }
        const handlerHook = window[`${event}Event`]
        callIfFn(handlerHook, data)
        if (doOnAny) {
            onSocketAny(data)
        }
    })
})

// Event is emitted
// Params are keys in sent object
// Validator kills fn if failure
// CB called after emit
const socketHelpers = {
    emitNextThings: { event: 'thingsNext' },
    emitTabsLoaded: { event: 'tabsLoaded' },
    stopReading: { event: 'doneReading' },
    submitThingsAnswer: {
        event: 'submitThing',
        params: ['answer']
    },
    makeThingsGuess: {
        event: 'guessThing',
        params: ['characterId', 'answerText']
    },
    emitStartGame: {
        event: 'startGame',
        params: ['code']
    },
    sendChat: {
        event: 'chat',
        params: ['message'],
        validator: (message) => {
            return (typeof message === 'string' && message.trim().length >= 1)
        }
    },
    setGameType: {
        event: 'setGameType',
        params: ['type'],
        validator: (type) => {
            return (typeof type === 'string' && type.trim().length >= 1)
        }
    },
    joinRoom: {
        event: 'joinGame',
        params: ['code'],
        validator: (code) => {
            return (typeof code !== 'undefined')
        }
    },
    leaveRoom: {
        event: 'leaveGame',
        cb: () => {
            sessionStorage.setItem('valid', false)
            setTimeout(() => {
                window.location.href = '/lobby'
            }, 100)
        }
    },
    emitSubmitAvatar: {
        event: 'submitAvatar',
        params: ['avatar'],
        validator: (avatar) => {
            return (typeof avatar === 'string' && avatar.split('|').length === 2)
        }
    },
    setNumRounds: {
        event: 'setNumRounds',
        params: ['numRounds'],
        validator: (numRounds) => {
            return (!isNaN(numRounds) && numRounds >= 1 && numRounds <= 20)
        }
    }
}

Object.entries(socketHelpers).forEach(([fnName, fnValues]) => {
    window[fnName] = function(...args) {
        if (typeof fnValues.validator === 'function' && !fnValues.validator(...args)) {
            return
        }
        const data = {}
        if (!Array.isArray(fnValues.params)) {
            fnValues.params = []
        }
        fnValues.params.forEach((param, i) => {
            data[param] = args[i]
        })
        socket.emit(fnValues.event, data)
        callIfFn(fnValues.cb)
    }
})
