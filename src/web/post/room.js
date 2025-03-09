/*
POST: /api/room

Make new game room
*/

const Games = require('../../game/gameManager')
const { joinRoom } = require('../sockets')

module.exports = function (req, res) {
    let code = Games.makeRoom(req.user.id, req.body.isPublic)
    joinRoom(req.user.id, code)
    console.log(`User ${req.user.id} created room ${code}`)
    return { code }
}
