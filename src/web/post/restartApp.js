/*
POST: /api/restartApp

Restart application
*/

const { isAdmin } = require('../../db/tables/users')

module.exports = function (req, res) {
    let ret = 401
    if (isAdmin(req.user.id)) {
        ret = 202
        console.log('Scheduling app shutdown/restart!')
        console.log('================================')
        setTimeout(() => {
            process.exit(0)
        }, 2000)
    }
    return ret
}
