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
    let hostId = localStorage.getItem('hostId') || 'unknown'
    let myId = localStorage.getItem('myId')
    if (hostId !== myId) {
        console.warn('Tried to start game without being host!')
        return
    }
    if (confirm('Start the game?')) {
        // TODO
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

function validateStillInRoom() {
    getCurrentRoom()
        .then((data) => {
            if (data.none) {
                throw new Error(data)
            }
            let roomCode = sessionStorage.getItem('roomCode')
            if (!roomCode || room.code !== roomCode) {
                throw new Error(room.code)
            }
            let isValid = sessionStorage.getItem('valid')
            if (!isValid) {
                throw new Error({ valid: false })
            }
        })
        .catch((err) => {
            sessionStorage.setItem('valid', false)
            console.warn('Room no longer valid', err)
            alert('Room is no longer valid!')
            setTimeout(() => {
                window.location.href = '/lobbies'
            }, 100)
        })
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
                if (room.isHost) {
                    let gameModeSelect = $('#game-mode')
                    gameModeSelect.attr('disabled', false)
                    gameModeSelect.change(() => {
                        setGameType(gameModeSelect.val())
                    })
                }
                sessionStorage.setItem('myName', (room.yourName || 'You'))
                $('#game-mode').val(room.gameType)
                $('#game-mode-default').remove()
                sessionStorage.setItem('myId', room.id)
                sessionStorage.setItem('hostId', room.host)
                sessionStorage.setItem('roomCode', room.code)
                $('#room-code').text('Room Code: ' + room.code)
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
                sessionStorage.setItem('players', players)
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
    sessionStorage.setItem('players', players)
    updatePlayerList(players)
    updateChatWindow(`${data.displayName || "Unknown Player"} joined the room`)
}

function leaveRoomEvent(data) {
    let player = players.find(x => x.id === data?.id)
    if (!player) return
    players = players.filter(x => x.id !== data.id)
    sessionStorage.setItem('players', players)
    updatePlayerList(players)
    updateChatWindow(`${data.displayName || "Unknown Player"} left the room`)
}

function gameTypeChangedEvent(data) {
    if (!data?.type) return
    if (typeof data.type !== 'string' || data.type.trim().length < 1) return
    $('#game-mode').val(data.type.trim())
}

function kickedEvent(data) {
    if (!data) return
    alert('You were kicked from this room.')
    setTimeout(() => {
        sessionStorage.setItem('valid', false)
        window.location.href = '/lobbies'
    }, 1)
}
