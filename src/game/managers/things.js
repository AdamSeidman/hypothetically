/**
 * Manager of the Things game
 */

const utils = require('../utils')
const database = require('../../db/database')
const { getDisplayName } = require('../../db/tables/users')
const Avatars = require('../../../www/assets/img/characters')

const states = {
    0: 'start',
    1: 'read',
    2: 'guess',
    3: 'reveal',
    4: 'postGame'
}
const numStates = 4
let Sockets = undefined

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
        this.guessStash = {}
        async function loadPrompts(game) {
            game.prompts = await database.things.getAllThings() || []
            game.prompts = utils.shuffleArray(game.prompts)
        }
        loadPrompts(this)
        this.#readers = utils.shuffleArray(JSON.parse(JSON.stringify(this.game.players)))
        this.scoreMap = {}
        this.#readers.forEach(id => this.scoreMap[id] = 0)
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

    submitAnswer(id, answer, socket) {
        this.answerMap[id] = answer.replaceAll('"', "'")
        if (!this.#guessesLeft.includes(id)) {
            this.#guessesLeft.push(id)
        }
        if (Sockets === undefined) {
            Sockets = require('../../web/sockets')
        }
        let allAnswersIn = Object.keys(this.answerMap).length === this.#readers.length
        if (allAnswersIn && states[this.#stateKey] === 'start') {
            this.nextState()
        }
        if (socket) {
            socket.emit('answerAccepted', { answer })
        }
        Sockets.sendToRoomByCode(this.code, 'thingSubmitted', { id })
        if (allAnswersIn) {
            setTimeout(() => {
                Sockets.sendToRoomByCode(this.code, 'gameRender', {
                    currentGamePage: 'read_things',
                    currentGameCode: this.code
                }, 1000)
            })
        }
    }

    doneReading() {
        if (states[this.#stateKey] === 'read') {
            let state = this.nextState()
            if (state) {
                setTimeout(() => {
                    if (Sockets === undefined) {
                        Sockets = require('../../web/sockets')
                    }
                    Sockets.sendToRoomByCode(this.code, 'gameRender', {
                        currentGamePage: 'guess_things',
                        currentGameCode: this.code
                    })
                }, 200)
            }
        }
    }

    get guesser() {
        return this.#readers[this.#guesser || 0]
    }

    nextGuesser() {
        this.#guesser = (this.#guesser + 1) % this.#readers.length
        return this.guesser
    }

    getCurrentAvatars(idToFilter) {
        let ids = utils.shuffleArray(JSON.parse(JSON.stringify(this.#guessesLeft)))
        if (idToFilter && ids.length > 1) {
            ids = ids.filter(x => x !== idToFilter)
        }
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
        this.guessStash = {
            guesserId, guessId, answerText,
            correct: false
        }
        if (answerText?.trim) {
            answerText = answerText.trim()
        }
        if (guessId && answerText && this.#guessesLeft.includes(guessId) && 
                this.guesser == guesserId && this.answerMap[guessId].trim() === answerText) {
            this.guessStash.correct = true
            this.scoreMap[guesserId] += 1
            this.#guessesLeft = this.#guessesLeft.filter(x => x !== guessId)
        }
        this.nextState()
        setTimeout(() => {
            let payload = {
                currentGamePage: 'reveal_things',
                currentGameCode: this.code,
                scoreUpdate: this.scoreMap,
                roundNumber: this.round
            }
            if (this.guessStash.correct) {
                payload.iconChange = {
                    id: guessId
                }
            }
            if (Sockets === undefined) {
                Sockets = require('../../web/sockets')
            }
            Sockets.sendToRoomByCode(this.code, 'gameRender', payload)
            setTimeout(() => {
                if (states[this.#stateKey].includes('reveal')) {
                    this.roundFinished(this.game?.players[0])
                }
            }, (30 * 1000))
        }, 100)
        return this.guessStash.correct
    }

    roundFinished(id) {
        if (!this.game.players.includes(id)) return
        if (states[this.#stateKey] !== 'reveal') return
        if (Sockets === undefined) {
            Sockets = require('../../web/sockets')
        }
        if (this.#guessesLeft.length > 1) {
            this.#guesser += 1
            if (this.#guesser >= this.#readers.length) {
                this.#guesser = 0
            }
            this.#stateKey -= 1
        } else if (this.round >= this.game.numRounds) {
            if (this.#guessesLeft.length > 0) {
                this.scoreMap[this.#guessesLeft[0]] += 2
            }
            console.log(`Game ${this.code} finished ${this.round} rounds. Sending to results...`)
            this.#stateKey += 1
            this.game.inGame = false
            this.game.joinable = true
            Sockets.sendToRoomByCode(this.code, 'goToResults', {
                timeout: 1000
            })
            return
        } else {
            if (this.#guessesLeft.length > 0) {
                this.scoreMap[this.#guessesLeft[0]] += 2
            }
            this.nextState()
        }
        setTimeout(() => {
            let payload = {
                currentGamePage: `${this.currentState}_things`,
                currentGameCode: this.code,
                scoreUpdate: this.scoreMap
            }
            if (states[this.#stateKey].toLowerCase().includes('start')) {
                payload.iconChange = {
                    clear: true
                }
                payload.roundNumber = ++this.round
            }
            Sockets.sendToRoomByCode(this.code, 'gameRender', payload)
        })
    }

    get readerMap() {
        let ret = {}
        this.#readers.forEach((id, n) => {
            ret[id] = n
        })
        return ret
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
