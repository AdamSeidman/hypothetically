/**
 * Give readouts for Things game
 */

function get(req) {
    console.log('guess_things', req?.user?.id)
    return {}
}

module.exports = { get }
