/*
POST: /api/restartApp

Restart application
*/

const { isOwner } = require('../../db/tables/users')

module.exports = function (req, res) {
    let ret = 401
    if (isOwner(req.user.id)) {
        ret = 202
        console.log('Scheduling app shutdown/restart!')
        console.log('================================')
        setTimeout(() => {
            process.exit(0)
        }, 2000)
    }
    return ret
}
