let youtubeLoaded = false
let currentTabValid = false
let youtubePlayer = undefined

function modifyDescription(text) {
    $('.input-copy').text(text)
}

function openTab(evt, tabName) {
    $('.input-copy').text('')
    $('.tab-content').hide()
    $('.tab-button').removeClass('active')
    $('#' + tabName).show()
    $(evt.currentTarget).addClass('active')

    let params = new URLSearchParams(window.location.search)
    params.set('tab', tabName)
    history.replaceState(null, '', '?' + params.toString())

    if (tabName === 'TabsTab' && !youtubeLoaded) {
        youtubeLoaded = true
        loadYoutubeApi()
    }
}

function loadYoutubeApi() {
    var tag = document.createElement('script')
    tag.src = 'https://youtube.com/iframe_api'
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
}

function isAlphaNumeric(str) {
    var code, i, len, ch;
    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        ch = str.charAt(i);
        if (!(code > 47 && code < 58) &&
            !(code > 64 && code < 91) &&
            !(code > 96 && code < 123) &&
            (ch !== '-') &&
            (ch !== '_')) {
            return false;
        }
    }
    return true;
}

function setTabsSubmitButton(enabled) {
    if ($('#tabs-type').val()?.trim().length < 1) {
        enabled = false
    }
    $('#tabs-submit-btn').attr('disabled', !enabled)
}

function getIdFromYoutubeUrl(link) {
    if (typeof link !== 'string' || link.trim().length < 2) return
    link = link.trim().replace(/\\/g, '/')
    if (link.length === 11 && isAlphaNumeric(link)) return link
    const valid = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/
    if (!valid.test(link)) return
    let str = link.slice(link.lastIndexOf('/') + 1)
    if (str.includes('feature')) {
        str = str.slice(0, str.indexOf('feature') - 1)
    }
    if (str.includes('?fs=')) {
        str = str.slice(0, str.indexOf('?'))
    }
    if (str.includes('?v=')) {
        str = str.slice(str.indexOf('?v=') + 3)
    }
    if (str.includes('?')) {
        str = str.substring(0, str.indexOf('?'))
    }
    str = str.trim()
    if (str.length !== 11 || !isAlphaNumeric(str)) {
        if (str.length > 11 && str.includes('&')) {
            str = str.slice(0, str.indexOf('&')).trim()
            if (str.length === 11 && isAlphaNumeric(str)) {
                return str
            }
            else return
        }
        else return
    }
    return str
}

function onYouTubeIframeAPIReady() {
    if (youtubePlayer) return
    youtubePlayer = new YT.Player('player0', {
        videoId: 'f8mL0_4GeV0'
    })
}

function getFilledVideoDetails() {
    setTabsSubmitButton(false)
    return new Promise((resolve, reject) => {
        if (!youtubePlayer) {
            reject('Issue with youtube validator!')
            return
        }
        let tag = getIdFromYoutubeUrl($('#tabUrl').val())
        if (!tag) {
            reject()
            return
        }
        youtubePlayer.loadVideoById(tag)
        youtubePlayer.mute(tag)
        let timeoutCount = 50
        let intervalId = setInterval(() => {
            let state = null
            try {
                state = youtubePlayer.getPlayerState()
            } catch (_) {}
            if (Math.abs(state || 3) === 1) {
                youtubePlayer.pauseVideo()
                clearInterval(intervalId)
                resolve({
                    title: (youtubePlayer.videoTitle || ""),
                    tag
                })
            } else if (timeoutCount-- <= 0) {
                clearInterval(intervalId)
                reject('Could not load video!')
            }
        }, 100)
    })
}

function fillTitle() {
    setTabsSubmitButton(false)
    getFilledVideoDetails()
        .then(({ title }) => {
            title = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^\p{Script=Latin}\p{Punctuation}\p{Number}\p{Zs}]/gu, '').trim()
            $('#tabTitle').val(title)
            if (title.length > 1) {
                setTabsSubmitButton(true)
            }
        })
        .catch((err) => {
            if (err) {
                alert(err)
            } else {
                $('#tabTitle').shake()
            }
        })
}

function isTabSubmissionValid(shake=true) {
    return ['#tabUrl', '#tabTitle'].find((id) => {
        if ($(id).val().trim().length < 1) {
            if (shake) {
                $(id).shake()
            }
            return true
        }
    })
}

function checkTabsSubmission(successCb, shake=true) {
    setTabsSubmitButton(false)
    if (isTabSubmissionValid(shake)) return
    getFilledVideoDetails()
        .then((ret) => {
            if (ret) {
                if (typeof successCb === 'function') {
                    successCb(ret)
                } else {
                    setTabsSubmitButton(true)
                }
            } else {
                throw new Error()
            }
        })
        .catch((err) => {
            if (err) {
                alert(err)
            } else if (shake) {
                $('#tabs-submit-btn').shake()
            }
        })
}

function checkTabsTitleLength(title) {
    if (title?.trim().length < 2) {
        setTabsSubmitButton(false)
    }
}

function submitTabs() {
    let type = $('#tabs-type').val()?.trim() || ""
    if (type.length < 1) {
        $('#tabs-submit-btn').attr('disabled', true)
        return
    }
    checkTabsSubmission(({ tag, title }) => {
        if (!tag || !title) return
        postTab(tag, title, type)
            .then(() => {
                $('#tabUrl').val('')
                $('#tabTitle').val('')
                $('#tabs-type').val('')
                setTimeout(() => {
                    alert('Submitted!')
                }, 100)
            })
            .catch((err) => {
                console.error('Could not submit tab!', err)
                alert('Error on submission!')
            })
    })
}

$(document).ready(() => {
    let params = new URLSearchParams(window.location.search)
    let tabName = params.get('tab') || 'CategoryTab'
    openTab({ currentTarget: `#tab-${tabName}` }, tabName)
    $('#tabs-type').change(() => {
        if (youtubePlayer && youtubeLoaded) {
            setTimeout(() => {
                checkTabsSubmission(null, false)
            }, 1)
            $('#tabs-type-default').remove()
        }
    })
})
