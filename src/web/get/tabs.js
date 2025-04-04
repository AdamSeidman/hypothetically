/*
GET: /api/tabs

Get tabs for current ten tabs game
*/

const Games = require('../../game/gameManager')

module.exports = function (req, res) {
    let code = Games.getGameCodeOf(req.user?.id)
    let room = Games.getRoomByPlayerId(req.user?.id)
    if (!code || !room || typeof room !== 'object' || !room.gameObj) {
        res.send({ none: true })
        return
    }
    const ids = room.gameObj.videoIds
    if (!Array.isArray(ids)) {
        res.send({ none: true })
        return
    }
    res.send({ ids })
}
