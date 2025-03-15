document.title = 'Things'

function submit() {
    let text = $('#answer-input').val().trim()
    if (text.length < 1) return
    submitThingsAnswer(text)
    localStorage.setItem('thingsAnswer', text)
}

function answerAcceptedEvent(data) {
    $('#answer-input-container').html('<p id="answer-inputted-text"></p>')
    $('#answer-inputted-text').text(data?.answer || localStorage.getItem('thingsAnswer'))
}

function showReader(idx = 1) {
    if ($('.avatar-option').length > 1) {
        $('.avatar-option').toggleClass('hidden', true)
        $(`#things-avatar-selection-${idx}`).removeClass('hidden')
    }
}

function showAnswer(idx = 1) {
    $('.answer-option').toggleClass('hidden', true)
    $(`#things-answer-selection-${idx}`).removeClass('hidden')
}

function makeGuess() {
    if ($('h3.guess-text').text().trim().length < 2) return
    let characterId = $('.avatar-option').not('.hidden').data('id')
    let answerText = $('.answer-option').not('.hidden').data('text')
    makeThingsGuess(characterId, answerText)
}

function scoreUpdateEvent(data) {
    if (data) {
        Object.entries(data).forEach(([id, score]) => {
            $('#score-' + id).text(score)
        })
    }
}

function iconChangeEvent(data) {
    if (data) {
        if (data.clear) {
            clearSelectionCovers()
        }
        if (data.id) {
            $(`#cover-image-${data.id}`).attr('src', eliminatedAssetBase64)
        }
    }
}

function revealEvent() {
    setTimeout(() => {
        $("#things-next-button").prop("disabled", false)
    }, 3500)
}
