/*
POST: /api/category

Submit new "category" information
*/

const database = require('../../db/database')
const { isAdmin } = require('../../db/tables/users')

module.exports = function (req, res) {
    if (isAdmin(req.user?.id)) {
        database.categories.add(req.body, req.user.email)
    }
    res.redirect('/admin?tab=CategoryTab')
}
