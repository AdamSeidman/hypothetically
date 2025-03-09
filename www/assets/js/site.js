function standardREQUEST(ep, query, options) {
    return new Promise((resolve, reject) => {
        try {
            fetch(`/api/${ep}${(typeof query !== 'undefined')? '?' : ''}${[(query || [])].flat().join('&')}`, options)
                .then(data => {
                    if (data.ok) {
                        return data.json()
                    }
                    reject(data)
                })
                .then(json => resolve(json))
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

function getPublicGames() {
    return standardGET('publicGames')
}

function getCurrentRoom() {
    return standardGET('currentRoom')
}

function joinGame(code) {
    return standardPUT('joinGame', { code })
}
