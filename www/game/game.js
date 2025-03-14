const VALID_GAMES = ['hypothetically', 'things']

const SESSION_NOT_VALID = 0
const SESSION_VALID = 1
const SESSION_MADE_VALID = 2
const SESSION_VALID_GO_TO_LOBBY = 3

let submitted = false

function isSessionValid() {
    return new Promise((resolve) => {
        let isValid = sessionStorage.getItem('valid') === 'true'
        if (!isValid) {
            resolve(SESSION_NOT_VALID)
            return
        }
        let code = sessionStorage.getItem('roomCode') || '?'
        let myId = sessionStorage.getItem('myId') || ''
        let hostId = sessionStorage.getItem('hostId') || ''
        let gameMode = sessionStorage.getItem('gameMode') || 'invalid'
        if (!VALID_GAMES.includes(gameMode) || typeof getCurrentRoom !== 'function') {
            resolve(SESSION_NOT_VALID)
            return
        }
        if (!code || !myId || !hostId) {
            resolve(SESSION_NOT_VALID)
            return
        }
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
                console.warn('Error retreiving current room in isSessionValid', err)
                room = null
            })
            .finally(() => {
                if (room) {
                    if (code !== room.code) {
                        sessionStorage.removeItem('myAvatar')
                    }
                    if (!room.gameRunning) {
                        sessionStorage.setItem('valid', (room.host === hostId && room.id === myId && room.code == code))
                        resolve(SESSION_VALID_GO_TO_LOBBY)
                        return
                    } else if (room.gameType === gameMode && room.host === hostId && room.id === myId && room.code == code) {
                        sessionStorage.setItem('valid', true)
                        sessionStorage.setItem('avatarData', JSON.stringify(room.avatarData))
                        sessionStorage.setItem('playerMap', JSON.stringify(room.players))
                        resolve(SESSION_VALID)
                        return
                    } else if (VALID_GAMES.includes(room.gameType) && room.code && room.id) {
                        sessionStorage.setItem('gameMode', room.gameType)
                        sessionStorage.setItem('myId', room.id)
                        sessionStorage.setItem('hostId', room.host)
                        sessionStorage.setItem('roomCode', room.code)
                        sessionStorage.setItem('valid', true)
                        sessionStorage.setItem('avatarData', JSON.stringify(room.avatarData) || '{}')
                        sessionStorage.setItem('playerMap', JSON.stringify(room.players))
                        resolve(SESSION_MADE_VALID)
                        return
                    } else {
                        sessionStorage.setItem('valid', false)
                        sessionStorage.removeItem('myAvatar')
                        resolve(SESSION_NOT_VALID)
                        return
                    }
                } else {
                    sessionStorage.setItem('valid', false)
                    sessionStorage.removeItem('myAvatar')
                    resolve(SESSION_NOT_VALID)
                    return
                }
            })
    })
}

function gameRenderEvent(data) {
    if (typeof data?.currentGamePage !== 'string' || !data.currentGameCode) return
    if (sessionStorage.getItem('roomCode') != data.currentGameCode) {
        console.error('Game render event occurred with wrong code!', data)
        return
    }
    renderPartial(data.currentGamePage)
    Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value) || typeof value === 'object') {
            value = JSON.stringify(value)
        }
        localStorage.setItem(`${data.currentGameCode}-${key}`, value)
    })
    $('.score-text').text('Score:')
    $('.score').each(function () {
        if ($(this).text()?.trim().length < 1) {
            $(this).text('0')
        }
    })
}

function gameEndedEvent(data) {
    alert('Game Ended')
    // TODO
    console.warn(data)
}

function nextIcon(inc) {
    if (submitted) return
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
    if (character.trim().length < 2 || color.trim().length < 2) {
        alert('Invalid avatar information!')
    } else {
        let avatar = emitSubmitAvatar(character, color)
        sessionStorage.setItem('myAvatar', avatar)
    }
}

function updateAvatarDisplay() {
    let players = sessionStorage.getItem('players') || '{}'
    players = JSON.parse(players)
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
                avatarData.map[id]? backgroundAssetsBase64[avatarData.map[id].split('|')[1]] : unknownBackgroundAssetBase64}"}>
            <img class="player-character-image" src="${
                avatarData.map[id]? characterAssetsBase64[avatarData.map[id].split('|')[0]] : unknownCharacterAssetBase64}"}>
            <div class="player-info">
                <p class="player-name">${displayName}</p>
                <p class="player-score"><span class="score-text">&nbsp;</span><span class="score" id="score-${id}"></span></p>
            </div>
        </div>
    `).join(''))
}

function checkWaitStartText(data) {
    if (data.numAvatarsChosen && data.numAvatarsChosen === data.totalPlayers) {
        $('#start-wait-text').text('Starting game...')
    }
}

function avatarSuccessEvent(data) {
    submitted = true
    $('#icon-picker').html('<h4 id="start-wait-text">Waiting for game to start...</h4>')
    checkWaitStartText(data)
    $('#selection-container').html(`
        <p>
            <strong>
                <span id="avatars-submitted-text">
                    ${data.numAvatarsChosen}
                </span>/<span id="total-avatars-text">
                    ${data.totalPlayers}
                </span>
            </strong> Submitted
        </p>
    `)
    updateAvatarDisplay()
}

function newAvatarEvent(data) {
    if (submitted) {
        $('#avatars-submitted-text').text(data.numAvatarsChosen)
        $('#total-avatars-text').text(data.totalPlayers)
    } else {
        sessionStorage.setItem('latestAvatarInfo', JSON.stringify(data))
    }
    sessionStorage.setItem('avatarData', JSON.stringify(data))
    updateAvatarDisplay()
    checkWaitStartText(data)
}

$(document).ready(async () => {
    let sessionValue = await isSessionValid()
    if (sessionValue === SESSION_VALID_GO_TO_LOBBY) {
        window.location.href = '/lobby'
        return
    } if (sessionValue !== SESSION_VALID && sessionValue !== SESSION_MADE_VALID) {
        await alertAndNavigate('Could not find valid game!', '/lobbies')
        return
    } else if (sessionValue === SESSION_MADE_VALID) {
        console.warn('Had to make current session information valid.')
    }

    let avatarData = sessionStorage.getItem('avatarData') || '{}'
    avatarData = JSON.parse(avatarData)
    let myId = sessionStorage.getItem('myId') || '??'
    let hasAvatar = (avatarData?.map && avatarData.map[myId])
    let color = randomArrayItem(Object.keys(backgroundAssetsBase64))
    let character = randomArrayItem(Object.keys(characterAssetsBase64))

    if (hasAvatar) {
        let data = avatarData.map[myId].split('|')
        character = data[0]
        color = data[1]
    }

    $('#character-image').attr('src', characterAssetsBase64[character])
    $('#color-image').attr('src', backgroundAssetsBase64[color])
    $('#character-text').text(character)
    localStorage.setItem('character', character)
    $('#color-text').text(color)
    localStorage.setItem('color', color)

    if (hasAvatar) {
        avatarSuccessEvent(avatarData)
    } else {
        updateAvatarDisplay()
    }
})
