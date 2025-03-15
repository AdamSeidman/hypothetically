/**
 * Utilities used in game code
 */

const ROOM_CODE_LENGTH = 7
const BANNED_ROOM_CODE_LETTERS = ['I', 'L', 'K']

module.exports = {
    generateRoomCode: () => {
        let result = ''
        for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
            let char = BANNED_ROOM_CODE_LETTERS[0]
            while (BANNED_ROOM_CODE_LETTERS.includes(char)) {
                char = String.fromCharCode(65 + Math.floor(Math.random() * 26))
            }
            result += char
        }
        return result
    },
    shuffleArray: (arr) => {
        if (!Array.isArray(arr) || arr.length < 2) return arr
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr
    }
}
