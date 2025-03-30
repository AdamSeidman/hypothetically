function standardREQUEST(ep, query, options) {
    return new Promise((resolve, reject) => {
        try {
            let err = false
            fetch(`/api/${ep}${(typeof query !== 'undefined')? '?' : ''}${[(query || [])].flat().join('&')}`, options)
                .then(data => {
                    err = !data.ok
                    return data.json()
                })
                .then(json => {
                    if (err) {
                        reject(json)
                    } else {
                        resolve(json)
                    }
                })
                .catch(err => reject(err))
        } catch (error) {
            reject(error)
        }
    })
}

function standardGET(ep, query='') {
    return standardREQUEST(ep, query)
}

function standardVERB(ep, verb, data) {
    const requestOptions = {
        method: verb,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
    return standardREQUEST(ep, undefined, requestOptions)
}

function standardPUT(ep, data) {
    return standardVERB(ep, 'PUT', data)
}

function standardPOST(ep, data) {
    return standardVERB(ep, 'POST', data)
}

function standardDELETE(ep, data) {
    return standardVERB(ep, 'DELETE', data)
}

function getUserInfo() {
    return standardGET('user')
}

function updateDisplayName(name) {
    return standardPUT('displayName', { name })
}

function makeRoom(isPublic) {
    isPublic = !!isPublic
    return standardPOST('room', { isPublic })
}

function postTab(id, title, type) {
    let fail = [id, title, type].find(x => typeof x !== 'string')
    if (fail) {
        console.error('Could not submit new tab!')
        console.group({ id, title, type })
        return
    }
    return standardPOST('tab', { video_id: id, title, type })
}

function getPublicGames() {
    return standardGET('publicGames')
}

function getCurrentRoom() {
    return standardGET('currentRoom')
}

function getGameResults() {
    return standardGET('gameResults')
}

function joinGame(code) {
    return standardPUT('joinGame', { code })
}

function kickPlayer(code, kickId) {
    return standardPUT('kickPlayer', { code, kickId })
}

async function callbackAndNavigate(cb, url='/') {
    await new Promise((resolve) => {
        cb()
        setTimeout(() => resolve(), 1)
    })
    setTimeout(() => {
        window.location.href = url
    }, 1)
}

async function alertAndNavigate(text, url) {
    await callbackAndNavigate(() => alert(text), url)
}

function renderPartial(partial, contentId='partial-content') {
    fetch(`/partials/${partial}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById(contentId).innerHTML = data
        })
        .catch(err => {
            console.error('Failed to render partial!', err)
        })
}

function randomArrayItem(arr) {
    if (arr === undefined || !Array.isArray(arr) || arr.length <= 1) {
        return
    }
    return arr[Math.floor(Math.random() * arr.length)]
}

function keyWrapper(evt, fn) {
    if (evt.keyCode == 13) {
        fn()
        return false
    }
    return true
}
