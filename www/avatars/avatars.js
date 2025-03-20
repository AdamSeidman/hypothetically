if (!characterAssetsBase64) {
    alert('Could not find character assets!')
}

let color = randomArrayItem(Object.keys(backgroundAssetsBase64))
let character = randomArrayItem(Object.keys(characterAssetsBase64))

function nextIcon(inc) {
    let characters = Object.keys(characterAssetsBase64)
    let idx = characters.indexOf(character) + inc
    if (idx < 0) {
        idx = characters.length - 1
    } else if (idx >= characters.length) {
        idx = 0
    }
    character = characters[idx]
    $('#character-image').attr('src', characterAssetsBase64[character])
    $('#character-text').text(character)
    localStorage.setItem('character', character)
}

function nextColor(inc) {
    let colors = Object.keys(backgroundAssetsBase64)
    let idx = colors.indexOf(color) + inc
    if (idx < 0) {
        idx = colors.length - 1
    } else if (idx >= colors.length) {
        idx = 0
    }
    color = colors[idx]
    $('#color-image').attr('src', backgroundAssetsBase64[color])
    $('#color-text').text(color)
    localStorage.setItem('color', color)
}

const coverAssets = {
    transparent: transparentAssetBase64,
    selected: selectedAssetBase64,
    eliminated: eliminatedAssetBase64,
    unknown: unknownAssetBase64
}

$(document).ready(() => {
    if (!characterAssetsBase64) return
    $('#cover-image').attr('src', transparentAssetBase64)
    nextIcon(0)
    nextColor(0)
    $('#character-selection').toggleClass('hidden', false)
    $('input[name="avatar-cover"]').click(function() {
        console.log(123)
        let asset = coverAssets[$('input[name="avatar-cover"]:checked').val()]
        console.log(asset)
        $('#cover-image').attr('src', asset)
    })
    getUserInfo().then((data) => $('#submit-link').toggleClass('hidden', !data.isAdmin))
})
