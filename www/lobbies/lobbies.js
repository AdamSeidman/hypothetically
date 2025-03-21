const MAX_PLAYERS = 12
const ROOM_CODE_LENGTH = 7

function performJoin(code, isPrivate) {
    joinGame(code)
        .then(() => {
            window.location.href = '/lobby'
        })
        .catch((err) => {
            if (err.err) {
                alert(err.err)
            } else if (isPrivate) {
                alert('Could not find room!')
            } else {
                alert('Error joining lobby!')
                console.error(err)
            }
        })
}

function joinLobby(code) {
    performJoin(code, false)
}

function joinPrivateLobby() {
    const code = document.getElementById("room-code").value.toUpperCase().trim()
    if (code.length !== ROOM_CODE_LENGTH) {
        alert("Invalid Room Code")
        return
    }
    performJoin(code, true)
}

function refreshLobbies() {
    let getGames = getPublicGames()
    sessionStorage.setItem('cachedAvatar', '')
    getCurrentRoom().then(async ({ none, gameRunning }) => {
        if (!none) {
            await getGames
            if (gameRunning) {
                window.location.href = '/game'
            } else {
                window.location.href = '/lobby'
            }
        }
    })
    getGames.then(({ games }) => {
        let tableContents = ''
        games.forEach(({ code, joinable, hostName, numPlayers }) => {
            tableContents += `
                <tr>
                    <td>${hostName}</td>
                    <td>${numPlayers}/${MAX_PLAYERS}</td>
                    <td>${code}</td>
                    <td>
                        <button onclick="joinLobby('${code}')" ${(joinable && numPlayers < MAX_PLAYERS)? '' : 'disabled'}>
                            Join</button>
                    </td>
                </tr>
            `
        })
        $('tbody').html(tableContents)
    })
}

function createLobby(isPublic) {
    makeRoom(isPublic)
        .then(() => {
            window.location.href = '/lobby'
        })
        .catch((err) => {
            alert('Could not make room!')
            console.error(err)
        })
}

$(document).ready(refreshLobbies)
setInterval(refreshLobbies, 2000)
