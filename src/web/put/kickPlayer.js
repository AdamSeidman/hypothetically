/**
 * Join a game via HTTP
 */

const Sockets = require('../sockets')
const Games = require('../../game/gameManager')

module.exports = async function (req, res) {
    if (!req.user?.id) return 500
    if (!req.body?.kickId || !req.body?.code) return 400
    let ret = Games.kickPlayer(req.user.id, req.body.kickId, req.body.code)
    if (!ret) return 400
    if (Sockets.kickFromRoom(req.body.kickId, req.body.code)) {
        return 200
    }
    return 500
}
