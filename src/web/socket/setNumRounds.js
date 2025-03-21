/**
 * Handle setting number of game rounds via WebSocket
 */

const Games = require('../../game/gameManager')

let Sockets = undefined

function handle(message, socket, id) {
    let ret = Games.setNumRounds(message?.numRounds, id)
    if (ret) {
        if (!Sockets) {
            Sockets = require('../sockets')
        }
        Sockets.sendToRoomById(id, 'numRoundsChanged', {
            numRounds: message.numRounds,
            id
        })
        console.log(`Number of rounds of room ${ret} set to ${message.numRounds}`)
    } else {
        console.warn(`Number of rounds set failure by (${id})`, message)
    }
}

module.exports = { handle }
