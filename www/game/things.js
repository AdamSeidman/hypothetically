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
