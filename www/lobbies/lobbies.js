const MAX_PLAYERS = 12
const ROOM_CODE_LENGTH = 7

function joinLobby(code) {
    joinGame(code)
        .then(() => {
            window.location.href = '/lobby'
        })
        .catch((err) => {
            alert('Could not join lobby!')
            console.error(err)
        })
}

function joinPrivateLobby() {
    const code = document.getElementById("room-code").value.toUpperCase().trim()
    if (code.length !== ROOM_CODE_LENGTH) {
        alert("Invalid room code")
        return
    }
    joinGame(code)
        .then(() => {
            window.location.href = '/lobby'
        })
        .catch(() => {
            alert('Could not find room!')
        })
}

function refreshLobbies() {
    let getGames = getPublicGames()
    getCurrentRoom().then(async ({ none }) => {
        if (!none) {
            await getGames
            window.location.href = '/Lobby'
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
