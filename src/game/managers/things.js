/**
 * Manager of the Things game
 */

const utils = require('../utils')
const database = require('../../db/database')

const states = {
    0: 'start',
    1: 'read',
    2: 'guess'
}
const numStates = 3

class Game {
    #reader = 0
    #stateKey = 0
    #readers = []

    constructor(game) {
        this.game = game
        this.idx = 0
        this.prompts = []
        this.round = 1
        this.answerMap = {}
        this.code = game.code
        async function loadPrompts(game) {
            game.prompts = await database.things.getAllThings() || []
            game.prompts = utils.shuffleArray(game.prompts)
        }
        loadPrompts(this)
        this.#readers = utils.shuffleArray(JSON.parse(JSON.stringify(this.game.players)))
    }

    get currentPrompt() {
        return this.prompts[this.idx || 0] || ''
    }

    #nextPrompt() {
        this.idx = (this.idx + 1) % this.prompts.length
        return this.currentPrompt
    }

    get currentState() {
        return states[this.#stateKey || '0']
    }

    nextState() {
        this.#stateKey += 1
        if (this.#stateKey >= numStates) {
            this.#stateKey = 0
            this.#reader += 1
            this.answerMap = {}
            if (this.#reader >= this.#readers.length) {
                this.#reader = 0
                this.round += 1
            }
            this.#nextPrompt()
        }
        return this.currentState
    }

    get reader() {
        return this.#readers[this.#reader || 0]
    }

    submitAnswer(id, answer) {
        this.answerMap[id] = answer
        if (Object.keys(this.answerMap).length === this.#readers.length) {
            if (states[this.#stateKey] === 'start') {
                this.nextState()
            }
            return true
        }
    }

    doneReading() {
        if (states[this.#stateKey] === 'read') {
            return this.nextState()
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
