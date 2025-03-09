const MAX_PLAYERS = 12

function joinLobby(code) {
    window.location.href = `/lobby?${code}`
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
    getPublicGames().then(({ games }) => {
        let tableContents = ''
        games.forEach(({ code, joinable, hostName, numPlayers }) => {
            tableContents += `
                <td>${hostName}</td>
                <td>${numPlayers}/${MAX_PLAYERS}</td>
                <td>${code}</td>
                <td>
                    <button onclick="joinLobby('${code}')" ${(joinable && numPlayers < MAX_PLAYERS)? '' : 'disabled'}>
                        Join</button>
                </td>
            `
        })
        $('tbody').html(tableContents)
    })
}

function createLobby(isPublic) {
    makeRoom(isPublic)
        .then((data) => {
            alert('Room made!')
            console.log(data) // TODO
        })
        .catch((err) => {
            alert('Could not make room!')
            console.error(err)
        })
}

$(document).ready(refreshLobbies)
