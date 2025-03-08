/*
POST: /api/displayName

Update user's displayName
*/

const database = require('../../db/database')

module.exports = async function (req, res) {
    let err = await database.users.setDisplayName(req.user.id, req.body?.name)
    return err? 500 : 200
}