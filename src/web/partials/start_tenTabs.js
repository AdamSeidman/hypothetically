/**
 * Start the game of tabs
 */
 
const Games = require('../../game/gameManager')
const Avatars = require('../../../www/assets/img/characters')
const TabAssets = require('../../../www/assets/img/results')

const mockData = { // TODO Replace with real data
    players: [
        {
            id: 1,
            name: 'Adam',
            backgroundAsset: Avatars.backgroundAssetsBase64.Green,
            characterAsset: Avatars.characterAssetsBase64.Gracie,
            coverAsset: Avatars.characterAssetsBase64.Gracie,
        },
        {
            id: 2,
            name: 'Krasne',
            backgroundAsset: Avatars.backgroundAssetsBase64.Purple,
            characterAsset: Avatars.characterAssetsBase64.Raccoon,
            coverAsset: Avatars.characterAssetsBase64.Raccoon,
        }
    ]
}

function get(req) {
    let ret = {
        backgroundAsset: TabAssets.mainBackgroundAssetBase64,
        unguessedAsset: TabAssets.resultAssetsBase64.unguessed,
        transparentAsset: Avatars.transparentAssetBase64,
        numberAssets: TabAssets.numberAssetsBase64,
        players: []
    }
    let room = Games.getRoomByPlayerId(req.user?.id)
    if (!room) {
        return ret
    }
    ret.players = mockData.players
    return ret
}

module.exports = { get }
