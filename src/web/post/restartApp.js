/*
POST: /api/restartApp

Restart application
*/

const logger = require('../../monitor/log')
const { isOwner } = require('../../db/tables/users')

module.exports = function (req, res) {
    let ret = 401
    if (isOwner(req.user.id)) {
        ret = 202
        logger.log('Scheduling app shutdown/restart!')
        console.log('================================')
        setTimeout(() => {
            process.exit(0)
        }, 2000)
    }
    return ret
}
