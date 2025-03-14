/*
GET: /api/currentRoom

Get current game lobby
*/

const Games = require('../../game/gameManager')
const { getDisplayName } = require('../../db/tables/users')

module.exports = function (req, res) {
    let code = Games.getGameCodeOf(req.user.id)
    if (!code) {
        res.send({ none: true })
        return
    }
    let ret = {
        code,
        chatHistory: Games.getChatHistory(code),
        players: Games.getPlayersOf(code),
        host: Games.getHostOf(code),
        yourName: getDisplayName(req.user.id),
        none: false,
        id: req.user.id,
        gameType: Games.getGameType(code),
        gameRunning: Games.isGameRunning(code)
    }
    if (ret.gameRunning) {
        ret.avatarData = Games.getAvatarInfo(ret.code)
        let room = Games.getRoomByPlayerId(req.user.id)
        if (room.gameObj) {
            ret.currentPage = room.gameObj.currentState
        }
    }
    ret.isHost = ret.host == req.user.id
    res.send(ret)
}
