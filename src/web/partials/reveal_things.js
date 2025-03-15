/**
 * Reveal answers for Things game
 */

// const Games = require('../../game/gameManager')
// const { shuffleArray } = require('../../game/utils')
// const { getDisplayName } = require('../../db/tables/users')

function get(req) {
    console.log('reveal_things', req?.user?.id) // TODO
    return {}
}

module.exports = { get }
