/**
 * Join a game via HTTP
 */

const Sockets = require('../sockets')
const Games = require('../../game/gameManager')
const { getDisplayName } = require('../../db/tables/users')

module.exports = async function (req, res) {
    if (!req.body?.code) return 400
    let rooms = Games.getAllRooms()
    if (!Object.keys(rooms).includes(req.body.code)) {
        return 400
    }
    let ret = Games.addToRoom(req.user.id, req.body.code)
    if (ret.failReason) {
        console.log(`User ${req.user.id} could not join ${req.body.code}`)
        return {
            code: 400,
            err: ret.failReason
        }
    } else if (ret) {
        console.log(`User ${req.user.id} joined room ${req.body.code}`)
        Sockets.sendToRoomByCode(req.body.code, 'joinRoom', {
            id: req.user.id,
            displayName: getDisplayName(req.user.id) || 'Unknown User'
        })
        return 200
    }
    return 500
}
