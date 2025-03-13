const VALID_GAMES = ['hypothetically', 'things']

const SESSION_NOT_VALID = 0
const SESSION_VALID = 1
const SESSION_MADE_VALID = 2

function isSessionValid() {
    return new Promise((resolve) => {
        if (!sessionStorage.getItem('valid')) {
            resolve(SESSION_NOT_VALID)
            return
        }
        let code = sessionStorage.getItem('roomMode')
        let myId = sessionStorage.getItem('myId')
        let hostId = sessionStorage.getItem('hostId')
        let gameMode = sessionStorage.getItem('gameMode')
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
                    if (room.gameType === gameMode && room.host === hostId && room.id === myId && room.code == code) {
                        sessionStorage.setItem('valid', true)
                        resolve(SESSION_VALID)
                        return
                    } else if (VALID_GAMES.includes(room.gameType) && room.code && room.id) {
                        sessionStorage.setItem('gameMode', room.gameType)
                        sessionStorage.setItem('myId', room.id)
                        sessionStorage.setItem('hostId', room.host)
                        sessionStorage.setItem('roomCode', room.code)
                        sessionStorage.setItem('valid', true)
                        resolve(SESSION_MADE_VALID)
                        return
                    } else {
                        sessionStorage.setItem('valid', false)
                        resolve(SESSION_NOT_VALID)
                        return
                    }
                } else {
                    sessionStorage.setItem('valid', false)
                    resolve(SESSION_NOT_VALID)
                    return
                }
            })
    })
}
