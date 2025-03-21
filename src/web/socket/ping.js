/**
 * Keep alive.
 */

const pingManager = require('../pingManager')

function handle(message, socket, id) {
    // TODO Do we need ping? How can it help?

    if (id) {
        pingManager.ping(id)
    }
}

module.exports = { handle }
