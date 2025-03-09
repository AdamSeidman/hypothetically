/**
 * Utilities used in game code
 */

const ROOM_CODE_LENGTH = 6
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
    }
}
