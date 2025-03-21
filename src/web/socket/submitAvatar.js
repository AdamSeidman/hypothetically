/**
 * Start the game with WebSockets
 */

const pingManager = require('../pingManager')
const Games = require('../../game/gameManager')
const Avatars = require('../../../www/assets/img/characters')

let Sockets = undefined

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
        pingManager.clearPings(id)
        socket.emit('avatarSubmissionSuccess', ret)
        Sockets.sendToRoom(socket, 'newAvatar', ret)
        if (ret.totalPlayers && ret.totalPlayers === ret.numAvatarsChosen) {
            Games.moveToGame(id)
        }
    } else {
        socket.emit('avatarSubmissionFailed', {})
    }
}

module.exports = { handle }
