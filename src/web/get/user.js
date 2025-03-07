/*
GET: /api/username

Get user information of logged in user
*/
const { isAdmin } = require('../../db/tables/users')
require('dotenv').config()

module.exports = function (req, res) {
    res.send({
        displayName: req.user.displayName,
        email: req.user.email,
        isAdmin: isAdmin(req.user.id)
    })
}
