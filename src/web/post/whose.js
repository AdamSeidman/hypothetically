/*
POST: /api/whose

Submit new "whose" information
*/

const database = require('../../db/database')
const { isAdmin } = require('../../db/tables/users')

module.exports = function (req, res) {
    if (isAdmin(req.user?.id)) {
        database.questions.add(req.body?.question, req.user.email)
    }
    res.redirect('/admin?tab=QuestionTab')
}
