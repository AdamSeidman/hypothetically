function standardGET(ep, query='') {
    return new Promise((resolve, reject) => {
        try {
            fetch(`/api/${ep}${(typeof query !== 'undefined')? '?' : ''}${[(query || [])].flat().join('&')}`)
                .then(data => data.json())
                .then(json => resolve(json))
        } catch (error) {
            reject(error)
        }
    })
}

function getUserInfo() {
    return standardGET('user')
}
