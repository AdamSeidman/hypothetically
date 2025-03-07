/*
GET: /api/username

Get user information of logged in user
*/
require('dotenv').config()

module.exports = function (req, res) {
    res.send({
        displayName: req.user.displayName,
        email: req.user.email,
        isAdmin: process.env.SITE_ADMINS.includes(req.user.email)
    })
}
