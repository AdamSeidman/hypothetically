const MAX_PLAYERS = 12;
let players = []

function sendMessage(event) {
    if (event.key === 'Enter') {
        const message = document.getElementById('chat-input').value;
        if (message.trim()) {
            sendChatMessage(message)
            document.getElementById('chat-input').value = ''
        }
    }
}

function sendChatMessage(message) {
    let name = sessionStorage.getItem('myName')
    updateChatWindow(`${name} (me): ${message}`)
    sendChat(message)
}

function updateChatWindow(message, id) {
    const chatWindow = document.getElementById('chat-window')
    const isAtBottom = chatWindow.scrollHeight - chatWindow.scrollTop <= chatWindow.clientHeight + 5
    const messageElement = document.createElement('div')
    messageElement.textContent = message
    chatWindow.appendChild(messageElement)
    if (isAtBottom) {
        chatWindow.scrollTop = chatWindow.scrollHeight
    }
}

function startGame() {
    let hostId = sessionStorage.getItem('hostId') || 'unknown'
    let myId = sessionStorage.getItem('myId')
    if (hostId !== myId) {
        console.warn('Tried to start game without being host!')
        return
    }
    if (confirm('Start the game?')) {
        emitStartGame(sessionStorage.getItem('roomCode') || '_')
    }
}

function leaveLobby() {
    if (confirm('Are you sure you want to leave the lobby?')) {
        leaveRoom()
    }
}

function performKick(id) {
    if (!id) return
    let name = players.find(x => x.id == id)?.displayName
    if (confirm(`Are you sure you want to kick ${name || '"Unknown Player"'}?`)) {
        let roomCode = sessionStorage.getItem('roomCode') || '?'
        kickPlayer(roomCode, id).catch((err) => {
            console.error('Failed to kick ' + name, err)
            alert('Failed to kick player!')
        })
    }
}

function updatePlayerList(players) {
    if (!Array.isArray(players)) return
    let myId = sessionStorage.getItem('myId')
    let hostId = sessionStorage.getItem('hostId')
    $('#player-list').html(
        players.map(player => `
            <tr>
                <td id="player-${player.id}" class="player-name">
                    ${player.displayName || "Unknown Player"}
                </td>
                <td>&ensp;&ensp;</td>
                <td>
                    ${(player.id === hostId)? '&nbsp;' : 
                        `<button onclick="performKick('${player.id}')" class="hidden kick-btn">Kick</button>`}
                </td>
            </tr>
        `).join('')
    )
    $('#player-' + myId).append(' (you)')
    $('#player-' + hostId).prepend('<i class="fa-solid fa-crown"></i>&nbsp;')
    if (myId === hostId) {
        $('.kick-btn').toggleClass('hidden', false)
    }
}

function storePlayers() {
    sessionStorage.setItem('players', JSON.stringify(players))
}

function validateStillInRoom() {
    getCurrentRoom()
        .then((data) => {
            if (data.none) {
                throw new Error(data)
            }
            let roomCode = sessionStorage.getItem('roomCode')
            if (!roomCode || data.code !== roomCode) {
                throw new Error(data.code)
            }
            let isValid = sessionStorage.getItem('valid') === 'true'
            if (!isValid) {
                throw new Error({ valid: false })
            }
        })
        .catch((err) => {
            sessionStorage.setItem('valid', false)
            console.warn('Room no longer valid', err)
            alert('Room is no longer valid!')
            setTimeout(() => {
                sessionStorage.setItem('cachedAvatar', '')
                window.location.href = '/lobbies'
            }, 100)
        })
}

function startGameFailedEvent(data) {
    let text = 'Failed to start game'
    if (data?.reason) {
        text += `.\nReason: ${data.reason}`
    } else {
        text += '!'
    }
    alert(text)
}

function gameStartedEvent(data) {
    if (sessionStorage.getItem('roomCode') === data.code) {
        window.location.href = '/game'
    } else {
        console.warn('Tried to start game from wrong lobby!', data)
    }
}

$(document).ready(() => {
    let room = {}
    getCurrentRoom()
        .then((data) => {
            if (data.none) {
                room = undefined
            } else {
                delete data.none
                room = data
            }
        })
        .catch((err) => {
            alert('Error retrieving room information!')
            console.error(err)
            room = undefined
        })
        .finally(() => {
            if (room) {
                if (room.gameRunning) {
                    sessionStorage.setItem('gameMode', room.gameType)
                    sessionStorage.setItem('myId', room.id)
                    sessionStorage.setItem('hostId', room.host)
                    sessionStorage.setItem('roomCode', room.code)
                    sessionStorage.setItem('valid', true)
                    setTimeout(() => {
                        window.location.href = '/game'
                    }, 1)
                    return
                }
                if (room.isHost) {
                    let gameModeSelect = $('#game-mode')
                    let numRoundsSelect = $('#num-rounds')
                    gameModeSelect.attr('disabled', false)
                    gameModeSelect.change(() => {
                        let val = gameModeSelect.val()
                        setGameType(val)
                        numRoundsSelect.toggleClass('hidden', !val.toLowerCase().includes('things'))
                        $('#num-rounds-label').toggleClass('hidden', !val.toLowerCase().includes('things'))
                    })
                    numRoundsSelect.attr('disabled', false)
                    numRoundsSelect.change(() => {
                        setNumRounds(numRoundsSelect.val())
                    })
                    $('.action-buttons button').attr('disabled', (Object.keys(room.players).length <= 1))
                }
                $('.action-buttons').toggleClass('hidden', !room.isHost)
                sessionStorage.setItem('myName', (room.yourName || 'You'))
                $('#game-mode').val(room.gameType)
                $('#num-rounds').val(`${room.numRounds}`)
                $('#game-mode-default').remove()
                sessionStorage.setItem('gameMode', room.gameType)
                sessionStorage.setItem('myId', room.id)
                sessionStorage.setItem('hostId', room.host)
                sessionStorage.setItem('roomCode', room.code)
                $('#room-code').prepend('Room Code: ' + room.code)
                $('#copy-code').toggleClass('hidden', false)
                $('#copy-code svg').click(() => {
                    navigator.clipboard.writeText(`${window.location.origin}/join/${room.code}`)
                    $('#copy-code').toggleClass('copied-tooltip', true)
                    setTimeout(() => {
                        $('#copy-code').toggleClass('copied-tooltip', false)
                    }, 1000)
                })
                Object.entries(room.players).forEach(([id, displayName]) => {
                    if (id == room.host) {
                        players.push({
                            id,
                            displayName
                        })
                    }
                })
                Object.entries(room.players).forEach(([id, displayName]) => {
                    if (id != room.host) {
                        players.push({
                            id,
                            displayName
                        })
                    }
                })
                storePlayers()
                updateChatWindow('(Room Created)', 0)
                room.chatHistory.forEach(msg => {
                    if (msg.id == sessionStorage.getItem('myId')) {
                        msg.displayName += ' (me)'
                    }
                    newChatEvent(msg)
                })
                updatePlayerList(players)
                setTimeout(() => {
                    setInterval(validateStillInRoom, (60 * 1000))
                }, (120 * 1000))
                sessionStorage.setItem('valid', true)
            } else {
                sessionStorage.setItem('valid', false)
                sessionStorage.setItem('cachedAvatar', '')
                window.location.href = '/lobbies'
            }
        })
})

function newChatEvent(data) {
    if (data.displayName) {
        updateChatWindow(`${data.displayName}: ${data.message}`, data.id)
    } else {
        updateChatWindow(data.message, -1)
    }
}

function joinRoomEvent(data) {
    let exists = players.find(x => x.id === data?.id)
    if (exists || players.length >= MAX_PLAYERS) return
    players.push(data)
    storePlayers()
    updatePlayerList(players)
    updateChatWindow(`${data.displayName || "Unknown Player"} joined the room`)
    if (sessionStorage.getItem('myId') === sessionStorage.getItem('hostId')) {
        $('.action-buttons button').attr('disabled', false)
    }
}

function leaveRoomEvent(data) {
    let player = players.find(x => x.id === data?.id)
    if (!player) return
    players = players.filter(x => x.id !== data.id)
    storePlayers()
    updatePlayerList(players)
    updateChatWindow(`${data.displayName || "Unknown Player"} left the room`)
    if (sessionStorage.getItem('myId') === sessionStorage.getItem('hostId')) {
        $('.action-buttons button').attr('disabled', (players.length <= 1))
    }
}

function gameTypeChangedEvent(data) {
    if (!data?.type) return
    if (typeof data.type !== 'string' || data.type.trim().length < 1) return
    sessionStorage.setItem('gameMode', data.type.trim())
    $('#game-mode').val(data.type.trim())
}

function numRoundsChangedEvent(data) {
    if (!data?.numRounds || isNaN(data.numRounds)) return
    $('#num-rounds').val('' + data.numRounds)
}

function kickedEvent(data) {
    if (!data) return
    sessionStorage.setItem('valid', false)
    sessionStorage.setItem('cachedAvatar', '')
    setTimeout(() => {
        alertAndNavigate('You were kicked from this room.', '/lobbies')
    }, 1)
}
