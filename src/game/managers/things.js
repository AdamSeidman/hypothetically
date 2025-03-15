/**
 * Manager of the Things game
 */

const utils = require('../utils')
const database = require('../../db/database')
const Avatars = require('../../../www/assets/img/characters')
const { getDisplayName } = require('../../db/tables/users')

const states = {
    0: 'start',
    1: 'read',
    2: 'guess'
}
const numStates = 3

class Game {
    #reader = 0
    #guesser = 1
    #stateKey = 0
    #readers = []
    #guessesLeft = []

    constructor(game) {
        this.game = game
        this.idx = 0
        this.prompts = []
        this.round = 1
        this.answerMap = {}
        this.code = game.code
        this.guessStache = {}
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
            this.#guesser = this.#reader + 1
            this.answerMap = {}
            this.#guessesLeft = []
            if (this.#reader >= this.#readers.length) {
                this.#reader = 0
                this.#guesser = 1
                this.round += 1
            }
            if (this.#guesser >= this.#readers.length) {
                this.#guesser = 0
            }
            this.#nextPrompt()
        }
        return this.currentState
    }

    get reader() {
        return this.#readers[this.#reader || 0]
    }

    submitAnswer(id, answer) {
        this.answerMap[id] = answer.replaceAll('"', "'")
        if (!this.#guessesLeft.includes(id)) {
            this.#guessesLeft.push(id)
        }
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

    get guesser() {
        return this.#readers[this.#guesser || 0]
    }

    nextGuesser() {
        this.#guesser = (this.#guesser + 1) % this.#readers.length
        return this.guesser
    }

    get currentAvatars() {
        let ids = utils.shuffleArray(JSON.parse(JSON.stringify(this.#guessesLeft)))
        return ids.map((id, n) => {
            let avatarItems = this.game.avatarMap[id]?.split('|') || ['', '']
            let ret = {
                characterAsset: Avatars.characterAssetsBase64[avatarItems[0]],
                backgroundAsset: Avatars.backgroundAssetsBase64[avatarItems[1]],
                name: getDisplayName(id),
                prev: n,
                next: n + 2,
                id
            }
            if (n === 0) {
                ret.prev = ids.length
            } else if (n === (ids.length - 1)) {
                ret.next = 1
            }
            return ret
        })
    }

    get currentGuesses() {
        let ids = utils.shuffleArray(JSON.parse(JSON.stringify(this.#guessesLeft)))
        return ids.map((id, n) => {
            let ret = {
                text: this.answerMap[id],
                prev: n,
                next: n + 2
            }
            if (n === 0) {
                ret.prev = ids.length
            } else if (n === (ids.length - 1)) {
                ret.next = 1
            }
            return ret
        })
    }

    guess(guesserId, guessId, answerText) {
        this.guessStache = {
            guesserId, guessId, answerText,
            correct: false
        }
        if (guessId && answerText && this.#guessesLeft.includes(guessId) && 
                this.guesser == guesserId && this.answerMap[guessId].trim() === answerText.trim()) {
            this.guessStache.correct = true
            this.#guessesLeft = this.#guessesLeft.filter(x => x !== guessId)
        }
        return this.guessStache.correct
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
