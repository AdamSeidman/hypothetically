/*
GET: /api/gameResults

Get game results
*/

const Games = require('../../game/gameManager')

module.exports = function (req, res) {
    let code = Games.getGameCodeOf(req?.user?.id)
    res.send({
        results: Games.getResultsOf(code),
        code
    })
}
