document.title = 'Ten Tabs'

let apiLoaded = false
let players = []
let tabIds = []
let readyCount = 0

$(document).ready(() => {
    $('#app').append(`
        <div id="players" style="adisplay:none;">
            ${[...Array(10).keys()].map(id => `
                <div id="player${id}"></div>
            `).join('')}
        </div>
    `)
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
})

function getTabs() {
    // TODO This is a dummy version of a server call
    return new Promise((resolve, reject) => {
        resolve({
            ids: ['f8mL0_4GeV0', 'f8mL0_4GeV0', 'f8mL0_4GeV0', 'f8mL0_4GeV0', 'f8mL0_4GeV0',
                'f8mL0_4GeV0', 'f8mL0_4GeV0', 'f8mL0_4GeV0', 'f8mL0_4GeV0', 'f8mL0_4GeV0', 'f8mL0_4GeV0']
        })
    })
}

function onPlayerStateChange(event) {
    if (event.data === 0) {
        event.target.playVideo()
    }
}

function onPlayerReady(event) {
    event.target.seekTo(event.target.getDuration() / 2)
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
        players.forEach(player => player.playVideo())
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
