document.title = 'Ten Tabs'

let apiLoaded = false
let players = []
let tabIds = []
let readyCount = 0

function loadTabs() {
    $('#player-display').toggleClass('hidden', true)
    getTabs()
        .then(({ ids }) => {
            if (!Array.isArray(ids) || ids.length < 10 || typeof ids[0] !== 'string') {
                alert('Bad game issued from server!')
                return
            }
            tabIds = ids

            var tag = document.createElement('script')
            tag.src = 'https://youtube.com/iframe_api'
            var firstScriptTag = document.getElementsByTagName('script')[0]
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        })
        .catch((err) => {
            console.error('Error fetching tabs!', err)
            alert('Error fetching tabs!')
        })
}

function newAvatarCallback(numChosen, totalPlayers) {
    if (numChosen === totalPlayers) {
        setTimeout(loadTabs, 100)
    }
}
function avatarSuccessCallback(numChosen, totalPlayers) {
    if (numChosen === totalPlayers) {
        setTimeout(loadTabs, 100)
    }
}

$(document).ready(() => {
    $('#app').append(`
        <div id="players" style="display:none;">
            ${[...Array(10).keys()].map(id => `
                <div id="player${id}"></div>
            `).join('')}
        </div>
    `)
})

function onPlayerStateChange(event) {
    if (event.data === 0) {
        event.target.playVideo()
        event.target.mute()
    }
}

function onPlayerReady(event) {
    event.target.seekTo(Math.floor(event.target.getDuration() * Math.random()))
    if (++readyCount === 10) {
        allTabsLoaded()
    }
}

function allTabsLoaded() {
    // TODO This is a dummy version of two socket calls
    setTimeout(() => {
        onStartTabs()
    }, 1000)
}

function onStartTabs() {
    setTimeout(() => {
        players.forEach(player => {
            player.playVideo()
            player.mute()
        })
    }, 1000)
}

function onYouTubeIframeAPIReady() {
    if (apiLoaded) {
        console.warn('YouTube API loaded twice!')
        return
    }
    apiLoaded = true
    while (players.length < 10) {
        players.push(new YT.Player(`player${players.length}`, {
            videoId: tabIds[players.length],
            events: {
                onStateChange: onPlayerStateChange,
                onReady: onPlayerReady
            }
        }))
    }
}
