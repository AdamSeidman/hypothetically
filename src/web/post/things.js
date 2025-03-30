/*
POST: /api/things

Submit new "Things" information
*/

const database = require('../../db/database')
const { isAdmin } = require('../../db/tables/users')

module.exports = function (req, res) {
    if (isAdmin(req.user?.id)) {
        database.things.add(req.body?.thing, req.user.email)
    }
    res.redirect('/admin?tab=ThingsTab')
}
