/*
POST: /api/cdefaultAvatar

Set user's default avatar.
*/

const database = require('../../db/database')

module.exports = function (req, res) {
    let avatar = req.body?.avatar || ''
    if (!req.user?.id || typeof avatar !== 'string') return 400
    database.users.setDefaultAvatar(req.user.id, avatar)
    return 202
}
