/*
POST: /api/tab

Submit new information for ten tabs
*/

const database = require('../../db/database')
const { isAdmin } = require('../../db/tables/users')

module.exports = async function (req, res) {
    if (isAdmin(req.user?.id) && req.body?.video_id) {
        let err = await database.tabs.add(req.body.video_id, req.body.title, req.body.type, req.user.email)
        return err? 400 : 202
    }
    return 401
}
