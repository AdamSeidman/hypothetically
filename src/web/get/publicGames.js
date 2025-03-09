/*
GET: /api/publicGames

Get public game lobies
*/

const Games = require('../../game/gameManager')

module.exports = function (req, res) {
    res.send({
        games: Games.getPublicGames()
    })
}
