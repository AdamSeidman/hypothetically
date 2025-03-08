/*
POST: /api/whose

Submit new "whose" information
*/

const database = require('../../db/database')

module.exports = function (req, res) {
    database.questions.add(req.body?.question, req.user.email)
    res.redirect('/admin?tab=QuestionTab')
}