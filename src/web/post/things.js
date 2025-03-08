/*
POST: /api/things

Submit new "Things" information
*/

const database = require('../../db/database')

module.exports = function (req, res) {
    database.things.add(req.body?.thing, req.user.email)
    res.redirect('/admin?tab=ThingsTab')
}