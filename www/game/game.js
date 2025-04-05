const VALID_GAMES = ['hypothetically', 'things', 'tenTabs']

let submitted = false

function gameRenderEvent(data) {
    if (typeof data?.currentGamePage !== 'string' || !data.currentGameCode) return
    if (sessionStorage.getItem('roomCode') != data.currentGameCode) {
        console.error('Game render event occurred with wrong code!', data)
        return
    }
    if ($(`img.player-cover-image[src="${selectedAssetBase64}"]`).length > 0) {
        clearSelectionCovers() // TODO Need to determine when we need to actually add covers, too
    }
    if (data.scoreUpdate && typeof scoreUpdateEvent === 'function') {
        scoreUpdateEvent(data.scoreUpdate)
    }
    if (data.iconChange && typeof iconChangeEvent === 'function') {
        iconChangeEvent(data.iconChange)
    }
    if (data.readerOrder && typeof readerOrderEvent === 'function') {
        readerOrderEvent(data.readerOrder)
    }
    if (data.currentGamePage.toLowerCase().includes('reveal') && typeof revealEvent === 'function') {
        revealEvent()
    }
    if (data.roundNumber && typeof roundNumberEvent === 'function') {
        roundNumberEvent(data.roundNumber)
    }
    renderPartial(data.currentGamePage)
    Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value) || typeof value === 'object') {
            value = JSON.stringify(value)
        }
        localStorage.setItem(`${data.currentGameCode}-${key}`, value)
    })
    $('.score-text').text('Score: ')
    $('.score').each(function () {
        if ($(this).text()?.trim().length < 1) {
            $(this).text('0')
        }
    })
}

function gameEndedEvent(data) {
    alert('Game Ended')
    // TODO Need a proper way to end the game.
    console.warn(data)
}

function nextIcon(inc) {
    if (submitted) return
    sessionStorage.setItem('cachedAvatar', '')
    let characters = Object.keys(characterAssetsBase64)
    let idx = characters.indexOf(localStorage.getItem('character'))
    idx += inc
    if (idx < 0) {
        idx = characters.length - 1
    } else if (idx >= characters.length) {
        idx = 0
    }
    let character = characters[idx]
    $('#character-image').attr('src', characterAssetsBase64[character])
    $('#character-text').text(character)
    localStorage.setItem('character', character)
}

function nextColor(inc) {
    if (submitted) return
    sessionStorage.setItem('cachedAvatar', '')
    let colors = Object.keys(backgroundAssetsBase64)
    let idx = colors.indexOf(localStorage.getItem('color'))
    idx += inc
    if (idx < 0) {
        idx = colors.length - 1
    } else if (idx >= colors.length) {
        idx = 0
    }
    let color = colors[idx]
    $('#color-image').attr('src', backgroundAssetsBase64[color])
    $('#color-text').text(color)
    localStorage.setItem('color', color)
}

function submitAvatar() {
    if (submitted) return
    let character = $('#character-text').text()
    let color = $('#color-text').text()
    sessionStorage.setItem('cachedColor', color)
    sessionStorage.setItem('cachedCharacter', character)
    if (character.trim().length < 2 || color.trim().length < 2) {
        alert('Invalid avatar information!')
    } else {
        let avatar = emitSubmitAvatar(character, color)
        sessionStorage.setItem('myAvatar', avatar)
    }
}

function updateAvatarDisplay() {
    let playerMap = JSON.parse(sessionStorage.getItem('playerMap') || '{}')
    let players = Object.entries(playerMap).map(([id, displayName]) => {
        return { id, displayName }
    })
    let avatarData = sessionStorage.getItem('avatarData') || '{}'
    avatarData = JSON.parse(avatarData)
    let myAvatar = sessionStorage.getItem('myAvatar')
    let myId = sessionStorage.getItem('myId')
    if (myAvatar && myId && !avatarData.map[myId]) {
        avatarData.map[myId] = myAvatar
    }
    $('#player-display').html(players.map(({ id, displayName }) => `
        <div class="player-avatar" data-playerid="${id}" data-playername="${displayName}">
            <img class="player-bkg-image" src="${
                avatarData.map[id]? backgroundAssetsBase64[avatarData.map[id].split('|')[1]] : unknownAssetBase64}">
            <img class="player-character-image" src="${
                avatarData.map[id]? characterAssetsBase64[avatarData.map[id].split('|')[0]] : unknownAssetBase64}">
            <img class="player-cover-image" id="cover-image-${id}" src="${transparentAssetBase64}">
            <div class="player-info">
                <p class="player-name">${displayName}</p>
                <p class="player-score"><span class="score-text">&nbsp;</span><span class="score" id="score-${id}"></span></p>
            </div>
        </div>
    `).join(''))
}

function thingSubmittedEvent(id) {
    if (id) {
        $(`#cover-image-${id}`).attr('src', selectedAssetBase64)
    }
}

function clearSelectionCovers() {
    $('img.player-cover-image').attr('src', transparentAssetBase64)
}

function checkWaitStartText(data) {
    if (data.numAvatarsChosen && data.numAvatarsChosen === data.totalPlayers) {
        $('#start-wait-text').text('Starting game...')
    }
}

function avatarSuccessEvent(data) {
    submitted = true
    sessionStorage.setItem('cachedAvatar', 'set')
    $('#icon-picker').html('<h4 id="start-wait-text">Waiting for game to start...</h4>')
    checkWaitStartText(data)
    $('#selection-container').html(`
        <p>
            <strong id="avatars-submitted-text">${data.numAvatarsChosen} / ${data.totalPlayers} </strong> Submitted
        </p>
    `)
    updateAvatarDisplay()
    if (typeof avatarSuccessCallback === 'function') {
        avatarSuccessCallback(data.numAvatarsChosen, data.totalPlayers)
    }
}

function newAvatarEvent(data) {
    if (submitted) {
        $('#avatars-submitted-text').text(`${data.numAvatarsChosen} / ${data.totalPlayers}`)
    } else {
        sessionStorage.setItem('latestAvatarInfo', JSON.stringify(data))
    }
    sessionStorage.setItem('avatarData', JSON.stringify(data))
    updateAvatarDisplay()
    checkWaitStartText(data)
    if (typeof newAvatarCallback === 'function') {
        newAvatarCallback(data.numAvatarsChosen, data.totalPlayers)
    }
}

function sendChatMessage(message) {
    let name = sessionStorage.getItem('myName')
    updateChatWindow(`${name} (me): ${message}`)
    sendChat(message)
}

function sendMessage(event) {
    if (event.key === 'Enter') {
        const message = document.getElementById('chat-input').value;
        if (message.trim()) {
            sendChatMessage(message)
            document.getElementById('chat-input').value = ''
        }
    }
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

function newChatEvent(data) {
    if (data.displayName) {
        updateChatWindow(`${data.displayName}: ${data.message}`, data.id)
    } else {
        updateChatWindow(data.message, -1)
    }
}

function loadScript(scriptName, callback) {
    $.getScript(`./${scriptName.trim().toLowerCase()}.js`)
        .done(() => {
            if (typeof callback === 'function') {
                callback()
            }
        })
        .fail(() => {
            alert(`Failed to load "${scriptName.trim()}" file!`)
        })
}

$(document).ready(() => {
    let room = null
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
            console.warn('Error retreiving current room!', err)
            room = null
        })
        .finally(() => {
            if (room) {
                if (!room.gameRunning) {
                    window.location.href = '/lobby'
                    return
                } else if (!room.code || !room.id) {
                    alertAndNavigate('Invalid room information retreived!', '/lobbies')
                    return
                }
                if (sessionStorage.getItem('loadedRoomCode') !== room.code) {
                    sessionStorage.removeItem('myAvatar')
                }
                sessionStorage.setItem('gameMode', room.gameType)
                sessionStorage.setItem('myId', room.id)
                sessionStorage.setItem('hostId', room.host)
                sessionStorage.setItem('roomCode', room.code)
                sessionStorage.setItem('loadedRoomCode', room.code)
                sessionStorage.setItem('avatarData', JSON.stringify(room.avatarData) || '{}')
                sessionStorage.setItem('playerMap', JSON.stringify(room.players))
                $('#things-total-rounds').text(room?.numRounds)

                updateChatWindow('(Room Created)', 0)
                room.chatHistory.forEach(msg => {
                    if (msg.id == sessionStorage.getItem('myId')) {
                        msg.displayName += ' (me)'
                    }
                    newChatEvent(msg)
                })

                if (typeof room.currentPage === 'string') {
                    loadScript(room.gameType, () => {
                        $('.score-text').text('Score: ')
                        setTimeout(() => {
                            if (room.readerOrder && typeof readerOrderEvent === 'function') {
                                readerOrderEvent(room.readerOrder)
                            }
                            if (room.scoreMap && typeof scoreUpdateEvent === 'function') {
                                scoreUpdateEvent(room.scoreMap)
                            }
                            if (room.roundNumber && typeof roundNumberEvent === 'function') {
                                roundNumberEvent(room.roundNumber)
                            } else if (room.gameType?.trim().toLowerCase() === 'things') {
                                $('#things-number-header').toggleClass('hidden', false)
                            }
                            if (room.videoIds && typeof loadTabs === 'function') {
                                loadTabs(room.videoIds)
                            }
                        }, 100)
                    })
                    avatarSuccessEvent(room.avatarData)
                    renderPartial(`${room.currentPage}_${room.gameType.trim().toLowerCase()}`)
                } else {
                    $('#character-selection').toggleClass('hidden', false)
                    let hasAvatar = (room.avatarData?.map && room.avatarData.map[room.id])
                    let color = randomArrayItem(Object.keys(backgroundAssetsBase64))
                    let character = randomArrayItem(Object.keys(characterAssetsBase64))
                
                    if (hasAvatar) {
                        let data = room.avatarData.map[room.id].split('|')
                        character = data[0]
                        color = data[1]
                    } else if (sessionStorage.getItem('cachedAvatar') === 'set') {
                        character = sessionStorage.getItem('cachedCharacter')
                        color = sessionStorage.getItem('cachedColor')
                    }

                    $('#character-image').attr('src', characterAssetsBase64[character])
                    $('#color-image').attr('src', backgroundAssetsBase64[color])
                    $('#character-text').text(character)
                    localStorage.setItem('character', character)
                    $('#color-text').text(color)
                    localStorage.setItem('color', color)
                
                    if (hasAvatar) {
                        avatarSuccessEvent(room.avatarData)
                    } else {
                        updateAvatarDisplay()
                    }

                    loadScript(room.gameType)
                }
            } else {
                alertAndNavigate('Could not find valid game!', '/lobbies')
            }
        })
    setTimeout(() => {
        if (typeof revealEvent === 'function') {
            revealEvent()
        }
    }, 500)
})
