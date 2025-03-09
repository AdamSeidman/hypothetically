const MAX_PLAYERS = 12

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
    const code = document.getElementById("room-code").value.toUpperCase()
    if (code.length !== 6) {
        alert("Invalid room code")
        return
    }
    window.location.href = `/lobby?${code}`
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
        .then((data) => {
            window.location.href = '/lobby'
        })
        .catch((err) => {
            alert('Could not make room!')
            console.error(err)
        })
}

$(document).ready(refreshLobbies)
