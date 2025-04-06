/**
 * Manager of Ten Tabs
 */

const utils = require('../utils')
const database = require('../../db/database')

const states = {
    0: 'start',
    1: 'play',
    2: 'postGame'
}
const numStates = 2
let Sockets = undefined

class Game {
    #stateKey = 0

    constructor(game) {
        if (Sockets === undefined) {
            Sockets = require('../../web/sockets')
        }
        this.game = game
        this.code = game.code
        this.timestamp = null
        this.loadedMap = {}
        this.game.players.forEach((id) => {
            this.loadedMap[id] = false
        })
        this.numPlayersLoaded = 0
        this._ids = []
        async function loadGame(game) {
            let all = await database.tabs.getAll()
            all = utils.shuffleArray(all)
            let effects = all.filter(x => x.type === 'effect')
            let general = all.filter(x => x.type === 'other')
            let music = all.filter(x => x.type === 'music')
            game._ids = [...effects.slice(0, 5), ...general.slice(0, 3), ...music.slice(0, 2)]
            game._ids = utils.shuffleArray(game._ids.map(x => x.video_id))
        }
        loadGame(this)
    }
    
    get currentState() {
        return states[this.#stateKey || '0']
    }

    nextState() {
        this.#stateKey += 1
        if (this.#stateKey >= numStates) {
            this.#stateKey = 0
        }
        return this.currentState
    }

    get videoIds() {
        return JSON.parse(JSON.stringify(this._ids))
    }

    tabsLoaded(id='.') {
        if (!this.game.players.includes(id)) return
        if (!this.loadedMap[id]) {
            this.numPlayersLoaded += 1
        }
        this.loadedMap[id] = true
        if (this.numPlayersLoaded >= this.game.players.length) {
            return {
                id,
                code: this.code,
                map: this.loadedMap,
                timestamp: this.timestamp
            }
        }
    }
}

function make(game) {
    if (typeof game !== 'object') return
    return new Game(game)
}

module.exports = {
    make,
    states,
    numStates
}
