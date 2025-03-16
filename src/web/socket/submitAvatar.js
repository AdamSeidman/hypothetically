/**
 * Start the game with WebSockets
 */

const Games = require('../../game/gameManager')
const Avatars = require('../../../www/assets/img/characters')

let Sockets = undefined
const GAME_START_WAIT = 2 * 1000

function isValidAvatar(avatar) {
    if (typeof avatar !== 'string') return false
    avatar = avatar.split('|').map(x => x.trim())
    if (avatar.length !== 2) return false
    if (!Object.keys(Avatars.characterAssetsBase64).includes(avatar[0])) return false
    if (!Object.keys(Avatars.backgroundAssetsBase64).includes(avatar[1])) return false
    return true
}

function handle(message, socket, id) {
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    if (!message.avatar || !isValidAvatar(message.avatar)) {
        socket.emit('avatarSubmissionFailed', {})
        return
    }
    let ret = Games.submitAvatar(id, message.avatar.trim())
    if (ret) {
        socket.emit('avatarSubmissionSuccess', ret)
        Sockets.sendToRoom(socket, 'newAvatar', ret)
        if (ret.totalPlayers && ret.totalPlayers === ret.numAvatarsChosen) {
            let code = Games.getGameCodeOf(id)
            if (!code) return
            let room = Games.startGameObject(code)
            if (!room) return
            setTimeout(() => {
                let gameType = Games.getGameType(code)
                let payload = {
                    currentGamePage: `start_${gameType.toLowerCase()}`,
                    currentGameCode: code
                }
                let readerMap = room.gameObj?.readerMap
                if (readerMap) {
                    payload.readerOrder = readerMap
                }
                Sockets.sendToRoomByCode(code, 'gameRender', payload)
            }, GAME_START_WAIT)
        }
    } else {
        socket.emit('avatarSubmissionFailed', {})
    }
}

module.exports = { handle }
