const VALID_GAMES = ['hypothetically', 'things', 'tenTabs']

let submitted = false

function gameRenderEvent(data) {
    if (typeof data?.currentGamePage !== 'string' || !data.currentGameCode) return
    if (sessionStorage.getItem('roomCode') != data.currentGameCode) {
        console.error('Game render event occurred with wrong code!', data)
        return
    }
    if ($(`img.player-cover-image[src="${selectedAssetBase64}"]`).length > 0) {
        clearSelectionCovers()
    }
    data.scoreUpdate && callIfFn(scoreUpdateEvent, data.scoreUpdate)
    data.iconChange && callIfFn(iconChangeEvent, data.iconChange)
    data.readerOrder && callIfFn(readerOrderEvent, data.readerOrder)
    if (data.currentGamePage.toLowerCase().includes('reveal')) {
        callIfFn(revealEvent)
    }
    data.roundNumber && callIfFn(roundNumberEvent, data.roundNumber)
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
    updateAvatarDisplay()
}

function gameEndedEvent(data) {
    alert('Game Ended')
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
        let avatar = `${character.trim()}|${color.trim()}`
        emitSubmitAvatar(avatar)
        sessionStorage.setItem('myAvatar', avatar)
    }
}

function thingSubmittedEvent(data) {
    if (data.id) {
        $(`#cover-image-${data.id}`).attr('src', selectedAssetBase64)
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

function avatarSubmissionSuccessEvent(data) {
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
    callIfFn(avatarSuccessCallback, data.numAvatarsChosen, data.totalPlayers)
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
    callIfFn(newAvatarCallback, data.numAvatarsChosen, data.totalPlayers)
}

function updateAvatarDisplay() {
    setTimeout(() => {
        renderPartial('avatarBoard', 'player-display', () => {
            let el = $('#player-display span.score-text:first')
            if (el.length && !el.text().toLowerCase().includes('score')) {
                $('span.score-text').html('&nbsp;')
                $('span.score').html('&nbsp;')
            }
        })
    }, 1)
}

function sendChatMessage(message) {
    let name = sessionStorage.getItem('myName')
    updateChatWindow(`${name} (me): ${message}`)
    sendChat(message.trim())
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
            callIfFn(callback)
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
                            room.readerOrder && callIfFn(readerOrderEvent, room.readerOrder)
                            room.scoreMap && callIfFn(scoreUpdateEvent, room.scoreMap)
                            if (room.roundNumber && typeof roundNumberEvent === 'function') {
                                roundNumberEvent(room.roundNumber)
                            } else if (room.gameType?.trim().toLowerCase() === 'things') {
                                $('#things-number-header').toggleClass('hidden', false)
                            }
                            room.videoIds && callIfFn(loadTabs, room.videoIds)
                        }, 100)
                    })
                    avatarSubmissionSuccessEvent(room.avatarData)
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
                    } else if (sessionStorage.getItem('cachedAvatar') === 'set' || room.yourDefaultAvatar) {
                        character = room?.yourDefaultAvatar.character || sessionStorage.getItem('cachedCharacter')
                        color = room?.yourDefaultAvatar.color || sessionStorage.getItem('cachedColor')
                    }

                    $('#character-image').attr('src', characterAssetsBase64[character])
                    $('#color-image').attr('src', backgroundAssetsBase64[color])
                    $('#character-text').text(character)
                    localStorage.setItem('character', character)
                    $('#color-text').text(color)
                    localStorage.setItem('color', color)
                
                    if (hasAvatar) {
                        avatarSubmissionSuccessEvent(room.avatarData)
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
        callIfFn(revealEvent)
    }, 500)
})
