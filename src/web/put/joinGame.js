/**
 * Join a game via HTTP
 */

const Sockets = require('../sockets')
const logger = require('../../monitor/log')
const Games = require('../../game/gameManager')
const { getDisplayName } = require('../../db/tables/users')

module.exports = async function (req, res) {
    if (!req.body?.code || !req.user?.id) return 400
    let rooms = Games.getAllRooms()
    if (!Object.keys(rooms).includes(req.body.code)) {
        return 400
    }
    let ret = Games.addToRoom(req.user.id, req.body.code)
    if (ret.midGame) {
        logger.log(`User ${req.user.id} joined ${req.body.code} mid-game.`)
        ret.id = req.user.id
        ret.displayName = getDisplayName(req.user.id)
        Sockets.sendToRoomByCode(req.body.code, 'midGameJoin', ret)
        return 503
    } else if (ret.failReason) {
        logger.log(`User ${req.user.id} could not join ${req.body.code}`)
        return {
            code: 400,
            err: ret.failReason
        }
    } else if (ret) {
        logger.log(`User ${req.user.id} joined room ${req.body.code}`)
        Sockets.sendToRoomByCode(req.body.code, 'joinRoom', {
            id: req.user.id,
            displayName: getDisplayName(req.user.id) || 'Unknown User'
        })
        return 200
    }
    return 500
}
