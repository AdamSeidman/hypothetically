function getResults() {
    return new Promise((resolve) => { // Dummy Function
        resolve({
            123: {
                score: 1,
                avatar: 'Dusty|Purple',
                name: 'test'
            },
            234: {
                score: 2,
                avatar: 'DSF|Yellow',
                name: 'test'
            },
            345: {
                score: 3,
                avatar: 'Champ|Pink',
                name: 'test'
            },
            456: {
                score: 4,
                avatar: 'Molly|Red',
                name: 'test'
            },
            567: {
                score: 10,
                avatar: 'Ozzy|Blue',
                name: 'test'
            },
            678: {
                score: 20,
                avatar: 'Gracie|Green',
                name: 'test'
            },
            789: {
                score: 0,
                avatar: 'Unicorn|Blue',
                name: 'test'
            }
        })
    })
}

function getAvatars(avatarText) {
    if (typeof avatarText !== 'string' || !avatarText.includes('|')) {
        return [unknownAssetBase64, unknownAssetBase64]
    }
    let keys = avatarText.split('|').map(x => x.trim())
    return [characterAssetsBase64[keys[0]] || unknownAssetBase64, backgroundAssetsBase64[keys[1]] || unknownAssetBase64]
}

$(document).ready(() => {
    getResults()
        .then((data) => {
            $('img.selection-image').attr('src', transparentAssetBase64)
            $('.selection-image.hidden').removeClass('hidden')
            let results = Object.values(data).sort((a, b) => b.score - a.score)
            let gold = results.shift()
            let silver = results.shift()
            let bronze = results.shift()
            if (gold) {
                let avatar = getAvatars(gold.avatar)
                $('#character-image-gold').attr('src', avatar[0])
                $('#color-image-gold').attr('src', avatar[1])
                $('#podium-name-gold').text(gold.name || '')
                $('#score-text-gold').text('Score: ' + gold.score)
            }
            if (silver) {
                let avatar = getAvatars(silver.avatar)
                $('#character-image-silver').attr('src', avatar[0])
                $('#color-image-silver').attr('src', avatar[1])
                $('#podium-name-silver').text(silver.name || '')
                $('#score-text-silver').text('Score: ' + silver.score)
            }
            if (bronze) {
                let avatar = getAvatars(bronze.avatar)
                $('#character-image-bronze').attr('src', avatar[0])
                $('#color-image-bronze').attr('src', avatar[1])
                $('#podium-name-bronze').text(bronze.name || '')
                $('#score-text-bronze').text('Score: ' + bronze.score)
            }
            if (results.length) {
                $('#player-display').html(results.map((result) => {
                    let avatar = getAvatars(result.avatar)
                    return `
                    <div class="player-avatar">
                        <img class="player-bkg-image" src="${avatar[1]}">
                        <img class="player-character-image" src="${avatar[0]}">
                        <div class="player-info">
                            <p class="player-name">${result.name}</p>
                            <p class="player-score">Score: ${result.score}</p>
                        </div>
                    </div>
                `}).join(''))
            }
        })
        .catch((err) => {
            alert('Could not get game results from server!')
            console.error('No results.', err)
        })

})
