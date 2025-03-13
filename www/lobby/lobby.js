let gameCode = new URLSearchParams(window.location.search).get('code');
const MAX_PLAYERS = 12;
let players = []
let messages = []
let isHost = false
let myName = '[DisplayName]'
let myId = -1
let hostId = -1
let roomCode = ""

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
    updateChatWindow(`${myName} (me): ${message}`)
    sendChat(message)
}

function updateChatWindow(message, id) {
    messages.push([message, id])
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
    if (confirm('Start the game?')) {
        // Logic to start the game
        console.log('Game starting...');
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
        kickPlayer(roomCode, id).catch((err) => {
            console.error('Failed to kick ' + name, err)
            alert('Failed to kick player!')
        })
    }
}

function updatePlayerList(players) {
    if (!Array.isArray(players)) return
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
            alert('Error retrieving room!')
            console.error(err)
            room = undefined
        })
        .finally(() => {
            if (room) {
                isHost = room.isHost
                if (isHost) {
                    let gameModeSelect = $('#game-mode')
                    gameModeSelect.attr('disabled', false)
                    gameModeSelect.change(() => {
                        setGameType(gameModeSelect.val())
                    })
                }
                if (room.yourName) {
                    myName = room.yourName
                }
                $('#game-mode').val(room.gameType)
                $('#game-mode-default').remove()
                myId = room.id
                hostId = room.host
                roomCode = room.code
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
                updateChatWindow('(Room Created)', 0)
                room.chatHistory.forEach(msg => {
                    if (msg.id == myId) {
                        msg.displayName += ' (me)'
                    }
                    newChatEvent(msg)
                })
                updatePlayerList(players)
            } else {
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
    updatePlayerList(players)
    updateChatWindow(`${data.displayName || "Unknown Player"} joined the room`)
}

function leaveRoomEvent(data) {
    let player = players.find(x => x.id === data?.id)
    if (!player) return
    players = players.filter(x => x.id !== data.id)
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
        window.location.href = '/lobbies'
    }, 1)
}
