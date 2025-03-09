let gameCode = new URLSearchParams(window.location.search).get('code');
const MAX_PLAYERS = 12;
let players = []
let messages = []
let isHost = false
let myName = '[DisplayName]'
let myId = -1

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
    const messageElement = document.createElement('div')
    messageElement.textContent = message
    chatWindow.appendChild(messageElement)
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
                if (room.yourName) {
                    myName = room.yourName
                }
                if (room.id) {
                    myId = room.id
                }
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
                $('#player-list').html(
                    players.map(player => `<li>${player.displayName || "Unknown Player"}</li>`).join('')
                )
            } else {
                window.location.href = '/lobbies'
            }
        })
})

function newChatEvent(data) {
    updateChatWindow(`${data.displayName}: ${data.message}`, data.id)
}

function joinRoomEvent(data) {
    let exists = players.find(x => x.id === data?.id)
    if (exists || players.length >= MAX_PLAYERS) return
    players.push(data)
    $('#player-list').html(
        players.map(player => `<li>${player.displayName || "Unknown Player"}</li>`).join('')
    )
    updateChatWindow(`${data.displayName || "Unknown Player"} joined the room`)
}

function leaveRoomEvent(data) {
    let player = players.find(x => x.id === data?.id)
    if (!player) return
    players = players.filter(x => x.id === data.id)
    $('#player-list').html(
        players.map(player => `<li>${player.displayName || "Unknown Player"}</li>`).join('')
    )
    updateChatWindow(`${data.displayName || "Unknown Player"} left the room`)
}
