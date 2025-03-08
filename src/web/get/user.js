/*
GET: /api/username

Get user information of logged in user
*/
const { isAdmin, getDisplayName } = require('../../db/tables/users')
require('dotenv').config()

module.exports = function (req, res) {
    res.send({
        name: req.user.displayName,
        displayName: getDisplayName(req.user.id) || req.user.displayName,
        email: req.user.email,
        isAdmin: isAdmin(req.user.id) || false,
        photo: req.user.photo || ''
    })
}
