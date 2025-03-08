/*
POST: /api/category

Submit new "category" information
*/

const database = require('../../db/database')

module.exports = function (req, res) {
    database.categories.add(req.body, req.user.email)
    res.redirect('/admin?tab=CategoryTab')
}
