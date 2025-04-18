/**
 * Start the game with WebSockets
 */

const logger = require('../../monitor/log')
const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    let rooms = Games.getAllRooms()
    if (!Sockets) {
        Sockets = require('../sockets')
    }
    if (Object.keys(rooms).includes(message?.code || '?')) {
        let ret = Games.startGame(id, message.code)
        if (ret.failReason) {
            logger.error(`User ${id} failed to start game`, message)
            socket.emit('startGameFailed', { code: message.code, reason: ret.failReason })
        } else if (ret) {
            logger.info(`User ${id} started game with ${message.code}`)
            Sockets.sendToRoom(socket, 'gameStarted', ret, true)
        }
    } else {
        socket.emit('startGameFailed', { code: message.code })
    }
}

module.exports = { handle }
