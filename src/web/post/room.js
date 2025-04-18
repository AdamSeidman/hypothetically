/*
POST: /api/room

Make new game room
*/

const Games = require('../../game/gameManager')
const logger = require('../../monitor/log')
const { joinRoom } = require('../sockets')

module.exports = function (req, res) {
    let code = Games.makeRoom(req.user.id, req.body.isPublic)
    if (code) {
        joinRoom(req.user.id, code)
        logger.log(`User ${req.user.id} created room ${code}`)
        return { code }
    }
    return 400
}
